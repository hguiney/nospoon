<?
/*
	header('Content-Type: application/xhtml+xml; charset=UTF-8');
	xmlns="http://www.w3.org/1999/xhtml"
	xmlns:x2="http://www.w3.org/2002/06/xhtml2"
	xml:lang="en" 
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xsi:schemalocation="http://www.w3.org/TR/xhtml2
						http://www.w3.org/MarkUp/SCHEMA/xhtml2.xsd"
*/ ?>
<?='<!--?xml version="1.0" encoding="utf-8"?-->'?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>NoSpoon.tv</title>
<link href="/css/normalize.css" media="screen" rel="stylesheet" />
<link href="/css/font-face.css" media="screen" rel="stylesheet" />
<link href="/css/baseline.css" media="screen" rel="stylesheet" />
<link href="/css/coming-soon.css" media="screen" rel="stylesheet" />
<script type="text/javascript">

  var _gaq = _gaq || [];
  _gaq.push(['_setAccount', 'UA-8037820-1']);
  _gaq.push(['_setDomainName', 'nospoon.tv']);
  _gaq.push(['_trackPageview']);

  (function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
  })();

</script>
</head>

<body>
<script src="/js/modernizr.js"></script>
<script src="/js/prefixfree.min.js"></script>
<script src="/js/hyphens.js"></script>
<div class="content">
<? require_once('inc/store-address.php'); if($_POST['submit']){ echo '<p><i>', storeAddress(), '</i></p>'; } ?>
<header role="banner">
<div id="branding">
<div id="logo">
<svg xmlns="http://www.w3.org/2000/svg" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:svg="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:h="http://www.w3.org/1999/xhtml" xmlns:cc="http://creativecommons.org/ns#" version="1.1" width="271.33191" height="63.478062" viewBox="0 0 271 63"><title>No Spoon Productions Logo</title><defs><path d="m 108.7,24.46 c 6.9,18.39 2.2,38.37 -7.6,54.73 -3.15,5.18 -7.01,9.35 -8.42,15.31 -1.12,4.7 -1.4,9.6 -1.48,14.4 -0.46,27.7 4.96,55.3 7.06,82.8 0.88,11.6 1.74,23.7 -0.38,35.1 -1.2,6.5 -4.13,14.5 -11.89,14.7 -7.83,0.1 -11.09,-9.3 -12.17,-16.3 -2.04,-13.2 -0.73,-27 0.46,-40.2 2.43,-26.8 8.06,-54.2 6.3,-81.2 C 80.3,99.48 79.79,95.04 78.24,90.98 77.31,88.54 75.81,86.63 74.33,84.49 70.94,79.59 67.95,74.4 65.58,68.93 58.56,52.78 57.54,34.03 66.09,18.24 c 3.57,-6.61 12,-18.45 21,-17.14 10.5,1.54 18.31,14.5 21.61,23.36 z" id="spoon" style="stroke:white;fill:none;stroke-width:4;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:4, 8, 4, 9;stroke-dashoffset:0"></path></defs><switch><g transform="matrix(0.375,0,0,0.375,-17.549968,-146.88724)" id="layer-1"><g transform="matrix(1.25,0,0,-1.25,-177.3,986.5)" id="foreground"><g id="missing-spoon"><title id="title3134">Seal</title><desc id="desc3136">Horizontal “missing spoon” icon (transparent with dotted outline), facing left</desc><use transform="matrix(0,-2.421,-2.367,0,755.7,616.3)" id="use-spoon" style="stroke:#000000" x="0" y="0" width="174" height="244" xlink:href="#spoon"></use></g></g></g><foreignObject width="271" height="63"><img width="271" height="63" src="/img/no-spoon-productions-2012-small-plain.png" alt="Seal" /></foreignObject></switch></svg>
</div><!-- #logo -->
<hgroup>
<h1>NoSpoon<span>.tv</span></h1>
</hgroup>
</div>
<p id="coming-soon"><i>Coming soon</i></p>
</header>
<article role="main">
<section id="about" class="clearfix">
<section id="intro">
<hgroup>
<h2>Hollywood’s finished.</h2>
</hgroup>
<p>We’re calling it. Enough with the recycled plots, CGI overdoses, and tech that tells you how and when to watch your own videos. The time for open, independent films is <em>now</em>. But where to start? The Internet’s all cat videos and viral-wannabes. Where’s the quality? The <em>artistry</em>? It’s time to escape the Matrix. It’s time for No Spoon.</p>
</section>
<section id="dfn">
<!--<hgroup>
<h2>Glitches Come In Two.</h2>
</hgroup>-->
<p>We’re a filmmaking collaborative comprised of two entities:</p>
<dl>
<!--<x2:di>-->
<dt><dfn>No Spoon <span>Productions</span></dfn></dt>
<dd>A Boston-based digital studio focused on telling compelling visual stories. Character-driven, whether they’re dramas or comedies.</dd>
<!--</x2:di>-->
<!--<x2:di>-->
<dt><dfn>NoSpoon<span>.tv</span></dfn></dt>
<dd>Part magazine, part video portal—a site dedicated to the exhibition, discussion, and review of the best (and worst) of cinema.</dd>
<!--</x2:di>-->
</dl>
</section>
</section>
<section id="sign-up">
<hgroup>
<h2>Subscribe for Updates</h2>
</hgroup>
<p>Join our e-mail newsletter to be notified when we go live. No SPAM, no information selling.</p>
<form id="signup" action="<?=$_SERVER['PHP_SELF']; ?>" method="post">
<dl>
<dd><input name="email" id="email" type="email" /> <input name="submit" type="submit" value="Subscribe" /></dd>
</dl>
</form>
<p>Or keep an eye out for tweets: <br />
<a title="No Spoon Productions on Twitter" href="http://twitter.com/NoSpoonProduct"><code>@NoSpoonProduct</code></a> / <a title="NoSpoon.tv on Twitter" href="http://twitter.com/NoSpoonTV"><code>@NoSpoonTV</code></a></p>
</section>
</article>
<footer role="contentinfo">
<p>Created by <a title="Hugh Guiney on Twitter" href="http://twitter.com/LordPancreas"><code>@LordPancreas</code></a>.</p>
</footer>
</div>
</body>
</html>
