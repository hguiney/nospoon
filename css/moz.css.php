<?php header('Content-Type: text/css; charset=UTF-8'); ?>
progress::-webkit-progress-bar
{
<?php include('remove-default-ui.inc.css'); ?>
}

.playback::-moz-progress-bar
{
<?php include('playback.inc.css'); ?>
}

.buffered::-moz-progress-bar
{
<?php include('buffered.inc.css'); ?>
}