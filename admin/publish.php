<?='<!--?xml version="1.0" encoding="utf-8"?-->'?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>
<title>Publish Content</title>
</head>
<body>
<header role="banner"></header>
<article role="main">
	<h2>New Review by Hugh Guiney</h2>
		<fieldset id="subject">
			<h3>Subject</h3>
			<dl>
				<dt><label for="subject-title">Title of Work</label></dt>
				<dd><input type="text" id="subject-title" name="subject[title]" /></dd>
				<dt><label for="release-date">Release Date</label></dt>
				<dd><input type="text" id="release-date" name="subject[release_date]" /></dd>
				<dt><label for="runtime">Runtime (in minutes)</label></dt>
				<dd><input type="number" id="runtime" name="subject[runtime]" value="90" /></dd>
				<dt><label for="director">Directed by</label></dt>
				<dd><input type="text" id="director" name="subject[director]" /></dd>
				<dt><label for="writer">Written by</label></dt>
				<dd><textarea id="writer" name="subject[writer]"></textarea></dd>
				<dt><label for="actor">Starring</label></dt>
				<dd><textarea id="actor" name="subject[actor]"></textarea></dd>
			</dl>
			<fieldset>
				<legend>Content Rating</legend>
				<dl>
					<dt><label for="content-rating">Code</label></dt>
					<dd><input type="text" id="content-rating" name="subject[content_rating][_]" /></dd>
					<dt><label for="content-rating-system">System</label></dt>
					<dd>
						<select id="content-rating-system" name="subject[content_rating][system]">
							<option value="" title="None">---</option>
							<option value="mpaa" selected>MPAA</option>
							<option value="fcc">FCC</option>
							<option value="yt">YouTube</option>
						</select>
						<label>Custom: <input type="text" name="subject[content_rating][custom_system][_]" /></label>
						<label>Definitions: <input type="url" name="subject[content_rating][custom_system][defs]" /></label>
					</dd>
				</dl>
			</fieldset>
		</fieldset><!-- #subject -->
		<section id="content">
			<h3 id="content-legend">Review</h3>
			<dl>
				<dt><label for="body">Body</label></dt>
				<dd><textarea id="body" name="body" required></textarea></dd>
				<!--dt><label for="title">Title</label></dt>
				<dd><input type="text" id="title" name="title" required /></dd><!-- aria-labelledby="content-legend title" -->
				<dt><label for="subtitle">Slug</label></dt>
				<dd><input type="text" id="subtitle" name="subtitle" /> <a href="javascript:void(0)">?</a></dd>
			</dl>
		</section><!-- #content -->
		<!-- #source -->
		<section id="organization">
			<h3 id="organization-legend">Context</h3>
			<dl>
				<dt><label for="tags">Tags</label></dt>
				<dd><textarea id="tags" name="tags">video, comedy</textarea></dd>
			</dl><!-- #tags -->
			<p><a href="#" id="save-tags" role="button">Save tags</a>.</p><!-- #maybe id is not necessary, saves all for parent section -->
		</section><!-- #categorization -->
		<aside id="social">
			<h3>Social</h3>
			<p>The following posts will be scheduled to go out at 11 AM on Friday.</p>
			<!--details>
				<summary>How-to</summary>
				<h4>Twitter</h4>
				<dl>
					<dt><code>#term</code></dt>
					<dd>Hashtag</dd>
					<dt><code>@user</code></dt>
					<dd>Mention</dd>
				</dl>
			</details-->
			<dl>
				<dt><label><input type="checkbox" name="twitter" checked="checked" /> Post to Twitter</label></dt>
				<dd><textarea name="tweet"></textarea></dd>
				<dt><label><input type="checkbox" name="facebook" checked="checked" /> Post to Facebook</label></dt>
				<dd><textarea name="facebook-status"></textarea></dd>
				<dt><label><input type="checkbox" name="gplus" checked="checked" /> Post to Google+</label></dt>
				<dd><textarea name="gplus-status"></textarea></dd>
			</dl>
			<p><a href="#" id="save-statuses" role="button">Save Statuses</a>.</p>
		</aside>
		<section id="actions">
			<h3>Actions</h3>
			<ul>
				<li><input type="submit" name="preview" value="Preview" /></li>
				<li><input type="submit" name="save[all]" value="Save Draft" /></li>
				<li><input type="submit" name="submit" value="Submit" /></li>
			</ul>
		</section>
	</form>
</article>
<footer role="contentinfo"></footer>
</body>
</html>