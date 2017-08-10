<?php
header('Content-Type: text/html; charset=utf-8');
include('simplepie/SimplePieAutoloader.php');

$xml = file_get_contents('feeds.xml');
$dom = new DOMDocument();
$dom->loadXML($xml);
$xpath = new DOMXPath($dom);

$sources = $xpath->query('//source');
foreach($sources as $source) {
	echo '<h2><a href="', $source->nodeValue, '">', $source->getAttribute('title'), '</a></h2>';
	$feed = new SimplePie();
	$feed->set_feed_url($source->nodeValue);
	$success = $feed->init();
	$feed->handle_content_type();
	if($success) {
		echo '<h3>', $feed->get_title(), '</h3>';
		
		foreach($feed->get_items() as $item) {
			echo '<p>';
			if(parse_url($item->get_permalink(), PHP_URL_HOST) == 'vimeo.com') {
				$oembed_url = file_get_contents('http://vimeo.com/api/oembed.xml?url=' . urlencode($item->get_permalink()) . '&maxwidth=720');
				$oembed = new SimpleXMLElement($oembed_url);
				echo $oembed->html . '<br />';
				echo $oembed->description;
			} else {
				echo $item->get_permalink() . '<br />';
				//echo $enclosure = $item->get_enclosure(0)->get_link();
				echo $item->get_description();
			}
			echo '</p>';
		}
	}
}
?>