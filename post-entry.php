<?php
	/*header('Content-Type: application/xhtml+xml');
	echo '<?xml version="1.0" encoding="UTF-8"?>'."\n";*/
?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" lang="en" xml:lang="en">
<head>
	<title>New Entry</title>
	<meta charset="utf-8"/>
	<link href="style/normalize.css" rel="stylesheet" />
	<link href="style/index.post-entry.css" rel="stylesheet" />
</head>
<body>
<script src="script/prefixfree.min.js"></script>
<script src="script/modernizr.custom.min.js"></script>
<form name="form" method="post" action="post.php">
	<p><label>Load content from file: <input type="file" name="file" accept="application/xhtml+xml,text/html,text/plain,text/x-markdown,text/*" /></label></p>
	<section id="article-metadata">
		<h2>Article Metadata</h2>
		<dl>
			<dt><label for="title">Title</label></dt>
			<dd><input id="title" class="long" name="title" type="text" placeholder="“Drive” May Be The Best Movie of 2011" maxlength="59" /></dd>
			<dt><label for="post-types">Post Type</label></dt>
			<dd>
				<select id="post-types" name="post-types">
					<option>Musing</option>
					<option>Inspiration</option>
					<option selected="selected">Review</option>
					<option>Production</option>
					<option>Shop</option>
				</select>
			</dd>
			<dt><label for="topic-type">Topic Type</label></dt>
			<dd>
				<select id="topic-type" name="topic-type">
					<option selected="selected">Film</option>
					<option disabled="disabled">TV</option>
					<option disabled="disabled">Web</option>
					<option disabled="disabled">Technology</option>
					<option disabled="disabled">Business</option>
					<option disabled="disabled">Design</option>
					<option disabled="disabled">Lifestyle</option>
				</select>
			</dd>
		</dl>
		<section id="topic-metadata">
			<h3>Topic Metadata</h3>
			<p><input id="guess-topic-metadata" name="guess-topic-metadata" type="button" value="Guess data based on title or title and release year" /></p>
			<dl>
				<dt><label for="topic-title">Title</label></dt>
				<dd><input id="topic-title" name="topic-title" type="text" required placeholder="Drive" /></dd>
				<dt><label for="topic-published">Release Date or Year</label></dt>
				<dd><input id="topic-published" name="topic[published]" type="text" required title="YYYY-MM-DD, etc. (ISO 8601)" pattern="^([\+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T\s]((([01]\d|2[0-3])((:?)[0-5]\d)?|24\:?00)([\.,]\d+(?!:))?)?(\17[0-5]\d([\.,]\d+)?)?([zZ]|([\+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$" data-webkit-bug="105875" placeholder="2011-09-16" /></dd>
				<dt><label for="topic-running-time">Running Time</label></dt>
				<dd><input id="topic-running-time" class="short" name="topic[running-time]" type="number" min="0" title="Numerical value in minutes" placeholder="100" /></dd>
				<dt><label for="topic-language">Language</label></dt>
				<dd>
					<input id="topic-language" list="topic-language-list" name="topic[language]" type="text" placeholder="English" />
					<datalist id="topic-language-list">
						<option>English</option>
						<option>French</option>
						<option>German</option>
						<option>Japanese</option>
					</datalist>
				</dd>
				<dt><label for="topic-director">Director(s)</label></dt>
				<dd><textarea id="topic-director" name="topic[director]" title="[Name], comma-and-space or newline–separated" placeholder="Nicolas Winding Refn"></textarea></dd>
				<dt><label for="topic-starring">Starring</label></dt>
				<dd><textarea id="topic-starring" name="topic[starring]" title="[Name] as [Character], comma-and-space or newline–separated" placeholder="Ryan Gosling as The Driver, Carey Mulligan as Irene"></textarea></dd>
				<dt><label id="topic-content-rating-legend">Content Rating</label></dt>
				<dd>
					<dl>
						<dt><label id="topic-content-rating-standard-label" for="topic-content-rating-standard">Standard</label></dt>
						<dd>
							<select id="topic-content-rating-standard" name="topic[content-rating][standard]" aria-labelledby="topic-content-rating-legend topic-content-rating-standard-label">
								<option>MPAA</option>
								<option>FCC</option>
								<option>YouTube</option>
								<option>None</option>
							</select>
						</dd>
						<dt><label id="topic-content-rating-code-label" for="topic-content-rating-code">Code</label></dt>
						<dd>
							<select id="topic-content-rating-code" name="topic[content-rating][code]" aria-labelledby="topic-content-rating-legend topic-content-rating-code-label">
								<option>G</option>
								<option>PG</option>
								<option>PG-13</option>
								<option selected="selected">R</option>
								<option>NC-17</option>
							</select>
						</dd>
						<dt><label id="topic-content-rating-reason-label" for="topic-content-rating-reason">Reason</label></dt>
						<dd><input id="topic-content-rating-reason" class="long" name="topic[content-rating][reason]" type="text" placeholder="strong brutal bloody violence, language and some nudity" aria-labelledby="topic-content-rating-legend topic-content-rating-reason-label" /></dd>
					</dl>
				</dd>
				<dt><label for="topic-verdict">Verdict</label></dt>
				<dd>
					<select id="topic-verdict" name="topic[score]">
						<option id="nstv-ma" value="1">★★★★★★★★ Masterpiece</option>
						<option id="nstv-s" value="0.875">★★★★★★★ Sublime</option>
						<option id="nstv-ti" value="0.75">★★★★★★ Tight</option>
						<option id="nstv-nh" value="0.625">★★★★★ Not Heinous</option>
						<option id="nstv-m" value="0.5">★★★★ Mediocre</option>
						<option id="nstv-a" value="0.375">★★★ A’ight</option>
						<option id="nstv-tra" value="0.25">★★ Trash</option>
						<option id="nstv-tri" value="0.125">★ Tripe</option>
						<option id="nstv-u" value="0">✗ Unwatchable</option>
					</select>
				</dd>
				<dt>More Info</dt>
				<dd>
					<dl>
						<dt><label for="topic-more-info-imdb">IMDb</label></dt>
						<dd><input id="topic-more-info-imdb" name="topic[more-info][imdb]" type="url" placeholder="http://www.imdb.com/title/tt0780504/" /></dd>
						<dt><label for="topic-more-info-tmdb">TMDb</label></dt>
						<dd><input id="topic-more-info-tmdb" name="topic[more-info][tmdb]" type="url" placeholder="http://www.themoviedb.org/movie/64690-drive" /></dd>
						<dt><label for="topic-more-info-wikipedia">Wikipedia</label></dt>
						<dd><input id="topic-more-info-wikipedia" name="topic[more-info][wikipedia]" type="url" placeholder="http://en.wikipedia.org/wiki/Drive_(2011_film)" /></dd>
						<dt><label for="topic-more-info-amazon">Amazon</label></dt>
						<dd><input id="topic-more-info-amazon" name="topic[more-info][amazon]" type="url" placeholder="http://www.amazon.com/Drive-UltraViolet-Digital-Copy-Blu-ray/dp/B0064NTZJO%3FSubscriptionId%3DAKIAIH55RAJODGWTXQLQ%26tag%3Dnospotv-20%26linkCode%3Dsp1%26camp%3D2025%26creative%3D165953%26creativeASIN%3DB0064NTZJO" /></dd>
						<dt><label for="topic-more-info-itunes">iTunes</label></dt>
						<dd><input id="topic-more-info-itunes" name="topic[more-info][itunes]" type="url"/></dd>
						<dt><label for="topic-more-info-netflix">Netflix</label></dt>
						<dd><input id="topic-more-info-netflix" name="topic[more-info][netflix]" type="url"/></dd>
					</dl>
				</dd>
			</dl>
		</section>
	</section>
	<section id="content">
		<h2>Content</h2>
		<p>
			<input type="submit" value="Save Now"/> Last Saved: <time datetime="2013-01-01">8 PM</time>
		</p>
		<dl class="options">
			<dt>Editing Mode</dt>
			<dd><label><input type="radio" name="format" value="md"/> Markdown</label></dd>
			<dd><label><input type="radio" name="format" value="xhtml"/> <abbr>XHTML</abbr></label></dd>
			<dd><label><input type="radio" name="format" value="wysiwyg" checked="checked"/> <abbr title="What You See Is What You Get">WYSIWYG</abbr> </label></dd>
		</dl>
		<div id="editor-controls">
			<dl class="options">
				<dt>Italics</dt>
				<dd><button>Verbal Emphasis</button></dd>
				<dd><button>Citation</button></dd>
				<dd><button>Plain Italics</button></dd>
				<dt>Bold</dt>
				<dd><button>Strong Verbal Emphasis</button></dd>
				<dd><button>Plain Bold</button></dd>
			</dl>
			<!--dl class="options">
				<dt>Formatting</dt>
				<dd><button>Verbal Emphasis</button></dd>
				<dd><button>Strong Verbal Emphasis</button></dd>
				<dd><button>Title of Creative Work</button></dd>
			</dl-->
		</div>
		<div id="editor">
			<textarea id="md" class="format" name="body[md]"></textarea>
			<textarea id="xhtml" class="format" name="body[xhtml]"></textarea>
			<div id="wysiwyg" class="format" contenteditable="true">
				<p>test</p>
			</div>
		</div>
		<dl>
			<dt><label for="tags">Tags</label></dt>
			<dd>
				<p><input type="button" value="Generate tags based on content" /></p>
				<input type="text" id="tags" class="long" name="tags" placeholder="action, drama, ’80s-inspired, The Gos" title="Comma-and-space–separated list" />
				<!--datalist id="tags-list">
					<option>video</option>
					<option>comedy</option>
					<option>drama</option>
				</datalist-->
			</dd>
		</dl>
	</section>
	<aside id="sync">
		<h3>Sync</h3>
		<h4>Variables</h4>
		<ul>
			<li><var>[Title]</var> – Article title, quoted, e.g. <samp data-data="title-quoted">“‘Drive’ May Be The Best Movie of 2011”</samp></li>
			<li><var>[Topic Title]</var> – Topic title, quoted, e.g. <samp data-data="topic-title-quoted">“Drive”</samp></li>
			<li><var>[Topic Year]</var> – Topic release year, e.g. <samp data-data="topic-published-year">2011</samp></li>
			<li><dfn><var>[Topic]</var></dfn> – Topic title and release year, e.g. <samp data-data="topic-title-quoted topic-published-year-paren">“Drive” (2011)</samp></li>
			<li><var>[Short URL]</var> – <samp data-data="short-url">http://ns.pn/r/drive-2011</samp></li>
			<li><var>[URL]</var> – <samp data-data="url">http://nospoon.tv/reviews/drive-2011</samp></li>
		</ul>
		<p><label><input id="sync-mirror-text" type="checkbox" checked="checked" /> Mirror text</label></p>
		<dl>
			<dt><label><input type="checkbox" name="twitter" checked="checked"/> Post to Twitter</label></dt>
			<dd><textarea id="tweet" class="long" name="tweet" maxlength="140" placeholder="[Topic]: Not sure if I'm more in love with Carey Mulligan or Ryan Gosling. That soundtrack! Full review: [Short URL]"></textarea></dd>
			<dt><label><input type="checkbox" name="facebook" checked="checked"/> Post to Facebook</label></dt>
			<dd>
				<textarea id="facebook-status" class="long" name="facebook-status" maxlength="63206" placeholder="“[Topic]: Not sure if I'm more in love with Carey Mulligan or Ryan Gosling. That soundtrack!"></textarea>
			</dd>
		</dl>
	</aside>
	<section id="actions">
		<h3>Actions</h3>
		
		<!--ul>
<li><input type="submit" name="preview" value="Preview" /></li>
<li><input type="submit" name="save" value="Save Draft" /></li>
</ul-->
		
		<ul class="options">
			<!-- If Contributor -->
			<li><input id="submit-to-editor" type="submit" name="submit" value="Submit to Editor" /></li>
			<!-- /If Contributor -->
			<!-- If Editor -->
			<li><input id="publish-now" type="submit" name="submit" value="Publish Now" /></li>
			<li><input id="queue" type="submit" name="submit" value="Queue" /></li>
			<!-- /If Editor -->
			<li><input id="export" type="button" name="export" value="Export" /></li>
		</ul>
	</section>
</form>
<script src="script/xregexp-all-min.js"></script>
<script src="script/showdown.js"></script> 
<script src="script/reMarked.js"></script> 
<script src="script/functions.js"></script> 
<script src="script/tmdb.js"></script> 
<script src="script/post-entry.js"></script> 
<script src="script/playground.js"></script>
</body>
</html>