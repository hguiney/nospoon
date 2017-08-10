<?='<!--?xml version="1.0" encoding="utf-8"?-->'?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>
<title>Publish Content</title>
</head>
<body>
<header role="banner"></header>
<article role="main">
	<h2>New Post</h2>
	<form method="post" action="publish.php">
		<fieldset>
			<h3>Choose A Category</h3>
			<ul>
				<li><label><input type="radio" name="cat" value="watch" /> <dfn title="Embedded video">Watch</dfn></label>
					<ul>
						<li><label><input type="radio" name="cat" /> <dfn title="No Spoon originals">Productions</dfn></label></li>
						<li><label><input type="radio" name="cat" /> <dfn title="Found on other sites like Vimeo or YouTube">Inspirations</dfn></label></li>
					</ul>
				</li>
				<li><label><input type="radio" name="cat" value="read" /> <dfn title="Prose content">Read</dfn></label>
					<ul>
						<li><label><input type="radio" name="cat" /> <dfn title="General piece on industry or in response to others">Musings</dfn><!-- ( on the state of the industry, tips &amp; tricks, reactions to other blog posts, etc.)--></label></li>
						<li><label><input type="radio" name="cat" /> <dfn title="Opinion piece on specific movie or show">Reviews</dfn></label></li>
					</ul>
				</li>
			</ul>
		</fieldset>
	</form>
</article>
<footer role="contentinfo"></footer>
</body>
</html>