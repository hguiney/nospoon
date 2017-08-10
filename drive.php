<?php
try {
require($_SERVER['DOCUMENT_ROOT'] . 'includes/aws/search/coverart.php');
$coverArt = new AmazonCoverArt('B0064NTZJO', 'DVD', 'medium');
$product = $coverArt->getArray();
/*$product = array(
	'url' => 'http://ecx.images-amazon.com/images/I/51eawS9K0qL._SL160_.jpg',
	'page_url' => 'http://www.amazon.com/Drive-UltraViolet-Digital-Copy-Blu-ray/dp/B0064NTZJO%3FSubscriptionId%3DAKIAIH55RAJODGWTXQLQ%26tag%3Dnospotv-20%26linkCode%3Dsp1%26camp%3D2025%26creative%3D165953%26creativeASIN%3DB0064NTZJO'
);*/
//include($_SERVER['DOCUMENT_ROOT'] . 'includes/content/header.php');
?>
<article id="drive" class="review">
<header>
<hgroup>
<h2>Review: <cite>Drive</cite> (2011)</h2>
<h3><span>by</span> Roger Ebert<!--Hugh Guiney--></h3>
</hgroup>

<figure>
<img alt="img" src="/img/drive.jpg" />
<figcaption>Film District presents a film directed by Nicolas Winding Refn. Written by Hossein Amini, based on the novel by James Sallis.</figcaption>
</figure>
</header>

<aside id="overview">
<hgroup class="implied">
<h3>Overview</h3>
</hgroup>

<dl class="clearfix">
<dt class="runtime">Runtime</dt>
<dd>100 minutes</dd>
<dt class="director">Director</dt>
<dd>Nicolas Winding Refn</dd>
<dt class="starring">Starring</dt>
<dd>Ryan Gosling</dd>
<dd>Carey Mulligan</dd>
<dd>Bryan Cranston</dd>
<dd>Albert Brooks</dd>
<dd>Ron Perlman</dd>
<dd>Oscar Isaac</dd>
<dt class="content-rating">Content Rating</dt>
<dd>“R” (<a title="“What Each Rating Means” on MPAA.org" href="http://www.mpaa.org/ratings/what-each-rating-means"><abbr>MPAA</abbr></a>) for strong brutal bloody violence, language and some nudity</dd>
<!--<dt class="ar">Aspect Ratio</dt>
<dd>2.35:1</dd>-->
</dl>
<ul>
<li class="imdb"><a href="http://www.imdb.com/title/tt0780504/">IMDb</a></li>
<li class="wiki"><a href="http://en.wikipedia.org/wiki/Drive_(2011_film)">Wikipedia</a></li>
<li class="az"><a href="<?php echo $product['page_url']; ?>">Buy on Amazon</a></li>
</ul>
</aside><!-- #overview -->

<div class="entry-content" contentEditable="true">
<p>The Driver drives for hire. He has no other name, and no other life. When we first see him, he's the wheelman for a getaway car, who runs from police pursuit not only by using sheer speed and muscle, but by coolly exploiting the street terrain and outsmarting his pursuers. By day, he is a stunt driver for action movies. The two jobs represent no conflict for him: He drives.
<p>As played by Ryan Gosling, he is in the tradition of two iconic heroes of the 1960s: Clint Eastwood's Man With No Name and Alain Delon in <cite>Le Samourai</cite>. He has no family, no history and seemingly few emotions. Whatever happened to him drove any personality deep beneath the surface. He is an existential hero, I suppose, defined entirely by his behavior.</p>
<p>That would qualify him as the hero of a mindless action picture, all CGI and crashes and mayhem. <cite>Drive</cite> is more of an elegant exercise in style, and its emotions may be hidden but they run deep. Sometimes a movie will make a greater impact by not trying too hard. The enigma of the driver is surrounded by a rich gallery of supporting actors who are clear about their hopes and fears, and who have either reached an accommodation with the Driver, or not. Here is still another illustration of the old Hollywood noir principle that a movie lives its life not through its hero, but within its shadows.</p>
<p>The Driver lives somewhere (somehow that's improbable, since we expect him to descend full-blown into the story). His neighbor is Irene, played by Carey Mulligan, that template of vulnerability. She has a young son, Benecio (Kaden Leos), who seems to stir the Driver's affection, although he isn't the effusive type. They grow warm, but in a week, her husband, Standard (Oscar Isaac), is released from prison. Against our expectations, Standard isn't jealous or hostile about the new neighbor, but sizes him up, sees a professional and quickly pitches a $1 million heist idea. That will provide the engine for the rest of the story, and as Irene and Benecio are endangered, the Driver reveals deep feelings and loyalties indeed, and undergoes enormous risk at little necessary benefit to himself.</p>
<p>The film by the Danish director Nicolas Winding Refn (<cite>Bronson</cite>), based on a novel by James Sallis, peoples its story with characters who bring lifetimes onto the screen, in contrast to the Driver, who brings as little as possible. Ron Perlman seems to be a big-time operator working out of a small-time front, a pizzeria in a  strip mall. Albert Brooks, not the slightest bit funny, plays a producer of the kinds of B movies the Driver does stunt driving for &#8212; and also has a sideline in crime. These people are ruthless. </p>
<p>More benign is Bryan Cranston, as the kind of man you know the Driver must have behind him, a genius at auto repairs, restoration and supercharging.</p>
<p>I mentioned CGI earlier. <cite>Drive</cite> seems to have little of it. Most of the stunt driving looks real to me, with cars of weight and heft, rather than animated impossible fantasies. The entire film, in fact, seems much more real than the usual action-crime-chase concoctions we've grown tired of. Here is a movie with respect for writing, acting and craft. It has respect for knowledgable moviegoers. There were moments when I was reminded of <cite>Bullitt</cite>, which was so much better than the films it inspired. The key thing you want to feel, during a chase scene, is involvement in the purpose of the chase. You have to care. Too often we're simply witnessing technology.</p>
<p>Maybe there was another reason I thought of <cite>Bullitt</cite>. Ryan Gosling is a charismatic actor, as Steve McQueen was. He embodies presence and sincerity. Ever since his chilling young Jewish neo-Nazi in <cite>The Believer</cite> (2001), he has shown a gift for finding arresting, powerful characters. An actor who can fall in love with a love doll and make us believe it, as he did in <cite>Lars and the Real Girl</cite> (2007), can achieve just about anything. <cite>Drive</cite> looks like one kind of movie in the ads, and it is that kind of movie. It is also a rebuke to most of the movies it looks like.</p>
<!--<p>Tatsoi radicchio cassava water spinach water spinach. Scorzonera celtuce lentil; beet greens cauliflower radicchio radicchio bitter melon velvet bean miner's lettuce. Green bean skirret, horseradish guar pigeon pea common bean pigeon pea parsnip ginger jícama mizuna greens lagos bologi. Chrysanthemum leaves ahipa scorzonera hamburg parsley cardoon chinese mallow tigernut winter melon.</p>
<p>Horse gram prussian asparagus, broccoli rabe tatsoi. Sea beet bok choy swede. Bitterleaf turnip celtuce chinese cabbage, sweet pepper golden samphire brussels sprout tinda. Watercress tinda velvet bean hamburg parsley turnip greens camas turnip - leaves, kohlrabi soybean mung bean!</p>
<p>Lizard's tail samphire tomatillo, onion chrysanthemum leaves skirret beet greens endive - winged bean green bean, earthnut pea? Watercress, burdock, canna, guar polk spinach chickweed tepary bean yardlong bean. Carrot florence fennel mustard miner's lettuce catsear polk chicory; horseradish velvet bean dolichos bean leaves winged bean. Corn salad, yacón broadleaf arrowhead.</p>
<p>Yardlong bean radish fat hen fiddlehead ceylon spinach sierra leone bologi sweet corn aka corn; aka maize. Tepary bean cress skirret nopal plectranthus sweet pepper yardlong bean bok choy, pignut.</p>
<p>Kai-lan rutabaga water spinach burdock ricebean winter melon lentil, mung bean. Gobo mizuna greens tomato komatsuna beet greens. Bamboo shoot beetroot rutabaga onion. Garden Rocket sweet pepper potato, soybean, lettuce, lettuce, azuki bean, kuka chinese artichoke bok choy! Indian pea water chestnut, watercress fluted pumpkin lizard's tail tatsoi, earthnut pea tepary bean hamburg parsley. Welsh onion peanut yam, manioc sweet pepper. Chaya mooli peanut fat hen melokhia chickpea guar tinda winter melon.</p>-->
</div><!-- #entry-content -->

<aside class="buy">
<hgroup>
<h3>Own it on Blu-ray</h3>
</hgroup>
<div>
<a href="<?php echo $product['page_url']; ?>">
<img src="<?php echo $product['url']; ?>" alt="“Drive” Cover Art" />
<p>Buy on Amazon<!--<img src="https://images-na.ssl-images-amazon.com/images/G/01/associates/remote-buy-box/buy3._V192207739_.gif" /><!--<span>Buy on Amazon</span>--></p>
</a>
</div>
<section>
<hgroup>
<h4>Buy other movies referenced in this article</h4>
</hgroup>
<ul>
<li></li>
</ul>
</section>
</aside>

<footer>

<section id="author">
<hgroup class="implied">
<h4>About the Author</h4>
</hgroup>

<img src="/img/me-new-glasses-nu.jpg" width="100" height="100" />
<address>
<dl>
<dt><a href="/authors/hugh-guiney/"> Hugh Guiney</a></dt>
<dd>Editor-in-chief, Founder</dd>
</dl>
</address>
<p>Hugh Guiney has been creating movies since he was 10 years old. Beginning in the late 1990s, he would direct improvised storylines with his brothers and friends and act them out in front of the camera.</p>
</section><!-- #author -->

<section id="share">
<hgroup class="implied">
<h4>Share</h4>
</hgroup>

<ul>
<li>Twitter</li>
<li>Facebook</li>
<li>Google+</li>
<li>E-mail</li>
</ul>
</section><!-- #share -->

<section id="published">
<hgroup class="implied">
<h4>Publication History</h4>
</hgroup>

<dl>
<dt class="pubdate">Published on</dt>
<dd><a href="#" title="Other posts on this date"><time pubdate="pubdate" datetime="2011-11-07">Oct 7th, 2011</time></a></dd>

<!-- One-to-one = Class on dt -->
<dt class="update">Last updated on</dt>
<dd><time datetime="2011-11-08">Oct 8th, 2011</time></dd>
</dl>
</section><!-- #published -->

<section id="license">
<hgroup class="implied">
<h4>License</h4>
</hgroup>

<p><a rel="license" title="Full license terms on Creative Commons" href="http://creativecommons.org/licenses/by-nc-nd/3.0/"><img src="" /> <dfn>Creative Commons <abbr>BY-NC-ND 3.0</abbr></dfn></a> You may redestribute this work freely, provided it is: <a href="/terms/#attribution">properly attributed</a>, for noncommercial purposes, and without modification.</p>
</section><!-- #license -->

<div id="comments">
<p>Do not try to comment—that's impossible. Instead, only try to realize the truth: there are no comments.</p>
</div>

</footer>

</article>
<?php
//include($_SERVER['DOCUMENT_ROOT'] . 'includes/content/footer.php');
} catch(Exception $e) {
	echo $e->getMessage();
}
?>