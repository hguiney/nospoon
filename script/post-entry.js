/*jshint laxcomma: true, smarttabs: true */
(function () {
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
	, mdMetadata = {}
	, md = getById( 'md' )
	, xhtml = getById( 'xhtml' )
	, wysiwyg = getById( 'wysiwyg' )
	, title = getById( 'title' )
	, topicTitle = getById( 'topic-title' )
	, topicPublished = getById( 'topic-published' )
	, topicRunningTime = getById( 'topic-running-time' )
	, timeout = null
	, i
	, limit
;

/* App Functions */

function setContent( fields )
{
	var
		  input
		, i
		, limit
		, newValue
	;

	if ( isArray( fields ) )
	{
		for ( i = 0, limit = fields.length; i < limit; ++i )
		{
			input = window[ fields[i] ];
			newValue = content[ fields[i] ];

			if ( input.tagName.toLowerCase() === 'div' )
			{
				input.innerHTML = newValue;
			}
			else
			{
				input.value = newValue;
			}
		}
	}
	else if ( isObject( fields ) )
	{
		title.value = content.title;
		md.value = content.md;
		xhtml.value = content.xhtml;
		wysiwyg.innerHTML = content.wysiwyg;

		for ( var field in fields )
		{
			input = getById( field );
			if ( input )
			{
				input.value = fields[field];
			}
		}
	}

	if ( content.postType )
	{
		var postTypeOptions = form['post-types'].options;
		for ( i = 0, limit = postTypeOptions.length; i < limit; ++i )
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
	/*switch ( type.toLowerCase() )
	{
		case 'review':
			var
				titleParent = title.parentNode
				, titleAunt = titleParent.previousElementSibling
				, titleGrandma = titleAunt.parentNode
				, topicTitleName = document.createElement( 'dt' )
				, topicTitleVal = document.createElement( 'dd' )
				, topicPublishedName = document.createElement( 'dt' )
				, topicPublishedVal = document.createElement( 'dd' )
			;
			
			titleParent.setAttribute( 'hidden', 'hidden' );
			titleAunt.setAttribute( 'hidden', 'hidden' );
			
			topicTitleName.innerHTML = '<label for="topic-title">Topic Title</label>';
			topicTitleVal.innerHTML = '<input id="topic-title" name="topic-title" type="text" value="' + content.topicTitle + '" />';
			
			topicPublishedName.innerHTML = '<label for="topic-published">Topic Published</label>';
			topicPublishedVal.innerHTML = '<input id="topic-published" name="topic-published" type="text" value="' + content.topicPublished + '" />';

			titleGrandma.insertBefore( topicTitleVal, titleParent.nextSibling );
			titleGrandma.insertBefore( topicTitleName, topicTitleVal );
			
			titleGrandma.insertBefore( topicPublishedVal, topicTitleVal.nextSibling );
			titleGrandma.insertBefore( topicPublishedName, topicPublishedVal );
		break;
	}*/
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
				setContent( mdMetadata );
				setContent();
			}
		};
	})( file );

	reader.readAsText( file );

	return true;
}

function parseTitle( title )
{
	var
		  regex = /(.+):\s*['‘"“](.+)[”"’']\s*\(([0-9]+)\)/
		, matches = regex.exec( title )
	;

	if ( matches && matches.length > 0 )
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

function parseMetadata( list, prefix )
{
	prefix = prefix || false;

	var
		  children = list.childNodes
		, obj = {}
		, obj2 = {}
		, i
		, limit
	;

	for ( i = 0, limit = children.length; i < limit; ++i )
	{
		var
			  current = children[i]
			, tagName
			, nameValRegex = /^(.*?): (.*)$/
			, matches
			, key
		;

		if ( current.nodeType === 1 )
		{
			tagName = current.tagName.toLowerCase();

			switch ( tagName )
			{
				case 'li':
					matches = nameValRegex.exec( trim( current.textContent ) );

					if ( current.hasChildNodes() && (current.childNodes.length === 2) && (current.childNodes[1].nodeType === 1) )
					{
						obj2 = parseMetadata( current.childNodes[1], (prefix ? prefix + ' ' : '') + trim( current.childNodes[0].textContent ) );
						obj = mergeRecursive( obj, obj2 );
					}
					else if ( matches && matches.length > 0 )
					{
						if ( prefix && prefix.length > 0 )
						{
							key = prefix + ' ' + matches[1];
						}
						else
						{
							key = matches[1];
						}

						key = getSlug( key );

						obj[key] = matches[2];
					}
				break;
			}
		}
	}

	mdMetadata = sortObject( obj );
	return mdMetadata;
}

function setFields( obj )
{
	var field, nodeName, fieldsFound = false;

	for ( var prop in obj )
	{
		field = document.getElementById( prop );

		if ( field !== null )
		{
			nodeName = field.nodeName.toLowerCase();

			if( nodeName === 'input' || nodeName === 'textarea' )
			{
				field.value = obj[prop];
			}

			fieldsFound = true;
		}
	}

	return fieldsFound;
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
		, i
		, limit
	;

	for ( i = 0, limit = children.length; i < limit; ++i )
	{
		var
			  current = children[i]
			, tagName
			, next
		;

		if ( current.nodeType === 1 )
		{
			tagName = current.tagName.toLowerCase();

			switch ( tagName )
			{
				case 'head':
				case 'meta':
				case 'title':
				case 'style':
				case 'script':
					root.removeChild( current );
				break;

				case 'h1':
					if ( trim( current.textContent.toLowerCase() ) === 'metadata' )
					{
						next = current.nextElementSibling;
						console.log( parseMetadata( next ) );
						root.removeChild( next );
					}
					else
					{
						parseTitle( current.innerHTML );
					}

					root.removeChild( current );
				break;
			}
		}
		else
		{
			//root.removeChild( children[i] );
		}
	}

	content.md = reMarker.render( root.innerHTML );
	content.wysiwyg = trim( root.innerHTML );
	content.xhtml = root.outerHTML; //content.wysiwyg; //makeSafe( );

	return content.wysiwyg;
}

function handleFileSelect( event )
{
	var
		  files = event.target.files // FileList object
		, file
		, i
		, limit = files.length
	;

	for ( i = 0, file = files[i]; i < limit; ++i )
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
					case 'html':
					case 'htm':
					case 'xhtml':
					case 'xhtm':
					case 'xht':
						parseMode = 'html';
					break;

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
		, i
		, limit
	;

	activeId = activeId || event.target.value;

	for ( i = 0, limit = editors.length; i < limit; ++i )
	{
		editors[i].setAttribute( 'hidden', 'hidden' );
	}

	activeEditor = getById( activeId );
	activeEditor.removeAttribute( 'hidden' );

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

	if( window[parseMode]( content[property] ) )
	{
		var props = [ 'md', 'wysiwyg', 'xhtml' ];

		props.splice( props.indexOf( property ), 1 );

		setContent( mdMetadata );
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

function findFilm( event ) {
	event.preventDefault();
	var
		tmdbSearch = new TmdbCall().Search(
			'movie'
			, topicTitle.value
			, {
				'year': topicPublished.value.substr( 0, topicPublished.value.indexOf( '-' ) ) // HTML5 version buggy: topicPublished.valueAsDate.getYear()
			}
		)
		, releaseDate = tmdbSearch.getReleaseDate()
		, movieInfo = new TmdbCall().Movie( tmdbSearch.getId() )
	;

	topicPublished.value = releaseDate;
	topicRunningTime.value = movieInfo.getRuntime();

	/*
		Aspect Ratio IMDb XPath:
			normalize-space(//text()[. = 'Aspect Ratio:']/../../text()[2])
			normalize-space(//text()[contains(., 'Aspect Ratio')]/../../text()[2])
	*/

	return false;
}

function invalidInputChange( event )
{
	var
		  input = event.target
		, classAttr
	;

	if ( input.classList && input.classList.length > 0 )
	{
		input.classList.add( 'show-validation' );
	}
	else
	{
		classAttr = input.getAttribute( 'class' );

		if ( classAttr && classAttr.length > 0 )
		{
			if ( classAttr.indexOf( 'show-validation' ) === -1 )
			{
				input.setAttribute( 'class', classAttr + ' show-validation' );
			}
		}
		else
		{
			input.setAttribute( 'class', 'show-validation' );
		}
	}
}

function buggyInputChange( event )
{
	var
		  input = event.target
		, regex = XRegExp( pattern )
		, matches = regex.exec( input.value )
	;

	if ( matches && matches.length > 0 ) {
		input.validity.valid = true;
		//input.classList.remove('invalid');
		input.setCustomValidity( '' );
	} else {
		//input.classList.add('invalid');
		input.setCustomValidity( 'Please match the requested format.' );
	}
}

/* UI */

var format;

for ( i = 0, limit = form.format.length; i < limit; ++i )
{
	format = form.format[i];

	if ( format.checked )
	{
		toggleEditor( null, format.value );
	}

	format.addEventListener( 'change', toggleEditor, false );
}

var
	  inputs = document.querySelectorAll( 'input:invalid' )
	, input
;

for ( i = 0, limit = inputs.length; i < limit; ++i )
{
	input = inputs[i];
	input.addEventListener( 'change', invalidInputChange, false);
}

if ( document.documentElement.classList.contains( '-webkit-' ) && webkitBugStatus( '105875' ) !== 'RESOLVED FIXED' ) {
	var
		  afflicted = document.querySelectorAll( '[data-webkit-bug="105875"]' )
		, current
		, pattern
	;

	for ( i = 0; i < afflicted.length; ++i) {
		current = afflicted[i];
		pattern = current.getAttribute( 'pattern' );
		current.setAttribute( 'data-pattern', pattern );
		current.removeAttribute( 'pattern' );

		current.addEventListener( 'change', buggyInputChange, false );
	}
}

form.file.addEventListener( 'change', handleFileSelect, false );
form.addEventListener( 'submit', submitFields, false );
form['guess-topic-metadata'].addEventListener( 'click', findFilm, false );
form['topic-verdict'].addEventListener( 'change', function () { console.log( event.target.value ); }, false );

md.addEventListener( 'keypress', function() { delayHandler( event, 'md' ); }, false );
xhtml.addEventListener( 'keypress', function() { delayHandler( event, 'xhtml' ); }, false );
wysiwyg.addEventListener( 'keypress', function() { delayHandler( event, 'wysiwyg' ); }, false );
}());