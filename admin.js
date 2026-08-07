/**
 * Dr. Melvin D'Lima Advisory Website - Blog Admin Portal JS
 */

const API_BASE = ''; // Same origin or relative path e.g. http://localhost:8001
let APPS_SCRIPT_URL = localStorage.getItem('dlima_apps_script_url') || '';
let articlesData = [];

document.addEventListener('DOMContentLoaded', () => {
    initAuth();
    initNavigation();
    initAppsScriptConfig();
    initForm();
    initEditorToolbar();
    initImageUploader();
    initSearch();
    setDefaultDate();
});

function initAppsScriptConfig() {
    const btnConfig = document.getElementById('btn-config-appscript');
    const banner = document.getElementById('appscript-config-banner');
    const input = document.getElementById('appscript-url-input');
    const btnSave = document.getElementById('btn-save-appscript-url');
    const passcodeBtn = document.getElementById('btn-save-custom-passcode');
    const passcodeInput = document.getElementById('custom-passcode-input');

    if (input && APPS_SCRIPT_URL) {
        input.value = APPS_SCRIPT_URL;
    }

    if (btnConfig && banner) {
        btnConfig.addEventListener('click', () => {
            banner.classList.toggle('d-none');
        });
    }

    if (btnSave && input) {
        btnSave.addEventListener('click', () => {
            const url = input.value.trim();
            if (url) {
                localStorage.setItem('dlima_apps_script_url', url);
                APPS_SCRIPT_URL = url;
                showToast('Google Apps Script URL saved successfully!', 'success');
                banner.classList.add('d-none');
                loadArticles();
            } else {
                localStorage.removeItem('dlima_apps_script_url');
                APPS_SCRIPT_URL = '';
                showToast('Apps Script URL cleared.', 'info');
            }
        });
    }

    if (passcodeBtn && passcodeInput) {
        passcodeBtn.addEventListener('click', () => {
            const newCode = passcodeInput.value.trim();
            if (newCode) {
                localStorage.setItem('dlima_admin_passcode', newCode);
                showToast('Security passcode updated successfully!', 'success');
                passcodeInput.value = '';
                banner.classList.add('d-none');
            } else {
                showToast('Please enter a valid passcode.', 'warning');
            }
        });
    }
}

/* ==========================================================================
   1. Authentication & Session Management
   ========================================================================== */
function initAuth() {
    const authOverlay = document.getElementById('admin-auth-overlay');
    const adminApp = document.getElementById('admin-app');
    const loginForm = document.getElementById('admin-login-form');
    const errorMsg = document.getElementById('login-error-msg');
    const logoutBtn = document.getElementById('admin-logout-btn');

    // Check if session token exists
    const sessionToken = localStorage.getItem('dlima_admin_token');
    if (sessionToken === 'admin_authenticated_session') {
        showApp();
    } else {
        authOverlay.classList.remove('d-none');
        adminApp.classList.add('d-none');
    }

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const passcode = document.getElementById('admin-passcode').value.trim();
        const configuredPasscode = localStorage.getItem('dlima_admin_passcode') || 'dlima_admin_102026';

        if (APPS_SCRIPT_URL) {
            try {
                const res = await fetch(APPS_SCRIPT_URL, {
                    method: 'POST',
                    body: JSON.stringify({ action: 'login', passcode })
                });
                const data = await res.json();
                if (data.success) {
                    localStorage.setItem('dlima_admin_token', 'admin_authenticated_session');
                    errorMsg.classList.add('d-none');
                    showApp();
                    showToast('Authenticated via Google Apps Script!', 'success');
                    return;
                }
            } catch (err) {
                console.warn('Apps Script login check error:', err);
            }
        }

        try {
            const res = await fetch(`${API_BASE}/api/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ passcode })
            });
            const data = await res.json();

            if (data.success) {
                localStorage.setItem('dlima_admin_token', data.token);
                errorMsg.classList.add('d-none');
                showApp();
                showToast('Authentication successful. Welcome to the portal!', 'success');
            } else {
                errorMsg.classList.remove('d-none');
            }
        } catch (err) {
            // Fallback for static browser authentication
            if (passcode === configuredPasscode) {
                localStorage.setItem('dlima_admin_token', 'admin_authenticated_session');
                errorMsg.classList.add('d-none');
                showApp();
                showToast('Authenticated successfully.', 'success');
            } else {
                errorMsg.classList.remove('d-none');
            }
        }
    });

    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('dlima_admin_token');
        window.location.reload();
    });
}

function showApp() {
    document.getElementById('admin-auth-overlay').classList.add('d-none');
    document.getElementById('admin-app').classList.remove('d-none');
    loadArticles();
}

/* ==========================================================================
   2. Navigation & Tabs
   ========================================================================== */
function initNavigation() {
    const navItems = document.querySelectorAll('.sidebar-nav .nav-item[data-tab]');
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const tabName = item.getAttribute('data-tab');
            switchAdminTab(tabName);
        });
    });

    document.getElementById('btn-quick-new').addEventListener('click', () => {
        resetForm();
        switchAdminTab('editor');
    });

    document.getElementById('btn-cancel-edit').addEventListener('click', () => {
        resetForm();
        switchAdminTab('articles');
    });
}

function switchAdminTab(tabName) {
    document.querySelectorAll('.sidebar-nav .nav-item[data-tab]').forEach(el => {
        el.classList.toggle('active', el.getAttribute('data-tab') === tabName);
    });

    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });

    const targetTab = document.getElementById(`tab-${tabName}`);
    if (targetTab) {
        targetTab.classList.add('active');
    }

    const headingMap = {
        'dashboard': 'Blog Strategy Dashboard',
        'editor': 'Strategy Article Editor',
        'articles': 'All Strategy Articles'
    };
    document.getElementById('topbar-heading').textContent = headingMap[tabName] || 'Blog Strategy Dashboard';
}

/* ==========================================================================
   3. Data Fetching & Table Rendering
   ========================================================================== */
async function loadArticles() {
    if (APPS_SCRIPT_URL) {
        try {
            const res = await fetch(`${APPS_SCRIPT_URL}?action=getBlogs`);
            if (res.ok) {
                const list = await res.json();
                if (Array.isArray(list)) {
                    articlesData = list;
                    renderStats();
                    renderTables();
                    return;
                }
            }
        } catch (err) {
            console.warn('Apps Script load error, falling back:', err);
        }
    }

    try {
        const res = await fetch(`${API_BASE}/api/blogs`);
        if (!res.ok) throw new Error('API fetch failed');
        articlesData = await res.json();
    } catch (err) {
        console.warn('Could not connect to API, fetching local blogs.json fallback:', err);
        try {
            const fallbackRes = await fetch('blogs.json');
            articlesData = await fallbackRes.json();
        } catch (e) {
            articlesData = [];
        }
    }

    renderStats();
    renderTables();
}

function renderStats() {
    document.getElementById('stat-total-articles').textContent = articlesData.length;
    const publishedCount = articlesData.filter(a => a.status === 'published').length;
    document.getElementById('stat-published-articles').textContent = publishedCount;

    const categories = new Set(articlesData.map(a => a.tag));
    document.getElementById('stat-total-categories').textContent = categories.size || 3;
}

function renderTables(searchTerm = '') {
    const recentTbody = document.getElementById('recent-articles-tbody');
    const allTbody = document.getElementById('all-articles-tbody');

    const filtered = articlesData.filter(a => {
        if (!searchTerm) return true;
        const term = searchTerm.toLowerCase();
        return (a.title && a.title.toLowerCase().includes(term)) ||
               (a.tag && a.tag.toLowerCase().includes(term)) ||
               (a.category && a.category.toLowerCase().includes(term));
    });

    // Recent 5
    recentTbody.innerHTML = filtered.slice(0, 5).map(article => `
        <tr>
            <td class="font-weight-bold">${escapeHtml(article.title)}</td>
            <td><span class="badge badge-navy">${escapeHtml(article.tag || 'Strategy')}</span></td>
            <td><small>${escapeHtml(article.date)}</small></td>
            <td><span class="badge badge-success">${escapeHtml(article.status || 'published')}</span></td>
            <td>
                <button class="btn btn-xs btn-outline-primary" onclick="editArticle('${article.id}')" title="Edit Article">
                    <i class="fas fa-edit"></i> Edit
                </button>
            </td>
        </tr>
    `).join('') || '<tr><td colspan="5" class="text-center text-muted">No articles found.</td></tr>';

    // All Articles Table
    allTbody.innerHTML = filtered.map(article => `
        <tr>
            <td><code>#${article.id}</code></td>
            <td>
                <img src="${article.img || '150326.jpg'}" alt="Thumb" class="table-thumb">
            </td>
            <td>
                <strong>${escapeHtml(article.title)}</strong>
                <div class="table-excerpt-preview">${escapeHtml(article.excerpt || '')}</div>
            </td>
            <td><span class="badge badge-gold">${escapeHtml(article.tag || 'Strategy')}</span></td>
            <td><small>${escapeHtml(article.date)}</small></td>
            <td><span class="badge ${article.status === 'draft' ? 'badge-warning' : 'badge-success'}">${escapeHtml(article.status || 'published')}</span></td>
            <td>
                <div class="action-btn-group">
                    <button class="btn btn-xs btn-outline-primary" onclick="editArticle('${article.id}')" title="Edit Article">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-xs btn-outline-secondary" onclick="previewArticleById('${article.id}')" title="Preview Modal">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-xs btn-outline-danger" onclick="deleteArticle('${article.id}')" title="Delete Article">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('') || '<tr><td colspan="7" class="text-center text-muted">No articles found.</td></tr>';
}

function initSearch() {
    const searchInput = document.getElementById('admin-article-search');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            renderTables(e.target.value.trim());
        });
    }
}

/* ==========================================================================
   4. Form & Article Creation / Modification
   ========================================================================== */
function initForm() {
    const form = document.getElementById('article-form');
    form.addEventListener('submit', handleFormSubmit);

    document.getElementById('btn-preview-article').addEventListener('click', openLivePreviewModal);
    document.getElementById('preview-modal-close').addEventListener('click', closePreviewModal);
}

function setDefaultDate() {
    const dateInput = document.getElementById('article-date');
    if (dateInput && !dateInput.value) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        dateInput.value = new Date().toLocaleDateString('en-US', options);
    }
}

async function handleFormSubmit(e) {
    e.preventDefault();

    const editId = document.getElementById('article-edit-id').value;
    const title = document.getElementById('article-title').value.trim();
    const tag = document.getElementById('article-tag').value;
    const date = document.getElementById('article-date').value.trim() || new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const status = document.getElementById('article-status').value;
    const img = document.getElementById('article-img-filename').value || '150326.jpg';
    const excerpt = document.getElementById('article-excerpt').value.trim();
    const content = document.getElementById('article-content').value.trim();

    const payload = { title, tag, date, status, img, excerpt, content };

    if (APPS_SCRIPT_URL) {
        try {
            const action = editId ? 'updateBlog' : 'createBlog';
            const res = await fetch(APPS_SCRIPT_URL, {
                method: 'POST',
                body: JSON.stringify({ action, id: editId, ...payload })
            });
            const data = await res.json();
            if (data.success) {
                showToast(editId ? 'Article updated on Google Sheet!' : 'New article published to Google Sheet!', 'success');
                resetForm();
                await loadArticles();
                switchAdminTab('articles');
                return;
            }
        } catch (err) {
            console.warn('Apps Script save error:', err);
        }
    }

    try {
        let res;
        if (editId) {
            // Update
            res = await fetch(`${API_BASE}/api/blogs/${editId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
        } else {
            // Create
            res = await fetch(`${API_BASE}/api/blogs`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
        }

        const data = await res.json();
        if (data.success) {
            showToast(editId ? 'Article updated successfully!' : 'New article published successfully!', 'success');
            resetForm();
            await loadArticles();
            switchAdminTab('articles');
        } else {
            showToast('Error saving article: ' + (data.error || 'Unknown error'), 'danger');
        }
    } catch (err) {
        console.warn('API error during save, performing offline memory update:', err);
        if (editId) {
            const idx = articlesData.findIndex(a => String(a.id) === String(editId));
            if (idx !== -1) {
                articlesData[idx] = { ...articlesData[idx], ...payload };
            }
        } else {
            const newId = String(articlesData.length + 1);
            articlesData.unshift({ id: newId, ...payload, createdAt: new Date().toISOString() });
        }
        renderStats();
        renderTables();
        showToast('Saved to local session store!', 'info');
        resetForm();
        switchAdminTab('articles');
    }
}

function editArticle(id) {
    const article = articlesData.find(a => String(a.id) === String(id));
    if (!article) return;

    document.getElementById('article-edit-id').value = article.id;
    document.getElementById('article-title').value = article.title || '';
    document.getElementById('article-tag').value = article.tag || 'Practice Strategy';
    document.getElementById('article-date').value = article.date || '';
    document.getElementById('article-status').value = article.status || 'published';
    document.getElementById('article-excerpt').value = article.excerpt || '';
    document.getElementById('article-content').value = article.content || '';

    // Image preview setting
    const filename = article.img || '150326.jpg';
    document.getElementById('article-img-filename').value = filename;
    document.getElementById('upload-preview-img').src = filename;
    document.getElementById('upload-preview-name').textContent = filename;
    document.getElementById('upload-dropzone').classList.add('d-none');
    document.getElementById('upload-preview-container').classList.remove('d-none');

    // UI Heading Adjust
    document.getElementById('editor-title-heading').innerHTML = `<i class="fas fa-edit"></i> Edit Article #${article.id}`;
    document.getElementById('btn-cancel-edit').classList.remove('d-none');
    document.getElementById('btn-save-article').innerHTML = `<i class="fas fa-save"></i> Save Changes to Article`;

    switchAdminTab('editor');
}

async function deleteArticle(id) {
    if (!confirm(`Are you sure you want to delete article #${id}? This action cannot be undone.`)) return;

    if (APPS_SCRIPT_URL) {
        try {
            const res = await fetch(APPS_SCRIPT_URL, {
                method: 'POST',
                body: JSON.stringify({ action: 'deleteBlog', id })
            });
            const data = await res.json();
            if (data.success) {
                showToast('Article deleted from Google Sheet.', 'info');
                await loadArticles();
                return;
            }
        } catch (err) {
            console.warn('Apps Script delete error:', err);
        }
    }

    try {
        const res = await fetch(`${API_BASE}/api/blogs/${id}`, { method: 'DELETE' });
        const data = await res.json();
        if (data.success) {
            showToast('Article deleted successfully.', 'info');
            await loadArticles();
        } else {
            showToast('Error deleting article: ' + (data.error || 'Unknown error'), 'danger');
        }
    } catch (err) {
        articlesData = articlesData.filter(a => String(a.id) !== String(id));
        renderStats();
        renderTables();
        showToast('Article removed from local session store.', 'info');
    }
}

function resetForm() {
    document.getElementById('article-form').reset();
    document.getElementById('article-edit-id').value = '';
    document.getElementById('article-img-filename').value = '150326.jpg';
    
    document.getElementById('upload-dropzone').classList.remove('d-none');
    document.getElementById('upload-preview-container').classList.add('d-none');

    document.getElementById('editor-title-heading').innerHTML = `<i class="fas fa-plus-circle"></i> Create New Strategy Article`;
    document.getElementById('btn-cancel-edit').classList.add('d-none');
    document.getElementById('btn-save-article').innerHTML = `<i class="fas fa-paper-plane"></i> Publish Strategy Article`;
    setDefaultDate();
}

/* ==========================================================================
   5. Image Uploader & Drag-and-Drop
   ========================================================================== */
function initImageUploader() {
    const dropzone = document.getElementById('upload-dropzone');
    const fileInput = document.getElementById('cover-image-input');
    const previewContainer = document.getElementById('upload-preview-container');
    const previewImg = document.getElementById('upload-preview-img');
    const previewName = document.getElementById('upload-preview-name');
    const btnChange = document.getElementById('btn-change-image');

    dropzone.addEventListener('click', () => fileInput.click());

    dropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropzone.classList.add('dragover');
    });

    dropzone.addEventListener('dragleave', () => {
        dropzone.classList.remove('dragover');
    });

    dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropzone.classList.remove('dragover');
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileUpload(e.dataTransfer.files[0]);
        }
    });

    fileInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
            handleFileUpload(e.target.files[0]);
        }
    });

    btnChange.addEventListener('click', () => {
        fileInput.value = '';
        dropzone.classList.remove('d-none');
        previewContainer.classList.add('d-none');
    });
}

function handleFileUpload(file) {
    if (!file.type.startsWith('image/')) {
        showToast('Please select a valid image file (JPG, PNG, WEBP).', 'warning');
        return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
        const base64Data = e.target.result;
        const filename = file.name.replace(/\s+/g, '_');

        // Show immediate local preview
        document.getElementById('upload-preview-img').src = base64Data;
        document.getElementById('upload-preview-name').textContent = filename;
        document.getElementById('article-img-filename').value = filename;

        document.getElementById('upload-dropzone').classList.add('d-none');
        document.getElementById('upload-preview-container').classList.remove('d-none');

        // Send to backend API
        try {
            const res = await fetch(`${API_BASE}/api/upload`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ filename, base64Data })
            });
            const data = await res.json();
            if (data.success) {
                document.getElementById('article-img-filename').value = data.filename;
                showToast('Image uploaded successfully to server!', 'success');
            }
        } catch (err) {
            console.log('Image uploaded locally in preview mode:', filename);
        }
    };
    reader.readAsDataURL(file);
}

/* ==========================================================================
   6. Rich Editor Toolbar Helpers
   ========================================================================== */
function initEditorToolbar() {
    const buttons = document.querySelectorAll('.editor-toolbar .toolbar-btn');
    const textarea = document.getElementById('article-content');

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            const tag = btn.getAttribute('data-tag');
            insertHTMLSnippet(textarea, tag);
        });
    });
}

function insertHTMLSnippet(textarea, tag) {
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end) || 'Sample text';
    let snippet = '';

    switch (tag) {
        case 'h3':
            snippet = `\n<h3>${selectedText}</h3>\n`;
            break;
        case 'p':
            snippet = `\n<p>${selectedText}</p>\n`;
            break;
        case 'strong':
            snippet = `<strong>${selectedText}</strong>`;
            break;
        case 'ul':
            snippet = `\n<ul>\n    <li>${selectedText}</li>\n    <li>Second point...</li>\n</ul>\n`;
            break;
        case 'ol':
            snippet = `\n<ol>\n    <li>${selectedText}</li>\n    <li>Second step...</li>\n</ol>\n`;
            break;
        case 'blockquote':
            snippet = `\n<blockquote>${selectedText}</blockquote>\n`;
            break;
        case 'callout-tip':
            snippet = `\n<div class="strategy-callout-box">\n    <h4><i class="fas fa-lightbulb"></i> Executive Insight</h4>\n    <p>${selectedText}</p>\n</div>\n`;
            break;
        default:
            snippet = selectedText;
    }

    textarea.value = textarea.value.substring(0, start) + snippet + textarea.value.substring(end);
    textarea.focus();
}

/* ==========================================================================
   7. Live Article Preview Modal
   ========================================================================== */
function openLivePreviewModal() {
    const title = document.getElementById('article-title').value.trim() || 'Article Title Preview';
    const tag = document.getElementById('article-tag').value || 'Practice Strategy';
    const date = document.getElementById('article-date').value.trim() || 'Today';
    const imgSrc = document.getElementById('upload-preview-img').src || '150326.jpg';
    const content = document.getElementById('article-content').value.trim() || '<p>Article content preview will appear here...</p>';

    document.getElementById('preview-blog-title').textContent = title;
    document.getElementById('preview-blog-tag').textContent = tag;
    document.getElementById('preview-blog-date').textContent = date;
    document.getElementById('preview-blog-img').src = imgSrc;
    document.getElementById('preview-blog-body').innerHTML = content;

    document.getElementById('preview-modal').classList.remove('d-none');
}

function previewArticleById(id) {
    const article = articlesData.find(a => String(a.id) === String(id));
    if (!article) return;

    document.getElementById('preview-blog-title').textContent = article.title;
    document.getElementById('preview-blog-tag').textContent = article.tag;
    document.getElementById('preview-blog-date').textContent = article.date;
    document.getElementById('preview-blog-img').src = article.img || '150326.jpg';
    document.getElementById('preview-blog-body').innerHTML = article.content;

    document.getElementById('preview-modal').classList.remove('d-none');
}

function closePreviewModal() {
    document.getElementById('preview-modal').classList.add('d-none');
}

/* ==========================================================================
   8. Utility Toast Notifications & Helpers
   ========================================================================== */
function showToast(message, type = 'info') {
    const container = document.getElementById('admin-toast-container');
    const toast = document.createElement('div');
    toast.className = `admin-toast toast-${type}`;

    const icons = {
        success: 'fa-check-circle',
        danger: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };

    toast.innerHTML = `
        <i class="fas ${icons[type] || 'fa-info-circle'}"></i>
        <span>${escapeHtml(message)}</span>
    `;

    container.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(-10px)';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
