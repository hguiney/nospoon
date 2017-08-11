<?php header('Content-Type: text/css; charset=UTF-8'); ?>
html {
	background:black;
	color:white;
}

time::after {
	content:'test';
}

progress
, progress::-webkit-progress-bar
, input[type=range]
/*, input[type=range]::-webkit-slider-thumb*/
{
<?php include('remove-default-ui.inc.css'); ?>
}

.playback::-webkit-progress-value
{
<?php include('playback.inc.css'); ?>
}

.buffered::-webkit-progress-value
{
<?php include('buffered.inc.css'); ?>
}