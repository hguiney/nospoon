/* UI */

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

/* TMDb */

var
	tmdbSearch = new tmdbCall().Search( 'movie', 'Punch-Drunk Love', { 'year': 2002 } )
	, releaseDate = tmdbSearch.getReleaseDate()
;

console.log( 'tmdbSearch', tmdbSearch );
console.log( 'releaseDate', releaseDate );

var movieInfo = new tmdbCall().Movie( tmdbSearch.getId() );

console.log( 'movieInfo', movieInfo );
console.log( 'backdropUrl', movieInfo.getBackdropUrl() );