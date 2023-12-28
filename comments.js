// create web server

// 1. load module
var http = require('http');
var fs = require('fs');
var path = require('path');
var url = require('url');

// 2. create server
http.createServer(function(request, response) {
    // 3. get url
    var urlObj = url.parse(request.url);
    var pathName = urlObj.pathname;

    // 4. read file
    if (pathName == '/') {
        showIndex(response);
    } else if (pathName == '/list') {
        showList(response);
    } else if (pathName == '/image.png') {
        showImage(response);
    } else if (pathName == '/upload' && request.method == 'POST') {
        uploadFile(request, response);
    } else if (pathName.indexOf('/upload?') >= 0 && request.method == 'GET') {
        show404(response);
    } else {
        var filePath = path.join(__dirname, pathName);
        fs.readFile(filePath, function(err, data) {
            if (err) {
                console.log(err);
                response.end('404 Not Found.');
            }
            response.end(data);
        });
    }
}).listen(8080);

console.log('Server is running at http://