// global for movie player
var player;

$("head").append("<link />");
var CSS = $("head").children(":last");
var cssType = 'text/css';
var cssRel = 'stylesheet';

if($('html').hasClass('-webkit-')) {
	CSS.attr({
		'type':cssType,
		'rel':cssRel,
		'href':'/css/webkit.css.php'
	});
} else if($('html').hasClass('-moz-')) {
	CSS.attr({
		'type':cssType,
		'rel':cssRel,
		'href':'/css/moz.css.php'
	});
}

$(document).ready(function () {

//$('video').removeAttr('controls');

MediaElement('player-1', {success: function(media) {
	media.muted = true;
	
	// Variable Defs	
	var video = $(media); // jQuery Object
	var controls = $('.controls').eq(0); // Controls Menu (create dynamically)
	var frameRate;
	
	// Play/Pause
	var playPause = controls.find('.play-pause').eq(0);
	var playIcon = playPause.text() || '▶';
	var playText = playPause.attr('title') || 'Play';
	var pauseIcon = playPause.attr('data-pause-icon') || '‖';
	var pauseText = playPause.attr('data-pause-title') || 'Pause';
	
	// Seek bar
	var seek = controls.find('.seek').eq(0);
	var rangeSeek; // <input type="range" />
	var seekbarEnabled; // Boolean
	var seekAttr; // Value attribute (value or data-value)
	
	// Playback Progress
	var playbackProgress = controls.find('.playback').eq(0);
	var playbackTime = controls.find('.current').eq(0);
	var durationTime = controls.find('.duration').eq(0);
	//var currentPlaybackTimeCode;
	var currentPlaybackPc;
	
	// Buffered Progress
	var progress = controls.find('.buffered').eq(0); 
	var currentProgressPc = progress.find('output').eq(0);
	var currentBufferedPc;
	//var maxProgress = progress.find('.max').eq(0);
	
	// Time
	var currentTime;
	var currentTimeCode;
	var duration;
	var durationTimeCode;
	
	// Function Defs
	function playPauseToggle() {
		if(media.paused) {
			media.play();
		} else {
			media.pause();
		}
	}
	
	function revealPause() {
		playPause.text(pauseIcon);
		playPause.attr('title', pauseText);
	}
	
	function revealPlay() {
		playPause.text(playIcon);
		playPause.attr('title', playText);
	}
	
	function getPc(numerator, denominator) {
		return Math.floor((numerator / denominator) * 100);
	}
	
	function getCurrentBufferedPc() {
		return getPc(media.buffered.end(0), duration);
	}
		
	function updateBufferedProgress() {
		if(currentBufferedPc < 100) {
			currentBufferedPc = getCurrentBufferedPc();
			progress.val(currentBufferedPc);
			currentProgressPc.text(currentBufferedPc);
		} else {
			progress.attr('title', 'Buffering Complete');
		}
	}
	
	function callFFmpeg(method) {
		$.ajax({
			url: '/ffmpeg.php?file=' + media.src + '&method=' + method,
			success: function(data) {
				return data;
			}
		});
	}

	function getTimeCode(seconds) {
		//18m 3s
		return mejs.Utility.secondsToTimeCode(seconds, false, false, frameRate);
	}
	
	function updateTimeCode() {
		currentTimeCode = getTimeCode(currentTime);
		playbackTime.text(currentTimeCode);
		//currentPlaybackPc = getPc(currentTime, duration);
		//playbackProgress.val(currentPlaybackPc);
	}
	
	function updateSeekPosition() {
		seek.attr(valAttr, currentTime);
		playbackProgress.attr('value', currentTime);
	}
		
	// Append controls
	
	// Detect seek bar capability
	if(Modernizr.inputtypes.range && Modernizr.progressbar) {
		rangeSeek = $('<input class="seek" title="Seek" type="range" value="0" step="any" />');		
		seek.replaceWith(rangeSeek);
		seek = controls.find('input.seek').eq(0);
		progress = controls.find('progress.buffered').eq(0);
		$('html').addClass('seekbar');
		seekbarCapable = true;
	} else {
		seekbarCapable = false;
	}
	
	video.on('loadedmetadata', function mediaLoadedMetadata() {
		//console.log('mediaLoadedMetadata()');
		duration = media.duration;
		durationTimeCode = getTimeCode(duration);
		frameRate = callFFmpeg('getFrameRate');
		
		if(seekbarCapable) {
			seek.attr('max', duration);
			seek.on('change', function seekChange() {
				newTime = seek.val();
				media.currentTime = newTime;
			});
			playbackProgress.attr('max', duration);
			//playbackProgress.attr('title', durationTimeCode);
			//playbackProgress.attr('data-duration-tc', durationTimeCode);
			durationTime.text(durationTimeCode);
			valAttr = 'value';
		} else {
			valAttr = 'data-value';
		}
		
		//console.log(getTimeCode());
		
		currentBufferedPc = getCurrentBufferedPc();
		updateBufferedProgress();	
	
		video.on('timeupdate', function mediaTimeUpdate() {
			//console.log('mediaTimeUpdate()');
			currentTime = media.currentTime;
			updateSeekPosition();
		/*
			Technically this should be under: `video.on('progress', function mediaProgress() {` 
			but I guess support isn't quite there yet
		*/
			updateBufferedProgress();
			updateTimeCode();
		});
	});

	playPause.on('click', playPauseToggle);
	video.on('play', revealPause);
	video.on('pause', revealPlay);
}});

});