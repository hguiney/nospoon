"use strict";

var
	form = document.forms.form
	, content = {
		md: ''
		, xhtml: ''
		, wysiwyg: ''
		, title: ''
		, postType: ''
		, topicTitle: ''
		, topicPublished: ''
	}
	, md = getById( 'md' )
	, xhtml = getById( 'xhtml' )
	, wysiwyg = getById( 'wysiwyg' )
	, title = getById( 'title' )
	, timeout = null
;

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

function ucfirst (str) {
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
function makeSafe(text) {
	return text.replace(/[&<>"'`]/g, function (chr) {
		return '&#' + chr.charCodeAt(0) + ';';
	});
};

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

/* App Functions */

function setContent( fields )
{
	if ( isArray( fields ) )
	{
		for ( var i = 0, limit = fields.length, el, newValue; i < limit; ++i )
		{
			el = window[ fields[i] ];
			newValue = content[ fields[i] ];
			
			if ( el.tagName.toLowerCase() == 'div' )
			{
				el.innerHTML = newValue;
			}
			else
			{
				el.value = newValue;
			}
		}
	}
	else
	{
		md.value = content.md;
		xhtml.value = content.xhtml;
		wysiwyg.innerHTML = content.wysiwyg;
		title.value = content.title;
	}
	
	if ( content.postType )
	{
		var postTypeOptions = form['post-types'].options;
		for ( var i = 0, limit = postTypeOptions.length; i < limit; ++i )
		{
			// value, text
			if( postTypeOptions[i].text.toLowerCase() == content.postType.toLowerCase() )
			{
				postTypeOptions[i].selected = true;
				switchPostType( content.postType );
				break;
			}
		}
	}
}

function switchPostType( type )
{
	switch ( type.toLowerCase() )
	{
		case 'review':
			var
				titleParent = title.parentNode
				, titleAunt = titleParent.previousElementSibling
				, titleGrandma = titleAunt.parentNode
				/*, topicTitleName = document.createElement( 'dt' )
				, topicTitleVal = document.createElement( 'dd' )
				, topicPublishedName = document.createElement( 'dt' )
				, topicPublishedVal = document.createElement( 'dd' )*/
			;
			
			titleParent.setAttribute( 'hidden', 'hidden' );
			titleAunt.setAttribute( 'hidden', 'hidden' );
			
			/*topicTitleName.innerHTML = '<label for="topic-title">Topic Title</label>';
			topicTitleVal.innerHTML = '<input id="topic-title" name="topic-title" type="text" value="' + content.topicTitle + '" />';
			
			topicPublishedName.innerHTML = '<label for="topic-published">Topic Published</label>';
			topicPublishedVal.innerHTML = '<input id="topic-published" name="topic-published" type="text" value="' + content.topicPublished + '" />';

			titleGrandma.insertBefore( topicTitleVal, titleParent.nextSibling );
			titleGrandma.insertBefore( topicTitleName, topicTitleVal );
			
			titleGrandma.insertBefore( topicPublishedVal, topicTitleVal.nextSibling );
			titleGrandma.insertBefore( topicPublishedName, topicPublishedVal );*/
		break;
	}
}

function readFile( file, parseMode )
{
	var reader = new FileReader();
	parseMode = 'parse' + ucfirst( parseMode );
	
	// Closure to capture the file information.
	reader.onload = (function readerOnLoad( theFile )
	{
		return function displayFile( e )
		{
			if( window[parseMode]( e.target.result ) )
			{
				setContent();
			}
		};
	})(file);

	reader.readAsText(file);
	
	return true;
}

function parseTitle( title )
{
	var
		regex = /(.+):\s*['‘"“](.+)[”"’']\s*\(([0-9]+)\)/
		, matches = regex.exec( title );
	;
	
	if ( matches.length > 0 )
	{
		content.title = matches[0];
		content.postType = matches[1];
		content.topicTitle = matches[2];
		content.topicPublished = matches[3];
		return true;
	}
	else
	{
		content.title = title;
		return false;
	}
}

function parseMd( text )
{
	var converter = new Showdown.converter(); //Markdown.getSanitizingConverter();

	return parseHtml( converter.makeHtml( text ) ); // Removes title and sets all properties
}

function parseHtml( html )
{
	var root = document.createElement( 'div' );
	root.innerHTML = html;

	var 
		children = root.childNodes
		, reMarker = new reMarked({
			h1_setext: false
			, h2_setext: true
		})
	;
	
	for ( var i = 0; i < children.length; ++i )
	{
		if ( children[i].nodeType == 1 )
		{
			var tagName = children[i].tagName.toLowerCase();
			
			switch( tagName )
			{
				case 'head':
				case 'meta':
				case 'title':
				case 'style':
				case 'script':
					root.removeChild( children[i] );
				break;
				
				case 'h1':
					parseTitle( children[i].innerHTML );
					root.removeChild( children[i] );
				break;
			}
		
			//console.log( tagName );
		}
		else
		{
			root.removeChild( children[i] );
		}
	}

	content.md = reMarker.render( root.innerHTML );
	content.wysiwyg = trim( root.innerHTML );
	content.xhtml = content.wysiwyg; //makeSafe( );

	//console.log( content );

	return content.wysiwyg;
}

function handleFileSelect( event )
{	
	var files = event.target.files; // FileList object
	
	for ( var i = 0, file; file = files[i]; ++i )
	{
		var parseMode;
		file.extension = file.name.split('.').pop();

		switch ( file.type )
		{
			case 'text/html':
			case 'application/xhtml+xml':
				parseMode = 'html';
			break;

			case 'text/plain':
			case 'text/x-markdown':
			case 'text/vnd.daringfireball.markdown':
				parseMode = 'md';
			break;
			
			default:
				switch ( file.extension )
				{
					case 'md':
					case 'mdown':
					case 'markdown':
					case 'mkdn':
					case 'mkd':
					case 'mdwn':
					case 'mdtxt':
					case 'mdtext':
					case 'text':
					case 'txt':
						parseMode = 'md';
					break;
				}
		}
		
		if ( parseMode )
		{
			readFile( file, parseMode );
		}
	}
	
	return true;
}

function toggleEditor( event, activeId )
{
	var
		editors = getByClass( 'format' )
		, activeEditor
	;
	
	activeId = activeId || event.target.value;
	
	for ( var i = 0, limit = editors.length; i < limit; ++i )
	{
		editors[i].setAttribute( 'hidden', 'hidden' );
	}
	
	activeEditor = getById( activeId );
	activeEditor.removeAttribute( 'hidden' );
	
	/*console.log( editors );
	console.log( activeEditor );*/
	
	return true;
}

function handleChange( event, property )
{
	var
		el = event.target
		, newContent
		, parseMode
	;

	if ( el.tagName.toLowerCase() == 'div' )
	{
		newContent = el.innerHTML;
	}
	else
	{
		newContent = el.value;
	}

	if ( newContent == content[property] )
	{
		return;
	}
	else
	{
		content[property] = newContent;
	}

	switch ( property )
	{
		case 'md':
			parseMode = 'md';
		break;
		
		case 'xhtml':
		case 'wysiwyg':
			parseMode = 'html';
		break;
	}
	
	parseMode = 'parse' + ucfirst( parseMode );
	
	//console.log( event.target );
	if( window[parseMode]( content[property] ) )
	{
		var props = [ 'md', 'wysiwyg', 'xhtml' ];
		
		props.splice( props.indexOf( property ), 1 );

		setContent( props );
	}
}
 
function delayHandler( event, property )
{
	if ( timeout )
	{
		clearTimeout( timeout );
	}

	timeout = setTimeout( function ()
	{
		handleChange( event, property );
	}, 50 );
}

function submitFields( event )
{
/*	event.preventDefault();

	var bodyContent = getById( 'body-content' ).innerHTML;
	
	console.log(bodyContent);
*/
	return true;
}

for ( var i = 0, limit = form.format.length, format; i < limit; ++i )
{
	format = form.format[i];
	
	if ( format.checked )
	{
		toggleEditor( null, format.value );
	}
	
	format.addEventListener( 'change', toggleEditor, false );
}

form.file.addEventListener( 'change', handleFileSelect, false );
form.addEventListener( 'submit', submitFields, false );

md.addEventListener( 'keypress', function() { delayHandler( event, 'md' ); }, false );
xhtml.addEventListener( 'keypress', function() { delayHandler( event, 'xhtml' ); }, false );
wysiwyg.addEventListener( 'keypress', function() { delayHandler( event, 'wysiwyg' ); }, false );