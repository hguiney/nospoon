<?='<!--?xml version="1.0" encoding="utf-8"?-->'?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>
<title>Publish Content</title>
</head>
<body>
<header role="banner"></header>
<article role="main">
	<h2>Posting as Hugh Guiney</h2>
	<form method="post" action="post.php">
		<fieldset id="format">
			<h3 id="format-legend">Format</h3>
			<ul>
				<li><label><input type="radio" name="format" value="markdown" /> Markdown</label></li>
				<li><label><input type="radio" name="format" value="xhtml" checked="checked" /> XHTML</label></li>
			</ul>
		</fieldset><!-- #format -->
		<section id="content">
			<h3 id="content-legend">Content</h3>
			<dl>
				<dt><label for="title">Title</label></dt>
				<dd><input type="text" id="title" name="title" aria-labelledby="content-legend title" /></dd>
				<dt><label for="body">Body</label></dt>
				<dd><textarea id="body" name="body"></textarea></dd>
			</dl>
		</section><!-- #categorization -->
		<section id="organization">
			<h3 id="organization-legend">Organization</h3>
			<div id="categories">
				
			</div>
			<div id="tags">
				<label>Tags: <input list="tags" name="tags" /></label>
				<datalist id="tags">
					<option>video</option>
					<option>comedy</option>
					<option>drama</option>
				</datalist>
			</div>
		</section><!-- #categorization -->
		<aside id="social">
			<h3>Social</h3>
			<dl>
				<dt><label><input type="checkbox" name="twitter" checked="checked" /> Post to Twitter</label></dt>
				<dd><textarea name="tweet"></textarea></dd>
				<dt><label><input type="checkbox" name="facebook" checked="checked" /> Post to Facebook</label></dt>
				<dd><textarea name="facebook-status"></textarea></dd>
			</dl>
		</aside><!-- #social -->
		<section id="actions">
			<h3>Actions</h3>
			<ul>
				<li><input type="submit" name="preview" value="Preview" /></li>
				<li><input type="submit" name="save" value="Save Draft" /></li>
				<li><input type="submit" name="submit" value="Submit" /></li>
			</ul>
		</section><!-- #actions -->
	</form>
</article>
<footer role="contentinfo"></footer>
</body>
</html>