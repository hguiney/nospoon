<?php
include('lessify/lessify.inc.php');
try {
	header('Content-Type: text/css; charset=UTF-8');
	$lc = new lessc();
	$lc->importDir = array('/srv/www/nospoon/tv/dev/private/');
	//$lc->importDir = '.';
	//$lesscode = file_get_contents('grid.less');
	$lesscode = file_get_contents('responsive.less');
	$out = $lc->parse($lesscode);
	echo $out;
	//lessc::ccompile('responsive.less', 'responsive.css');
} catch (exception $ex) {
	//header('HTTP/1.1 500 Internal Server Error');
	echo $ex->getMessage();
}
?>