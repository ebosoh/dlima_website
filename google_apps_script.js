/**
 * Dr. Melvin D'Lima Advisory - Google Apps Script Backend for Blog Articles
 * 
 * Instructions:
 * 1. Go to https://script.google.com and create a new project.
 * 2. Create a new Google Sheet (or link an existing one) titled "DLima_Website_Blogs_DB".
 * 3. Copy and paste this complete Code.gs into the Apps Script editor.
 * 4. Replace SPREADSHEET_ID below with your Google Sheet ID (from its URL).
 * 5. Click "Deploy" > "New deployment" > Select type: "Web app".
 * 6. Set "Execute as": "Me", and "Who has access": "Anyone".
 * 7. Copy the resulting Web App URL and paste it into admin.js and app.js!
 */

const SPREADSHEET_ID = "YOUR_GOOGLE_SHEET_ID_HERE"; // Insert your Google Sheet ID
const SHEET_NAME = "Blogs";
const ADMIN_PASSCODE = "dlima_admin_102026";

function doGet(e) {
  const action = e.parameter.action || "getBlogs";
  
  if (action === "getBlogs") {
    return getBlogs();
  }
  
  return jsonResponse({ success: false, error: "Invalid GET action" }, 400);
}

function doPost(e) {
  try {
    let contents = e.postData ? e.postData.contents : "";
    let data = {};
    if (contents) {
      try {
        data = JSON.parse(contents);
      } catch (err) {
        data = e.parameter;
      }
    } else {
      data = e.parameter;
    }
    
    const action = data.action || e.parameter.action;
    
    if (action === "login") {
      return handleLogin(data);
    } else if (action === "createBlog") {
      return createBlog(data);
    } else if (action === "updateBlog") {
      return updateBlog(data);
    } else if (action === "deleteBlog") {
      return deleteBlog(data);
    } else if (action === "uploadImage") {
      return uploadImageToDrive(data);
    }
    
    return jsonResponse({ success: false, error: "Invalid POST action" }, 400);
  } catch (error) {
    return jsonResponse({ success: false, error: error.toString() }, 500);
  }
}

// --- HELPER FUNCTIONS ---

function getSheet() {
  let ss;
  if (SPREADSHEET_ID && SPREADSHEET_ID !== "YOUR_GOOGLE_SHEET_ID_HERE") {
    ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  } else {
    ss = SpreadsheetApp.getActiveSpreadsheet();
  }
  
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    // Add header row
    sheet.appendRow(["id", "title", "date", "tag", "category", "img", "excerpt", "content", "createdAt", "status"]);
    sheet.getRange(1, 1, 1, 10).setFontWeight("bold").setBackground("#0f172a").setFontColor("#01dfc9");
  }
  return sheet;
}

function getBlogs() {
  const sheet = getSheet();
  const rows = sheet.getDataRange().getValues();
  if (rows.length <= 1) {
    return jsonResponse([]);
  }
  
  const headers = rows[0];
  const blogs = [];
  
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row[0]) continue; // Skip empty id
    const blog = {};
    for (let j = 0; j < headers.length; j++) {
      blog[headers[j]] = row[j];
    }
    blogs.push(blog);
  }
  
  // Sort descending by id
  blogs.sort((a, b) => Number(b.id) - Number(a.id));
  
  return jsonResponse(blogs);
}

function handleLogin(data) {
  if (data.passcode === ADMIN_PASSCODE) {
    return jsonResponse({ success: true, token: "admin_authenticated_session" });
  } else {
    return jsonResponse({ success: false, error: "Invalid security passcode" });
  }
}

function createBlog(data) {
  const sheet = getSheet();
  const rows = sheet.getDataRange().getValues();
  let maxId = 0;
  
  for (let i = 1; i < rows.length; i++) {
    const currId = Number(rows[i][0]);
    if (!isNaN(currId) && currId > maxId) {
      maxId = currId;
    }
  }
  
  const newId = String(maxId + 1);
  const nowStr = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "EEEE, MMMM dd, yyyy");
  const isoNow = new Date().toISOString();
  
  const title = data.title || "Untitled Article";
  const date = data.date || nowStr;
  const tag = data.tag || "Practice Strategy";
  const category = data.category || (tag.toLowerCase().includes("startup") ? "startup" : (tag.toLowerCase().includes("insurance") ? "insurance" : "strategy"));
  const img = data.img || "150326.jpg";
  const excerpt = data.excerpt || "";
  const content = data.content || "";
  const status = data.status || "published";
  
  sheet.appendRow([newId, title, date, tag, category, img, excerpt, content, isoNow, status]);
  
  const newBlog = {
    id: newId,
    title: title,
    date: date,
    tag: tag,
    category: category,
    img: img,
    excerpt: excerpt,
    content: content,
    createdAt: isoNow,
    status: status
  };
  
  return jsonResponse({ success: true, article: newBlog });
}

function updateBlog(data) {
  const sheet = getSheet();
  const rows = sheet.getDataRange().getValues();
  const idToUpdate = String(data.id);
  let foundRowIndex = -1;
  
  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][0]) === idToUpdate) {
      foundRowIndex = i + 1; // 1-indexed row for Range
      break;
    }
  }
  
  if (foundRowIndex === -1) {
    return jsonResponse({ success: false, error: "Article ID not found" });
  }
  
  const existing = rows[foundRowIndex - 1];
  const title = data.title !== undefined ? data.title : existing[1];
  const date = data.date !== undefined ? data.date : existing[2];
  const tag = data.tag !== undefined ? data.tag : existing[3];
  const category = data.category !== undefined ? data.category : existing[4];
  const img = data.img !== undefined ? data.img : existing[5];
  const excerpt = data.excerpt !== undefined ? data.excerpt : existing[6];
  const content = data.content !== undefined ? data.content : existing[7];
  const createdAt = existing[8];
  const status = data.status !== undefined ? data.status : existing[9];
  
  sheet.getRange(foundRowIndex, 1, 1, 10).setValues([[idToUpdate, title, date, tag, category, img, excerpt, content, createdAt, status]]);
  
  return jsonResponse({
    success: true,
    article: { id: idToUpdate, title, date, tag, category, img, excerpt, content, createdAt, status }
  });
}

function deleteBlog(data) {
  const sheet = getSheet();
  const rows = sheet.getDataRange().getValues();
  const idToDelete = String(data.id);
  
  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][0]) === idToDelete) {
      sheet.deleteRow(i + 1);
      return jsonResponse({ success: true, deletedId: idToDelete });
    }
  }
  
  return jsonResponse({ success: false, error: "Article ID not found" });
}

function uploadImageToDrive(data) {
  try {
    let base64Str = data.base64Data || "";
    if (base64Str.indexOf(",") !== -1) {
      base64Str = base64Str.split(",")[1];
    }
    
    const blob = Utilities.newBlob(Utilities.base64Decode(base64Str), data.mimeType || "image/jpeg", data.filename || "blog_cover.jpg");
    
    // Save to root Drive or specific folder
    const file = DriveApp.createFile(blob);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    
    const viewUrl = "https://lh3.googleusercontent.com/d/" + file.getId();
    return jsonResponse({ success: true, filename: data.filename, url: viewUrl, fileId: file.getId() });
  } catch (err) {
    return jsonResponse({ success: false, error: err.toString() });
  }
}

function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
