const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 3000;
const PROGRESS_FILE = path.join(__dirname, 'progress.txt');

function readProgress() {
    try {
        if (fs.existsSync(PROGRESS_FILE)) {
            const data = fs.readFileSync(PROGRESS_FILE, 'utf8');
            return parseInt(data.trim()) || 0;
        }
        return 0;
    } catch (error) {
        console.error('Error reading progress:', error);
        return 0;
    }
}

function writeProgress(count) {
    try {
        fs.writeFileSync(PROGRESS_FILE, count.toString());
        return true;
    } catch (error) {
        console.error('Error writing progress:', error);
        return false;
    }
}

function serveFile(res, filePath, contentType) {
    try {
        const content = fs.readFileSync(filePath);
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content);
    } catch (error) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('File not found');
    }
}

function handleAPI(req, res, pathname) {
    if (pathname === '/api/progress') {
        if (req.method === 'GET') {
            const count = readProgress();
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ count }));
        } else if (req.method === 'POST') {
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });
            req.on('end', () => {
                try {
                    const { count } = JSON.parse(body);
                    if (typeof count === 'number' && count >= 0 && count <= 100) {
                        const success = writeProgress(count);
                        if (success) {
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ success: true, count }));
                        } else {
                            res.writeHead(500, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ success: false, error: 'Failed to save progress' }));
                        }
                    } else {
                        res.writeHead(400, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ success: false, error: 'Invalid count value' }));
                    }
                } catch (error) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, error: 'Invalid JSON' }));
                }
            });
        } else {
            res.writeHead(405, { 'Content-Type': 'text/plain' });
            res.end('Method not allowed');
        }
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('API endpoint not found');
    }
}

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    if (pathname.startsWith('/api/')) {
        handleAPI(req, res, pathname);
    } else if (pathname === '/' || pathname === '/index.html') {
        serveFile(res, path.join(__dirname, 'index.html'), 'text/html');
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Page not found');
    }
});

server.listen(PORT, () => {
    console.log(`🐗 WoW Boar Quest Tracker running at http://localhost:${PORT}`);
    console.log(`Password: boarhunter123`);
    console.log(`Progress file: ${PROGRESS_FILE}`);
});

process.on('SIGINT', () => {
    console.log('\nShutting down server...');
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});
