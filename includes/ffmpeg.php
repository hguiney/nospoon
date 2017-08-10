<?php
try {
	require_once 'FFmpegPHP2/FFmpegAutoloader.php';
	$movie = new ffmpeg_movie($_GET['file'], false);
	echo $movie->{$_GET['method']}();
} catch(Exception $e) {
	echo $e->getMessage();
}
?>