/*jshint laxcomma: true, smarttabs: true */
//(function () {"use strict";

/* Convenience Functions */

function getById( id )
{
	var el = document.getElementById( id );

	return el;
}

function getByClass( className, index )
{
	var el = document.getElementsByClassName( className );

	if ( index >= 0 )
	{
		return el.item(index);
	}

	return el;
}

function ucfirst( str )
{
    // http://kevin.vanzonneveld.net
    // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   bugfixed by: Onno Marsman
    // +   improved by: Brett Zamir (http://brett-zamir.me)
    // *     example 1: ucfirst('kevin van zonneveld');
    // *     returns 1: 'Kevin van zonneveld'
    str += '';
    var f = str.charAt(0).toUpperCase();
    return f + str.substr(1);
}

// http://davidchambersdesign.com/escaping-html-in-javascript/
function makeSafe( text )
{
	return text.replace(/[&<>"'`]/g, function (chr) {
		return '&#' + chr.charCodeAt(0) + ';';
	});
}

// trim11: http://blog.stevenlevithan.com/archives/faster-trim-javascript
function trim ( str )
{
	str = str.replace( /^\s+/, '' );

	for ( var i = str.length - 1; i >= 0; --i )
	{
		if ( /\S/.test( str.charAt(i) ) )
		{
			str = str.substring( 0, i + 1 );
			break;
		}
	}

	return str;
}

// http://studiokoi.com/blog/article/typechecking_arrays_in_javascript
function isArray( a )
{
	return Object.prototype.toString.apply(a) === '[object Array]';
}

function isObject( a )
{
	return Object.prototype.toString.apply(a) === '[object Object]';
}

// http://stackoverflow.com/a/1359808/214325
function sortObject( o ) {
	var
		sorted = {}
		, key
		, a = []
	;

	for ( key in o ) {
		if ( o.hasOwnProperty( key ) ) {
			a.push( key );
		}
	}

	a.sort();

	for ( key = 0; key < a.length; ++key ) {
		sorted[ a[key] ] = o[ a[key] ];
	}

	return sorted;
}

// http://stackoverflow.com/a/383245/214325
function mergeRecursive(obj1, obj2) {
	for (var p in obj2) {
		try
		{
			// Property in destination object set; update its value.
			if ( obj2[p].constructor == Object )
			{
				obj1[p] = mergeRecursive( obj1[p], obj2[p] );
			}
			else
			{
				obj1[p] = obj2[p];
			}
		}
		catch( e )
		{
			// Property in destination object not set; create it and set its value.
			obj1[p] = obj2[p];
		}
	}

	return obj1;
}

function buildGETRequest( baseUrl, endpoint, params )
{
	var
		apiCall = baseUrl + endpoint
		, param
		, i = 0
	;

	for ( param in params )
	{
		apiCall += ( i === 0 ) ? '?' : '&';
		apiCall += param + '=' + encodeURIComponent( params[param] );
		++i;
	}

	return apiCall;
}

// http://phpjs.org/functions/isset/
function isset ()
{
	// http://kevin.vanzonneveld.net
	// +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	// +   improved by: FremyCompany
	// +   improved by: Onno Marsman
	// +   improved by: Rafał Kukawski
	// *     example 1: isset( undefined, true);
	// *     returns 1: false
	// *     example 2: isset( 'Kevin van Zonneveld' );
	// *     returns 2: true
	var
		a = arguments,
		l = a.length,
		i = 0,
		undef
	;

	if ( l === 0 )
	{
		throw new Error('Empty isset');
	}

	while ( i !== l )
	{
		if ( a[i] === undef || a[i] === null )
		{
			return false;
		}
		++i;
	}

	return true;
}

// Modified from: http://net.tutsplus.com/articles/news/how-to-make-ajax-requests-with-raw-javascript/
function ajaxCall( url, callback, async )
{
	var
		  xhr = new XMLHttpRequest() // Sorry old browsers
		, response
	;

	if ( typeof async === 'undefined' )
	{
		async = true;
	}

	xhr.onreadystatechange = ensureReadiness;

	function ensureReadiness()
	{
		if ( (xhr.readyState < 4) || (xhr.status !== 200) )
		{
			console.log( 'not ready', xhr.readyState );
			return;
		}

		if ( xhr.readyState === 4 )
		{
			console.log( callback );

			response = callback( xhr );
			console.log( 'callback called', response );
		}
	}

	console.log( 'xhr', xhr );
	console.log( 'url', url );
	console.log( 'async', async );

	xhr.open( 'GET', url, async );
	xhr.send( null );

	if ( isset( response ) ) {
		console.log('response', response);
		return response;
	} else {
		console.log('no response', response);
	}
}

function getUrlSlug( string ) {
}

function getSlug( string, type, clean ) {
	clean = clean || false;
	string = trim( string ).replace(/\s+/, ' ');
	type = type || 'lower-dash';
	type = type.toLowerCase();

	var
		  superfluous = ['a', 'an', 'and', 'the', 'of']
		, parts
		, keepWords = []
		, slug
		, nonLettersNonNumbers = XRegExp('[^\\p{L}\\p{N}]+') // http://www.designerstalk.com/forums/programming/17819-php-remove-punctuation.html#post160416
	;

	parts = string.toLowerCase().split(' ');

	switch ( type )
	{
		case 'camel':
		case 'camelcase':
			parts.forEach(
				function ( part, i, parts )
				{
					if ( superfluous.indexOf( part ) === -1 )
					{
						var lower = ( i > 0) ? false : true;

						if ( clean )
						{
							part = part.replace(nonLettersNonNumbers, '');
							// if ( trim( part ) === '' ) throw Error; @todo
						}

						if ( lower )
						{
							keepWords.push( part );
						}
						else
						{
							keepWords.push( ucfirst( part ) );
						}
					}
				}
			);
		break;

		default:
			parts.forEach(
				function ( part, i, parts )
				{
					if ( superfluous.indexOf( part ) === -1 ) {

						if ( clean )
						{
							part = part.replace( nonLettersNonNumbers, '' );
						}

						keepWords.push( part );
					}
				}
			);
		//break;
	}

	switch ( type )
	{
		case 'camel':
		case 'camelcase':
			slug = keepWords.join('');
		break;

		case 'lower-under':
		case 'lower_under':
		case 'lowercase_underscore':
		case 'lowercase-underscore':
			slug = keepWords.join('_');
		break;

		case 'lower-dash':
		case 'lower_dash':
		case 'lowercase_dash':
		case 'lowercase-dash':
			slug = keepWords.join('-');
		break;

		default:
			slug = keepWords.join('-');
	}

	return slug;
}

function webkitBugStatus( id ) {
	var url = 'https://bugs.webkit.org/show_bug.cgi?id=' + id;

	return ajaxCall( url, function bugzillaBugStatus( xhr ) {
		var
			  div = document.createElement( 'div' )
			, result
			, body = xhr.responseText.split(/<body[^>]*>((?:.|\n)*)<\/body>/i) //[1]
			, bugStatus
		;

		console.log( 'body', body );
		console.log( 'body[1]', body[1] );

		div.innerHTML = body[1];

		bugStatus = document.evaluate( './/span[@id="static_bug_status"]', div, null, XPathResult.ANY_TYPE, null );

		return trim( bugStatus.iterateNext().textContent );
	}, false);
}
//}());