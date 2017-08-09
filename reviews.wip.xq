xquery version "1.0";
declare boundary-space preserve;

(: Namespaces :)
declare namespace ovml = "http://vocab.nospoon.tv/ovml#";
declare namespace a = "http://www.w3.org/2005/Atom";
declare default element namespace "http://www.w3.org/1999/xhtml";
declare namespace h = "http://www.w3.org/1999/xhtml";
declare namespace request = "http://exist-db.org/xquery/request";
declare namespace xs = "http://www.w3.org/2001/XMLSchema";
declare namespace util = "http://exist-db.org/xquery/util";
declare namespace site = "http://vocab.nospoon.tv/site#";

(: Modules :)
import module namespace functx = "http://www.functx.com" at "/db/modules/functx.xq";
import module namespace nospoon = "http://vocab.nospoon.tv/#" at "/db/modules/nospoon.xq";
import module namespace json = "http://www.json.org";

declare option exist:serialize "method=html5 media-type=application/xhtml+xml omit-xml-declaration=no indent=no doctype-system=about:legacy-compat";

(: Main :)
declare variable $vocabRoot := 'http://vocab.nospoon.tv/';

declare variable $paramId := request:get-parameter('id', '');
declare variable $paramUser := request:get-parameter('user', '');
declare variable $paramTopicTitle := request:get-parameter('topic-title', '');
declare variable $paramTopicPublished := request:get-parameter('topic-published', '');

declare variable $usersPath := '/db/users/';
declare variable $entriesPath := '/entries/.feed.entry/';

declare variable $doc := 
	if ($paramUser)
	then
		let $userEntries := concat($usersPath, $paramUser, $entriesPath)
		return
			if ($paramId)
			then concat($userEntries, $paramId, '.entry.atom')
			else $userEntries
	else $usersPath
;

declare variable $collection := collection($doc); (: //a:entry; :)

declare variable $entries := ($collection)//a:entry;
(: functx:remove-attributes($collection/a:content/h:div, ('vocab', 'prefix')) :)

(: <category scheme="http://vocab.nospoon.tv/ovml#title" term="drive" label="Drive"/>
	<category scheme="http://vocab.nospoon.tv/ovml#published" term="2011-05-20" label="2011"/> :)

declare variable $entryUri := 
	for $entry in $entries
		let $topicTitle := $entry/a:category[@scheme = 'http://vocab.nospoon.tv/ovml#title']
		let $topicPublished := $entry/a:category[@scheme = 'http://vocab.nospoon.tv/ovml#published']
		return
			if
				(
					(
						$topicTitle[@term = $paramTopicTitle] or
						$topicTitle[@label = $paramTopicTitle]
					) and 
					(
						$topicPublished[@label = $paramTopicPublished] or
						$topicPublished[@term = $paramTopicPublished]
					)
				)
			then base-uri($entry)
			else () (: error() :)
		(: end return :)
	(: end for :)
;

declare variable $entry := doc($entryUri)/a:entry;

declare variable $topicTitleCategory := $entry/a:category[@scheme = 'http://vocab.nospoon.tv/ovml#title'];
declare variable $topicTitleTerm := string($topicTitleCategory/@term);
declare variable $topicTitle := string($topicTitleCategory/@label);

declare variable $topicPublishedCategory := $entry/a:category[@scheme = 'http://vocab.nospoon.tv/ovml#published'];
declare variable $topicPublishedTerm := string($topicPublishedCategory/@term);
declare variable $topicPublished := string($topicPublishedCategory/@label);

(: /db/users/roger.ebert/entries/.feed.entry/0fba17cd-a212-40ac-bb12-c765b927c3c9.entry.atom :)

declare variable $entryAuthorPath := substring-before($entryUri, '/entries/');
declare variable $entryAuthorId := substring-after($entryAuthorPath, '/users/');

declare variable $entryId := $entry/a:id/text();

declare variable $entryAuthorDoc := doc(concat($entryAuthorPath, '/.feed.atom'));
declare variable $entryAuthorEl := $entryAuthorDoc/a:feed/a:author;
declare variable $entryAuthor := $entryAuthorEl/a:name/text();
declare variable $entryAuthorAbout := $entryAuthorEl/site:about/site:summary;

declare variable $entryContent := functx:remove-attributes($entry/a:content/div, ('vocab', 'prefix'));

declare variable $ovmlRoot := $entry/ovml:ovml;

declare variable $ovmlData := $ovmlRoot/ovml:video[@xml:id = $topicTitleTerm];

declare variable $ovmlStarring := $ovmlData/ovml:actor/ovml:starring/ovml:character;

declare variable $topicStarring := 
	for $actor in $ovmlStarring/ovml:entity
		return <dd>{string($actor)}</dd>
;

declare variable $topicRuntime := 
	let $runtime := string($ovmlData/ovml:runtime)
	let $minutesHtml := 'minutes' (: <abbr title="minutes">min</abbr> :)
	return
		if (functx:is-a-number($runtime))
		then ($runtime, ' ', $minutesHtml)
		else
			if (contains($runtime, 'P'))
			then (functx:total-minutes-from-duration($runtime), ' ', $minutesHtml)
			else () (: unknown :)
;

declare variable $topicDirector :=
	let $ovmlDirector := $ovmlData/ovml:director
	let $directorLabelHtml := <dt class="director">Director</dt>
	return
		if ($ovmlDirector)
		then
			if (functx:has-simple-content($ovmlDirector))
			then ($directorLabelHtml, <dd>{string($ovmlDirector)}</dd>)
			else
				let $ovmlDirectorEntity := $ovmlDirector/ovml:entity
				return
					if ($ovmlDirectorEntity)
					then
						let $directorCount := count($ovmlDirectorEntity)
						return
							if ($directorCount > 1)
							then
								let $directorLabelHtml := <dt class="director">Directors</dt>
								return (
									$directorLabelHtml,
									for $director in $ovmlDirectorEntity
									return <dd>{string($director)}</dd>
								)
							else ($directorLabelHtml, <dd>{string($ovmlDirectorEntity)}</dd>)
					else () (: end if ovmlDirectorEntity :)
		else () (: end if ovmlDirector :)
;

declare variable $ovmlGlossary := 
	let $glossaryLink := $ovmlData/ovml:meta/ovml:link[@rel = 'glossary']/@href
	return
		if ($glossaryLink)
		then doc(string($glossaryLink))
		else doc('/db/video/glossary.ovml')
;

declare variable $ovmlRating := $ovmlData/ovml:rating;

declare variable $topicContentRating :=

		if ($ovmlRating)
		then
			let $code := $ovmlRating/@code
			return
				if ($code)
				then string($code)
				else ()
		else ()
;

declare variable $topicContentRaterId := substring-after($ovmlRating/@glossary, '#');

declare variable $ovmlTopicContentRatingDfns :=
	$ovmlGlossary/ovml:ovml/ovml:glossary[@for = 'rating'][@xml:id = $topicContentRaterId]
;

declare variable $topicContentRater := 
	let $rater := $ovmlTopicContentRatingDfns/ovml:entity
	let $scheme := $ovmlTopicContentRatingDfns/ovml:scheme
	let $title := $ovmlTopicContentRatingDfns/ovml:title
	(: title="{$rater/ovml:name}" :)
	return <a title="{$title}" href="{$scheme}"><abbr>{string($rater/ovml:nickname)}</abbr></a>
;

declare variable $topicContentRatingReason := concat(string($ovmlRating/ovml:reason), '.');

declare variable $infoLinks :=
	let $links := $ovmlRoot/ovml:meta/ovml:link[contains(@rel, 'info') or contains(@rel, 'shop')][@href][@title]
	return
		<ul>
		{
			(
				for $link in $links
				let $title := string($link/@title)
				let $class := lower-case(functx:trim($title))
				let $href := string($link/@href)
				return
				<li class="{$class}"><a href="{$href}">{$title}</a></li>
			)
		}
		</ul>
;

declare variable $topicDistributor := $ovmlData/ovml:distributor;

declare variable $ovmlPrimaryWork := $ovmlData/ovml:writer/ovml:work[1];

declare variable $ovmlDerivedFromId := substring-after($ovmlPrimaryWork/ovml:link[@rel = 'derived-from']/@href, '#');
declare variable $ovmlDerivedFrom := $ovmlData/ovml:writer/ovml:work[@xml:id = $ovmlDerivedFromId];

declare variable $topicDerivedFromType := replace(string($ovmlDerivedFrom/@type), '-', ' ');
declare variable $topicDerivedFromWriter := string($ovmlDerivedFrom/ovml:entity);

declare variable $topicWriter := $ovmlPrimaryWork/ovml:entity;

declare variable $topicAtAGlance :=
	(: Film District presents a film directed by Nicolas Winding Refn. Written by Hossein Amini, based on the novel by James Sallis. :)
	' '
;

<html
	xmlns="http://www.w3.org/1999/xhtml"
	vocab="http://vocab.nospoon.tv/ovml#"
	prefix="ovml: http://vocab.nospoon.tv/ovml#"
	class="no-js">
<head>
<meta charset="UTF-8" />
<title>NoSpoon.tv</title>
<meta name="robots" content="noindex, nofollow" />

<!-- For all browsers -->
<link rel="stylesheet" media="screen" href="/style/index.css?v=1" />
<link rel="stylesheet" media="screen" href="/style/review.css?v=1" />
<link rel="stylesheet" media="print" href="/style/print.css?v=1" />
<meta name="viewport" content="width=device-width, target-densitydpi=160, initial-scale=1.0" />
<!-- For Retina displays 
<link rel="stylesheet" media="only screen and (-webkit-min-device-pixel-ratio: 2), only screen and (min-device-pixel-ratio: 2)" href="/style/2x.css?v=1" />-->
<!-- JavaScript at bottom except for Modernizr -->
</head>
<body>
<script src="/script/modernizr.custom.min.js"></script>
<script src="/script/prefixfree.min.js"></script>

<header id="top" role="banner">

<div class="content">

<!--ul id="skip">
<li><a href="#nav">Skip to navigation</a></li>
<li><a href="#content">Skip to content</a></li>
<li><a href="#bottom">Skip to footer</a></li>
</ul-->

<div id="branding">
<a href="/" title="Home">
<div id="logo">
{doc('img/logo.svg')}
</div><!-- #logo -->
<h1>NoSpoon<span>.tv</span></h1>
</a>
<!--p id="tagline"><q>Escaping the Matrix of Mediocrity</q></p-->
</div><!-- #branding -->
{nospoon:build-nav()}
</div><!-- .content -->
</header>

<div id="content" class="content">

<aside role="complementary">
</aside><!-- complementary -->

<article id="drive" class="review" role="main">
<!--div class="content"-->
<header>
<hgroup>
<h2>Review: <cite>{$topicTitle}</cite> ({$topicPublished})</h2>
<h3><span>by</span> {$entryAuthor}</h3>
</hgroup>

<figure>
<img alt="img" src="/img/drive.jpg" />
<figcaption>{$topicDistributor} presents a film directed by {string($topicDirector[2])}. Written by {$topicWriter}, based on the {$topicDerivedFromType} by {$topicDerivedFromWriter}.</figcaption>
</figure>
</header>

<aside id="overview">
<hgroup class="implied">
<h3>Overview</h3>
</hgroup>

<dl class="at-a-glance">
<dt class="runtime">Runtime</dt>
<dd>{$topicRuntime}</dd>
{$topicDirector}
<dt class="starring">Starring</dt>
{$topicStarring}
<dt class="content-rating">Content Rating</dt>
<dd>“{$topicContentRating}” ({$topicContentRater}) for {$topicContentRatingReason}</dd>
<!--<dt class="ar">Aspect Ratio</dt>
<dd>2.35:1</dd>-->
</dl>
{$infoLinks}
</aside><!-- #overview -->

{$entryContent}
<!-- #entry-content -->

<aside id="mentioned">

<header>

<hgroup>
<h4>Titles Mentioned in this Review</h4>
</hgroup>

<!--p>Organize by:
	<select>
		<option>Release Date</option>
		<option>Verdict</option>
	</select>
	<select>
		<option>Descending</option>
		<option>Ascending</option>
	</select>
</p-->

</header>

{nospoon:getVideoMentions($entryId, $entryAuthorId, 'html')}

</aside>

<!--/div--><!-- .content -->
</article><!-- main -->

<p><i>Rest of this page left intentionally blank</i></p>

</div><!-- #content.content -->

<footer id="bottom" role="contentinfo"></footer><!-- contentinfo -->

<div id="scripts">
	<script src="//ajax.googleapis.com/ajax/libs/jquery/1.7.0/jquery.min.js"></script>
	<!--<script src="jquery.masonry.min.js"></script>
	<script src="matchMedia.js"></script>
	<script src="jquery.ba-resize.min.js"></script>-->
	<script src="/script/hyphenator/src.js"></script>
	<!--script src="/script/respawnd.js"></script-->
	<script src="/script/plugins.js"></script>
	<script src="/script/script.js?v=1"></script>
	<script src="/script/helper.js"></script>
	
	<!--[if (lt IE 9) & (!IEMobile)]>
	<script src="js/libs/imgsizer.js"></script>
	<![endif]-->
</div>

</body>
</html>