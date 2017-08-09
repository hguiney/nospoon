// http://stackoverflow.com/a/12022746/214325
var
	http = require('http')
	, util = require('util')
	//, querystring = require('querystring')
	, jsdom = require('jsdom')
	, fs = require('fs')
;

function postRequest(request, response, callback) {
	var queryData = "";
	if(typeof callback !== 'function') return null;
	
	if(request.method == 'POST') {
		request.on('data', function(data) {
			queryData += data;
			
			if(queryData.length > 1e6) {
				queryData = "";
				request.writeHead(413, {'Content-Type': 'text/plain'});
				request.connection.destroy();
			}
			
		});
		
		request.on('end', function() {
			response.post = queryData;
			callback();
		});
	} else {
		response.writeHead(405, {'Content-Type': 'text/plain'});
		response.end();
	}
}

http.createServer(function(request, response) {
	postRequest(request, response, function() {
		var
			contentType = request.headers['content-type']
			, mimeType = contentType.substr(0, contentType.indexOf(';'))
		;

		console.log(mimeType);
		
		if (
			(mimeType !== 'text/html')
			&& (mimeType !== 'application/xhtml+xml')
		) {
			response.writeHead(415, "Unsupported Media Type", {'Content-Type': 'text/plain'});
			response.write('Sorry bro, no can do!');
			response.end();
		}
		
		response.writeHead(200, "OK", { 'Content-Type': contentType });
		
		//var ho = fs.readFileSync(__dirname + '/HTMLOutliner.js').toString();
		
		jsdom.env({
			html: response.post
			, scripts: [
				'http://code.jquery.com/jquery-1.8.1.min.js'
				, 'HTMLOutliner.js' // http://site.nospoon.tv/script/
			]
		}, function (err, window) {
			var 
				$ = window.jQuery
				, document = window.document
			;	
		
			window.HTMLOutline(document.body);
			$('h1, h2, h3, h4, h5, h6').each(function (){
				var
					heading = $(this),
					parent = heading.parent(),
					parentNodeName = parent.prop('nodeName').toLowerCase()
				;
				
				if (parentNodeName == 'hgroup') {
					heading.parent().attr({
						'role': 'heading',
						'aria-level': this.depth
					});
				} else {
					heading.attr('aria-level', this.depth);
				}
			});
			
			$('script.jsdom').remove();
		
			var test = document.outerHTML.replace('viewbox=', 'viewBox='); // dirty dirty hack
			//test = test.replace('foreignobject', 'foreignObject');
		
			response.write(test);
			console.log(test);
			response.end();
		});
	});
}).listen(1337);
