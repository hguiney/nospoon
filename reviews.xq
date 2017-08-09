xquery version "1.0";
declare boundary-space preserve;

(: Namespaces :)
declare namespace ovml = "http://vocab.nospoon.tv/ovml#";
declare namespace a = "http://www.w3.org/2005/Atom";
declare default element namespace "http://www.w3.org/1999/xhtml";
(: declare namespace h = "http://www.w3.org/1999/xhtml"; :)
declare namespace request = "http://exist-db.org/xquery/request";
declare namespace httpclient = "http://exist-db.org/xquery/httpclient";
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
declare variable $entryAuthorAbout := $entryAuthorEl/site:about/site:summary/text();

declare variable $entryContent := nospoon:id-paras(functx:add-attributes(functx:remove-attributes($entry/a:content/div, ('vocab', 'prefix')), (xs:QName('id'), xs:QName('contenteditable')), ('article','true')));

declare variable $ovmlRoot := $entry/ovml:ovml;

declare variable $ovmlData := $ovmlRoot/ovml:video[@xml:id = $topicTitleTerm];

declare variable $ovmlStarring := $ovmlData/ovml:actor/ovml:starring/ovml:character;

declare variable $topicStarring := 
	for $actor in $ovmlStarring/ovml:entity
		return
			element dd {
				if ($actor is $ovmlStarring[position() = last()]/ovml:entity)
				then attribute class { 'end' }
				else (),
				attribute data-avatar { 'http://cf2.imgobject.com/t/p/original/ffC5nkC8YsJcIZintCBrXvQ57cc.jpg' },
				string($actor)
			}
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

declare variable $thePage :=
<html
	xmlns="http://www.w3.org/1999/xhtml"
	vocab="http://vocab.nospoon.tv/ovml#"
	prefix="ovml: http://vocab.nospoon.tv/ovml#"
	class="no-js"
	xml:lang="en"
	lang="en">
<head>
<meta charset="UTF-8" />
<title>No Spoon</title>
<meta name="robots" content="noindex, nofollow" />

<!-- For all browsers -->
<link rel="stylesheet" media="screen" href="/style/index.css?v=1" />
<link rel="stylesheet" media="screen" href="/style/review.css?v=1" />
<link rel="stylesheet" media="print" href="/style/print.css?v=1" />
<meta name="viewport" content="width=device-width, target-densitydpi=160, initial-scale=1.0" />
<!-- For Retina displays 
<link rel="stylesheet" media="only screen and (-webkit-min-device-pixel-ratio: 2), only screen and (min-device-pixel-ratio: 2)" href="/style/2x.css?v=1" />-->
<!-- JavaScript at bottom except for Modernizr -->
<script src="//use.typekit.net/uys3rrk.js"></script>
<script>
/* <![CDATA[ */
try{Typekit.load();}catch(e){}
/* ]]> */
</script>
</head>
<body>
<script src="/script/modernizr.custom.min.js"></script>
<script src="/script/prefixfree.min.js"></script>

<header id="top" role="banner">

<div class="content">

<!--div id="switch">
<a href="//watch.nospoon.tv">
{doc('img/menu-icon.svg')}
</a>
</div-->

<div id="branding">

<a href="/" title="Home">

<div id="logo">
{doc('img/logo.svg')}
</div><!-- #logo -->

<h1 class="wordmark">No Spoon</h1>
<p id="tagline"><q>Free your mind.</q></p>

</a>

</div><!-- #branding -->

<div id="menu">
<a href="#nav">Jump to navigation</a>
</div><!-- #menu -->

</div><!-- .content -->
</header>

<div id="content" class="content">

<!--aside role="complementary">
</aside--><!-- complementary -->

<article id="main" class="review" role="main">
<!--div class="content"-->
<header>
<hgroup>
<h2><span class="article-type">Review:</span> <cite>{$topicTitle}</cite> <span class="phrase">(<time class="released">{$topicPublished}</time>)</span></h2>
<h2><span class="phrase"><span class="preposition">by</span> {$entryAuthor}</span> <span class="phrase"><span class="preposition">on</span> <time pubdate="pubdate" datetime="2011-11-07">Oct 7th, 2011</time></span></h2>
</hgroup>

<img alt="img" src="http://cf2.imgobject.com/t/p/original/f6nLe5SgUEWIMbulgoBRaDPR0TL.jpg" />

<!--figure>
<figcaption>{$topicDistributor} presents a film directed by {string($topicDirector[2])}. Written by {$topicWriter}, based on the {$topicDerivedFromType} by {$topicDerivedFromWriter}.</figcaption>
</figure-->

</header>

{$entryContent}
<!-- #entry-content -->

<footer>

<div class="content">

<section id="overview" data-id="about" class="major">

<div class="content">

<hgroup class="decorative">
<h2>The Lowdown</h2>
</hgroup>

<!--img src="http://cf2.imgobject.com/t/p/original/ljJrY4ehK5xn3kJ8He5JixCDRVy.jpg" /-->

<section id="the-film" class="group">

<hgroup>
<h2>The Film</h2>
</hgroup>

<dl class="at-a-glance content">

<di>
<dt class="runtime">Running Time</dt>
<dd>{$topicRuntime}</dd>
</di>

<di>
<dt class="ar">Aspect Ratio</dt>
<dd>2.35:1</dd>
</di>

<di>
<dt>Language</dt>
<dd>English</dd>
</di>

<di>  
{$topicDirector}
</di>

<di>
<dt class="starring one-to-many">Starring</dt>
{$topicStarring}
</di>

<di>
<dt class="content-rating">Content Rating</dt>
<dd>“{$topicContentRating}” ({$topicContentRater}) for {$topicContentRatingReason}</dd>
</di>

<di>
<dt class="more">More</dt>
<dd>{$infoLinks}</dd>
</di>

</dl>

</section><!-- #the-film -->

<section id="author">
<hgroup>
<h2>The Reviewer</h2>
</hgroup>

<div id="author-id">

<address>

<dl>
<dt><a title="More from this author" href="/authors/{$entryAuthorId}/">{nospoon:get-author-avatar($entryAuthorId, 100)} {$entryAuthor}</a></dt>
<dd>

<dl>
<dt class="implied">Role</dt>
<dd>Editor-in-chief, Founder</dd>

<dt class="implied">E-mail</dt>
<dd><a href="mailto:{ concat($entryAuthorId, '@nospoon.tv') }"><code class="casual">{ concat($entryAuthorId, '@nospoon.tv') }</code></a></dd>
</dl>

</dd>
</dl>

</address>

</div><!-- #author-id -->

<p>{$entryAuthorAbout}</p>

</section><!-- #author -->

<section id="publication-details">

<div class="content">

<hgroup>
<h2>The Article</h2>
</hgroup>

<p><a rel="license" title="Full license terms on Creative Commons" href="http://creativecommons.org/licenses/by-nc-nd/3.0/">{doc('img/cc.svg')} <dfn>Creative Commons <abbr>BY-NC-ND 3.0</abbr></dfn></a>: You may redestribute this work freely, provided it is: <a href="/terms/#attribution">properly attributed</a>, for noncommercial purposes, and without modification.</p>

</div><!-- .content -->

</section><!-- #publicatios-details -->

</div><!-- .content -->

</section><!-- #overview -->

<section id="mentioned" class="major">

<div class="content">

<hgroup class="decorative">
<h2>Shouted Out Flicks</h2>
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

{nospoon:getVideoMentions($entryId, $entryAuthorId, 'html')}

</div><!-- .content -->

</section><!-- #mentioned -->

<section id="responses" class="major">

<div class="content">

<hgroup class="decorative">
<h2>Responses</h2>
</hgroup>

<p><a>Write the editor</a> or <a>respond on your blog</a> by September 6th, 2012, and we may feature it here.</p>

<ol>
<li>
<blockquote>
<p>I hope this letter will fascinate, inform, and change the lives of those who read it. It’s possibly the only letter out there that’s bold enough to make the uncompromising statement that Roger Ebert’s execrations are more often out of sync with democratic values than aligned with them. What follows is a call to action for those of us who care—a large enough number to denounce those who claim that Ebert’s flock consists entirely of lovable, cuddly people who would never dream of tossing sops to the egos of the peevish. The take-away message of this letter is that anyone who thinks that Roger Ebert’s scare tactics won’t be used for political retribution has never been hauled before a tribunal and accused of tribalism. We should hold these words to our bosom, use them as a shield against Ebert’s inequities, and wield them unilaterally against those who would advocate fatalistic acceptance of a discourteous, wild new world order.</p>
</blockquote>
<p>—Matt D.</p>
</li>
</ol>

</div><!-- .content -->

</section><!-- #responses -->

</div><!-- .content -->

</footer>

<!--/div--><!-- .content -->
</article><!-- main -->

</div><!-- #content.content -->

<footer id="bottom" role="contentinfo">

<div class="content">

{nospoon:build-nav()}

<section id="cross-promotion">

<hgroup>
<h2>Also on No Spoon</h2>
</hgroup>

<ul class="total-6 macro">

<li>
<a class="productions" href="/productions/wicked-sketchy/trick-candles">
<article>
<img class="front" src="/img/trick-candles.jpg" />
<div class="back">
<hgroup>
<h2>
<span class="category">Production:</span>
<span>“Trick Candles”</span> <span class="phrase">(<cite class="casual">Wicked Sketchy</cite> <abbr title="Episode 9">E09</abbr>)</span>
</h2>
</hgroup>
<p>A couple play a prank on grandpa for his birthday.</p>
</div><!-- #back -->
</article>
</a>
</li>

<li>
<a class="inspirations" href="/inspirations/umbra">
<article>
<img src="http://b.vimeocdn.com/ts/884/017/88401708_1280.jpg" />
<hgroup>
<h2>
<span class="category">Inspiration:</span>
<cite>Umbra</cite> <span class="phrase">(<time>2010</time>)</span></h2>
</hgroup>
<p>An explorer adventures into an unknown world, yet it seems that he has been there before.</p>
</article>
</a>
</li>

<li>
<a class="musings" href="/musings/wheres-the-line-between-inspiration-imitation">
<article>
<img src="/img/musings.png" />
<hgroup>
<h2>
<span class="category">Musing:</span> Where’s the Line Between Inspiration and Imitation?</h2>
</hgroup>
<p>When and how is it safe to borrow from other works? Thoughts on the evolving role of copyright in today’s remix culture.</p>
</article>
</a>
</li>

<li>
<a class="reviews" href="/reviews/dark-knight-trilogy-2005-2012">
<article>
<img src="http://cf2.imgobject.com/t/p/original/lcvuQDedwXGtBOJkte0En7kamO.jpg" />
<hgroup>
<h2>
<span class="category">Review:</span> Batman Film Retrospective <span class="phrase">(1989–2012)</span></h2>
</hgroup>
<p>A look at what the Burton/Schumacher and Nolan Batman film series each did for the franchise, how they relate to each other, and where the Dark Knight goes from here.</p>
</article>
</a>
</li>

<li>
<a class="shop" href="/shop/no-spoon-tee">
<article>
<img data-src="/img/shop.png" src="/img/shirt.jpg" />
<hgroup>
<h2>
<span class="category">Shop:</span> No Spoon Tee
</h2>
</hgroup>
<p>Never get made fun of at school again by rocking these hip threads!</p>
</article>
</a>
</li>

<li>
<a class="subscribe" href="feed:/subscribe/reviews">
<article>
<img src="/img/subscribe.png" />
<hgroup>
<h2>
<span class="category">Subscription:</span> All Reviews
</h2>
</hgroup>
<p>Stay up-to-date on all the latest reviews by adding this link to your feed reader. Don’t have one? Check out <a href="http://www.feedly.com/">Feedly</a>.</p>
</article>
</a>
</li>

</ul>

</section><!-- #cross-promotion -->

<aside id="mqotd">

<hgroup>
<h2>Movie Quote of the Day</h2>
</hgroup>

<blockquote>
<p>Marcus, I just have one question for ya bro. How the hell you gonna leave my ass at a gun fight to go get the car!</p>
</blockquote>
<p>—Det. Mike Lowrey, <cite>Bad Boys</cite> <span>(<time>1995</time>)</span></p>

</aside><!-- #mqotd -->

<a href="http://bostonbuilt.org/">{doc('img/boston-built.svg')}</a>
<!--p><a href=""><img src="http://exist-db.org/exist/resources/powered.gif" alt="Powered by eXist-db" /></a></p-->

</div><!-- .content -->

</footer><!-- contentinfo -->

<div id="scripts">
	<script src="//ajax.googleapis.com/ajax/libs/jquery/1.7.0/jquery.min.js"></script>
	<!--<script src="jquery.masonry.min.js"></script>
	<script src="matchMedia.js"></script>
	<script src="jquery.ba-resize.min.js"></script>-->
	<script src="/script/hyphenator/src.js"></script>
	<!--script src="/script/respawnd.js"></script-->
	<script src="/script/HTMLOutliner.js"></script>
	<script src="/script/toc.js"></script>
	<script src="/script/plugins.js"></script>
	<!--script src="/script/mark-selection.js"></script-->
	<script src="/script/jquery.ba-resize.min.js"></script>
	<script src="/script/script.js?v=2"></script>
	<script src="/script/helper.js"></script>
	
	<!--[if (lt IE 9) & (!IEMobile)]>
	<script src="js/libs/imgsizer.js"></script>
	<![endif]-->
</div>

</body>
</html>
;

$thePage

(:
declare variable $request-headers := 
<headers>
	<header name="Content-Type" value="application/xhtml+xml; chaset=UTF-8" />
</headers>;

declare variable $data := httpclient:post(
	xs:anyURI('http://nospoon.tv:1337')
	, $thePage
	, false()
	, $request-headers
)//html;

$data
:)