const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  console.log(`Request: ${req.method} ${req.url}`);
  
  let filePath = req.url === '/' ? '/standalone.html' : req.url;
  filePath = path.join(__dirname, filePath);
  
  // Security check
  if (!filePath.startsWith(__dirname)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }
  
  fs.readFile(filePath, (err, data) => {
    if (err) {
      console.error('File not found:', filePath);
      res.writeHead(404);
      res.end('404 - File Not Found');
      return;
    }
    
    // Set content type based on file extension
    const ext = path.extname(filePath);
    let contentType = 'text/html';
    
    switch (ext) {
      case '.js':
        contentType = 'application/javascript';
        break;
      case '.css':
        contentType = 'text/css';
        break;
      case '.json':
        contentType = 'application/json';
        break;
    }
    
    res.writeHead(200, {
      'Content-Type': contentType,
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    res.end(data);
  });
});

const PORT = 8000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`Access your app at: http://localhost:${PORT}/standalone.html`);
  console.log(`Or directly at: http://localhost:${PORT}/`);
});
