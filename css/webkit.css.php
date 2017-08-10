<?php header('Content-Type: text/css; charset=UTF-8'); ?>
.controls progress
, .controls progress::-webkit-progress-bar
, .controls input[type=range]
, .controls input[type=range]::-webkit-slider-thumb
{
<?php include('remove-default-ui.inc.css'); ?>
}

.controls input[type=range]::-webkit-slider-thumb
{
	background:rgba(255,255,255,0.5);
	/*box-shadow:0 0 5px rgba(0,0,0,0.5);*/
	width:1px;
	height:19px;
	margin:0 .25em;
}

.controls .playback::-webkit-progress-value
{
<?php include('playback.inc.css'); ?>
	position:relative;
	background:transparent;
}

.controls input[type=range]::-webkit-slider-thumb::before
{
	content: "";
	position: absolute;
	border-width: 0.1875em 0.1875em 0;
	left:-0.18em;
	top:-0.17em;
	border-style: solid;
	border-color: rgba(255,255,255,0.75) transparent;
	display: block;
	width: 0;
}

.controls input[type=range]::-webkit-slider-thumb::after
{
	content: "";
	position: absolute;
	border-width: 0 0.1875em 0.1875em;
	left:-0.18em;
	bottom:-0.125em;
	border-style: solid;
	border-color: rgba(255,255,255,0.75) transparent;
	display: block;
	width: 0;
}

.controls .buffered::-webkit-progress-value
{
<?php include('buffered.inc.css'); ?>
}