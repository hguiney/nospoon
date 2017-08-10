/*jshint laxcomma: true, smarttabs: true */
/*
	TMDb API Wrapper v0.1
	by Hugh Guiney
	License: LGPL | MIT
*/
(function () {
"use strict";

var
	  tmdbKey = '5c7b12ebe296e26d6c1ffc89c51eebb1'
	, tmdbConfig = {
		"images": {
			"base_url": "http:\/\/cf2.imgobject.com\/t\/p\/",
			"secure_base_url": "https:\/\/d1zm4mmpsrckwj.cloudfront.net\/t\/p\/",
			"poster_sizes": [
				"w92",
				"w154",
				"w185",
				"w342",
				"w500",
				"original"
			],
			"backdrop_sizes": [
				"w300",
				"w780",
				"w1280",
				"original"
			],
			"profile_sizes": [
				"w45",
				"w185",
				"h632",
				"original"
			],
			"logo_sizes": [
				"w45",
				"w92",
				"w154",
				"w185",
				"w300",
				"w500",
				"original"
			]
		},
		"change_keys": [
			"adult",
			"also_known_as",
			"alternative_titles",
			"biography",
			"birthday",
			"budget",
			"cast",
			"character_names",
			"crew",
			"deathday",
			"general",
			"genres",
			"homepage",
			"images",
			"imdb_id",
			"name",
			"original_title",
			"overview",
			"plot_keywords",
			"production_companies",
			"production_countries",
			"releases",
			"revenue",
			"runtime",
			"spoken_languages",
			"status",
			"tagline",
			"title",
			"trailers",
			"translations"
		]
	}
	, tmdbVersion = '3'
	, tmdbDomain = 'api.themoviedb.org'
	, tmdbBaseUrlPath = tmdbDomain + '/' + tmdbVersion
;

var TmdbCall = function TmdbCall( key, secure )
{
	this.secure = secure || false;
	this.endpoint = '/';
	this.params = {
		api_key: key || tmdbKey
	};
	this.allowedParams = [];
	this.callCount = 0;

	if ( this.secure )
	{
		this.baseUrl = 'https://' + tmdbBaseUrlPath;
		this.imagesBaseUrl = tmdbConfig.images.secure_base_url;
	}
	else
	{
		this.baseUrl = 'http://' + tmdbBaseUrlPath;
		this.imagesBaseUrl = tmdbConfig.images.base_url;
	}
};

TmdbCall.prototype.isSearch = function tmdbIsSearch() {
	if ( this.endpoint.indexOf( 'search' ) !== -1 )
	{
		return true;
	}

	return false;
};

TmdbCall.prototype.setEndpoint = function tmdbSetEndpoint( endpoint ) {
	// If a child of search, we want to retain the previously set endpoint so the query will still work
	if ( !this.isSearch() )
	{
		this.endpoint = endpoint;
	}
};

TmdbCall.prototype.getCall = function tmdbGetCall() {
	if ( this.callCount > 0 )
	{
		return this;
	}
	else
	{
		return this.makeCall();
	}
};

TmdbCall.prototype.parseSize = function tmdbParseSize( size, imgType ) {
	var
		  defaultSize = 'original'
		, imgTypeKey = imgType + '_sizes'
		, imgTypeExists = tmdbConfig.images.hasOwnProperty( imgTypeKey )
		, imgTypeSizes
	;

	// If the image type is set and real (backdrop, etc.), change the default image size from "original" to the smallest of the variations to prevent loading wallpaper-sized images unnecessarily 
	if( imgTypeExists )
	{
		imgTypeSizes = tmdbConfig.images[imgTypeKey];
		defaultSize = imgTypeSizes[0];
	}

	size = size || defaultSize;

	// If the size is set, and therefore not the default size, check to see if it's a supported size
	if ( size !== defaultSize )
	{
		var firstLetter = size.toString().substr( 0, 1 ).toLowerCase();

		if ( (size !== 'w') || (size !== 'h') )
		{
			size = 'w' + size;
		}

		// If the image type exists but the size itself is not an element of that array, fall back to default size
		if ( imgTypeExists && imgTypeSizes.indexOf( size ) === -1 )
		{
			size = defaultSize;
			// resize?
		}
	}

	return size;
};

TmdbCall.prototype.makeCall = function tmdbMakeCall() {
	function F() {}
	F.prototype = this;
	this.request = buildGETRequest( this.baseUrl, this.endpoint, this.params );
	this.callCount = this.callCount || 0;
	//F.prototype.result = 

	this.response = ajaxCall( this.request, function( xhr ) {
		return JSON.parse( xhr.responseText );
	}, false);

	F.prototype.getResults = function tmdbGetResults() {
		this.lastCalled = new Date();
		this.callCount += 1;
		return this.response.results;
	};

	return new F();
};

TmdbCall.prototype.setParams = function tmdbSetParams( F, object )
{
	for ( var prop in object ) {
		if ( isset( object[prop] ) )
		{
			if ( (prop === 'optionalParams') && (typeof object[prop] === 'object') )
			{
				for( var optionalParam in object[prop] )
				{
					//console.log(F.prototype.allowedParams);
					if ( F.prototype.allowedParams.indexOf( optionalParam ) === -1 )
					{
						delete object[prop][optionalParam]; //return; //throw "Invalid parameter.";
					}
				}

				F.prototype.params = mergeRecursive( F.prototype.params, object[prop] );
			}
			else
			{
				F.prototype.params[ prop ] = object[prop];
			}
		}
	}
};

TmdbCall.prototype.getResult = function tmdbGetResult( ) {
	if ( this.isSearch() )
	{
		return this.getCall().response.results[0];
	}

	return this.getCall().response;
};

TmdbCall.prototype.Movie = function tmdbMovie( id ) {
	function F() {}
	F.prototype = this;
	this.setEndpoint( '/movie/' + id );

	this.allowedParams = [ 'page', 'language', 'include_adult', 'year' ];

	F.prototype.getId = function tmdbMovieGetId() {
		return this.getCall().response.results[0].id;
	};

	F.prototype.getImages = function tmdbMovieGetImages() {
		this.endpoint += '/images';
		return this.getCall();
	};

	F.prototype.getReleaseDate = function tmdbMovieGetReleaseDate() {
		return this.getResult().release_date;
	};

	F.prototype.getRuntime = function tmdbMovieGetRuntime() {
		console.log( this.getCall() );
		return this.getResult().runtime;
	};

	F.prototype.getImageUrl = function tmdbMovieGetImageUrl( size, type ) {
		return this.imagesBaseUrl + this.parseSize( size, type ) + this.getCall().response[type + '_path'];
	};

	F.prototype.getBackdropUrl = function tmdbMovieGetBackdropUrl( size ) {
		//console.log( '221', this.getCall().response );
		return this.getImageUrl( size, 'backdrop' );
	};

	F.prototype.getPosterUrl = function tmdbMovieGetPosterUrl( ) {
		return this.getImageUrl( size, 'poster' );
	};

	F.prototype.getBackdrop = function tmdbMovieGetBackdrop( size ) {
		return '<img src="' + this.getImageUrl( size, 'backdrop' ) + '" height="' + this.getResult().backdrops[0].height + '" />';
	};

	return new F();
};

TmdbCall.prototype.Search = function tmdbSearch( type, query, params ) {
	function F() {}
	F.prototype = this;
	this.endpoint = this.endpoint + 'search';

	// Define the optional parameters for each endpoint
	switch ( type.toLowerCase() )
	{
		case 'movie':
			F.prototype = this.Movie();
		break;

		case 'collection':
			F.prototype.allowedParams = [ 'page', 'integer', 'language' ];
		break;

		case 'person':
		case 'list':
			F.prototype.allowedParams = [ 'page', 'include_adult' ];
		break;

		case 'company':
		case 'keyword':
			F.prototype.allowedParams = [ 'page' ];
		break;
	}

	// Make sure the endpoint is real
	switch ( type )
	{
		case 'movie':
		case 'collection':
		case 'person':
		case 'list':
		case 'company':
		case 'keyword':
			this.endpoint = this.endpoint + '/' + type;
		break;

		default:
			return; // error
	}

	this.setParams( F, { 'query': query, 'optionalParams': params } );

	return new F();
};

//TmdbCall.prototype.getMovie = function tmdbGetMovie() {};
}());