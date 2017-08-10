/* TMDb 

var
	tmdbSearch = new tmdbCall().Search( 'movie', 'Punch-Drunk Love', { 'year': 2002 } )
	, releaseDate = tmdbSearch.getReleaseDate()
;

console.log( 'tmdbSearch', tmdbSearch );
console.log( 'releaseDate', releaseDate );

var movieInfo = new tmdbCall().Movie( tmdbSearch.getId() );

console.log( 'movieInfo', movieInfo );
console.log( 'backdropUrl', movieInfo.getBackdropUrl() );*/

/*var
	placeholderFields = document.querySelectorAll('[placeholder]')
	, i = 0
	, length = placeholderFields.length
	, current
;

//console.log(placeholderFields);

for (i; i < length; ++i) {
	current = placeholderFields[i];
	current.value = current.getAttribute('placeholder');
}*/