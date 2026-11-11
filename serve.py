# Local preview of the portfolio at http://localhost:5173
# Like `python3 -m http.server`, but it tells the browser not to keep old copies of the
# files, so every refresh shows the latest version. Started by "Preview portfolio.command".
import http.server
import os
import sys

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 5173
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'site', 'yael-portfolio')


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=ROOT, **kwargs)

    def end_headers(self):
        self.send_header('Cache-Control', 'no-store')
        super().end_headers()

    def log_message(self, *args):
        pass  # keep the Terminal window quiet


class Server(http.server.ThreadingHTTPServer):
    def handle_error(self, request, client_address):
        # the browser often stops loading a video part-way; that is normal, not an error
        if isinstance(sys.exc_info()[1], (BrokenPipeError, ConnectionResetError)):
            return
        super().handle_error(request, client_address)


if __name__ == '__main__':
    print('Portfolio preview: http://localhost:%d' % PORT)
    print('Keep this window open while you look at the site. Close it to stop.')
    Server(('', PORT), Handler).serve_forever()
