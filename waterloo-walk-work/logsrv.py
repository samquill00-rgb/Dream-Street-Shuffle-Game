import http.server, sys
class H(http.server.BaseHTTPRequestHandler):
    def do_POST(self):
        n=int(self.headers.get('Content-Length',0)); d=self.rfile.read(n).decode('utf8','replace')
        open('safari-log.txt','a').write(d+'\n'); self.send_response(204); self.send_header('Access-Control-Allow-Origin','*'); self.end_headers()
    def log_message(self,*a): pass
http.server.HTTPServer(('127.0.0.1',8798),H).serve_forever()
