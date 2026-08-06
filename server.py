#!/usr/bin/env python3
import os
import sys
import json
import base64
import time
import urllib.parse
from http.server import HTTPServer, SimpleHTTPRequestHandler
from datetime import datetime

PORT = 8001
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
BLOGS_FILE = os.path.join(BASE_DIR, 'blogs.json')
ADMIN_PASSCODE = "admin123"

class DlimaRequestHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(204)
        self.end_headers()

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        if parsed.path == '/api/blogs':
            self.handle_get_blogs()
        else:
            super().do_GET()

    def do_POST(self):
        parsed = urllib.parse.urlparse(self.path)
        content_length = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(content_length) if content_length > 0 else b''

        if parsed.path == '/api/login':
            self.handle_login(body)
        elif parsed.path == '/api/blogs':
            self.handle_create_blog(body)
        elif parsed.path == '/api/upload':
            self.handle_upload_image(body)
        else:
            self.send_error(404, "Endpoint not found")

    def do_PUT(self):
        parsed = urllib.parse.urlparse(self.path)
        content_length = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(content_length) if content_length > 0 else b''

        if parsed.path.startswith('/api/blogs/'):
            blog_id = parsed.path.split('/')[-1]
            self.handle_update_blog(blog_id, body)
        else:
            self.send_error(404, "Endpoint not found")

    def do_DELETE(self):
        parsed = urllib.parse.urlparse(self.path)
        if parsed.path.startswith('/api/blogs/'):
            blog_id = parsed.path.split('/')[-1]
            self.handle_delete_blog(blog_id)
        else:
            self.send_error(404, "Endpoint not found")

    # --- HELPER METHODS ---

    def send_json_response(self, data, status=200):
        self.send_response(status)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.end_headers()
        self.wfile.write(json.dumps(data, indent=2).encode('utf-8'))

    def load_blogs(self):
        if os.path.exists(BLOGS_FILE):
            try:
                with open(BLOGS_FILE, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    return data
            except Exception as e:
                print(f"Error reading {BLOGS_FILE}: {e}", flush=True)
        return []

    def save_blogs(self, blogs):
        try:
            with open(BLOGS_FILE, 'w', encoding='utf-8') as f:
                json.dump(blogs, f, indent=2)
            return True
        except Exception as e:
            print(f"Error saving {BLOGS_FILE}: {e}", flush=True)
            return False

    def handle_get_blogs(self):
        blogs = self.load_blogs()
        self.send_json_response(blogs)

    def handle_login(self, body):
        try:
            payload = json.loads(body.decode('utf-8')) if body else {}
            passcode = payload.get('passcode', '')
            if passcode == ADMIN_PASSCODE:
                self.send_json_response({"success": True, "token": "admin_authenticated_session"})
            else:
                self.send_json_response({"success": False, "error": "Invalid passcode"}, status=401)
        except Exception as e:
            self.send_json_response({"success": False, "error": str(e)}, status=400)

    def handle_create_blog(self, body):
        try:
            payload = json.loads(body.decode('utf-8'))
            blogs = self.load_blogs()

            existing_ids = [int(b['id']) for b in blogs if str(b.get('id', '')).isdigit()]
            new_id = str(max(existing_ids, default=0) + 1)

            now_str = datetime.now().strftime('%A, %B %d, %Y')
            iso_now = datetime.now().isoformat()

            new_blog = {
                "id": new_id,
                "title": payload.get('title', 'Untitled Article'),
                "date": payload.get('date') or now_str,
                "tag": payload.get('tag', 'Practice Strategy'),
                "category": payload.get('category') or self.tag_to_category(payload.get('tag', '')),
                "img": payload.get('img', '150326.jpg'),
                "excerpt": payload.get('excerpt', ''),
                "content": payload.get('content', ''),
                "createdAt": iso_now,
                "status": payload.get('status', 'published')
            }

            blogs.insert(0, new_blog)
            self.save_blogs(blogs)
            self.send_json_response({"success": True, "article": new_blog})
        except Exception as e:
            self.send_json_response({"success": False, "error": str(e)}, status=400)

    def handle_update_blog(self, blog_id, body):
        try:
            payload = json.loads(body.decode('utf-8'))
            blogs = self.load_blogs()

            found = False
            updated_blog = None

            for b in blogs:
                if str(b.get('id')) == str(blog_id):
                    b['title'] = payload.get('title', b['title'])
                    b['date'] = payload.get('date', b['date'])
                    b['tag'] = payload.get('tag', b['tag'])
                    b['category'] = payload.get('category', self.tag_to_category(b['tag']))
                    b['img'] = payload.get('img', b['img'])
                    b['excerpt'] = payload.get('excerpt', b['excerpt'])
                    b['content'] = payload.get('content', b['content'])
                    b['status'] = payload.get('status', b.get('status', 'published'))
                    found = True
                    updated_blog = b
                    break

            if found:
                self.save_blogs(blogs)
                self.send_json_response({"success": True, "article": updated_blog})
            else:
                self.send_json_response({"success": False, "error": "Article not found"}, status=404)
        except Exception as e:
            self.send_json_response({"success": False, "error": str(e)}, status=400)

    def handle_delete_blog(self, blog_id):
        blogs = self.load_blogs()
        initial_len = len(blogs)
        blogs = [b for b in blogs if str(b.get('id')) != str(blog_id)]

        if len(blogs) < initial_len:
            self.save_blogs(blogs)
            self.send_json_response({"success": True, "deletedId": blog_id})
        else:
            self.send_json_response({"success": False, "error": "Article not found"}, status=404)

    def handle_upload_image(self, body):
        try:
            content_type = self.headers.get('Content-Type', '')

            if 'application/json' in content_type:
                payload = json.loads(body.decode('utf-8'))
                filename = payload.get('filename', f"blog_img_{int(time.time())}.jpg")
                filename = os.path.basename(filename).replace(' ', '_')
                base64_data = payload.get('base64Data', '')
                if ',' in base64_data:
                    base64_data = base64_data.split(',')[1]

                file_bytes = base64.b64decode(base64_data)
                target_path = os.path.join(BASE_DIR, filename)
                with open(target_path, 'wb') as f:
                    f.write(file_bytes)

                self.send_json_response({"success": True, "filename": filename, "url": filename})
            else:
                filename = self.headers.get('X-Filename', f"blog_img_{int(time.time())}.jpg")
                filename = os.path.basename(filename).replace(' ', '_')
                target_path = os.path.join(BASE_DIR, filename)
                with open(target_path, 'wb') as f:
                    f.write(body)

                self.send_json_response({"success": True, "filename": filename, "url": filename})
        except Exception as e:
            self.send_json_response({"success": False, "error": str(e)}, status=400)

    def tag_to_category(self, tag):
        tag_lower = (tag or '').lower()
        if 'startup' in tag_lower or 'clinic' in tag_lower:
            return 'startup'
        elif 'finance' in tag_lower or 'insurance' in tag_lower or 'tax' in tag_lower:
            return 'insurance'
        else:
            return 'strategy'

def run_server():
    os.chdir(BASE_DIR)
    server_address = ('', PORT)
    httpd = HTTPServer(server_address, DlimaRequestHandler)
    print(f"Dr. Melvin D'Lima Website & Blog Admin Backend running on http://localhost:{PORT}", flush=True)
    print(f"Admin Dashboard available at: http://localhost:{PORT}/admin.html", flush=True)
    httpd.serve_forever()

if __name__ == '__main__':
    run_server()
