/* Author: Hugh Guiney */

$(document).ready(function(){
	// CSS detection
	var
		cssDetector = $('<span id="css-detector"></span>')
		, cssEnabled = false
		// http://stackoverflow.com/a/1589912/214325
		, markSelection = (function() {
			var
				markerTextChar = "\ufeff"
				, markerTextCharEntity = "&#xfeff;"
				, markerEl, markerId = "sel_" + new Date().getTime() + "_" + Math.random().toString().substr(2)
				, selectionEl
			;
		
			return function() {
				var sel, range;
		
				if (document.selection && document.selection.createRange) {
					// Clone the TextRange and collapse
					range = document.selection.createRange().duplicate();
					range.collapse(false);
		
					// Create the marker element containing a single invisible character by creating literal HTML and insert it
					range.pasteHTML('<span id="' + markerId + '" style="position: relative;">' + markerTextCharEntity + '</span>');
					markerEl = document.getElementById(markerId);
				} else if (window.getSelection) {
					sel = window.getSelection();
		
					if (sel.getRangeAt) {
						range = sel.getRangeAt(0).cloneRange();
					} else {
						// Older WebKit doesn't have getRangeAt
						range.setStart(sel.anchorNode, sel.anchorOffset);
						range.setEnd(sel.focusNode, sel.focusOffset);
		
						// Handle the case when the selection was selected backwards (from the end to the start in the
						// document)
						if (range.collapsed !== sel.isCollapsed) {
							range.setStart(sel.focusNode, sel.focusOffset);
							range.setEnd(sel.anchorNode, sel.anchorOffset);
						}
					}
		
					range.collapse(false);
		
					// Create the marker element containing a single invisible character using DOM methods and insert it
					markerEl = document.createElement("span");
					markerEl.id = markerId;
					markerEl.appendChild( document.createTextNode(markerTextChar) );
					range.insertNode(markerEl);
				}
		
				if (markerEl) {
					// Lazily create element to be placed next to the selection
					if (!selectionEl) {
						selectionEl = document.createElement("div");
						selectionEl.style.border = "solid darkblue 1px";
						selectionEl.style.backgroundColor = "lightgoldenrodyellow";
						selectionEl.innerHTML = "&lt;- selection";
						selectionEl.style.position = "absolute";
		
						document.body.appendChild(selectionEl);
					}
		
					// Find markerEl position http://www.quirksmode.org/js/findpos.html
				var obj = markerEl;
				var left = top = 0;
				do {
					left += obj.offsetLeft;
					top += obj.offsetTop;
				} while (obj = obj.offsetParent);
		
					// Move the button into place.
					// Substitute your jQuery stuff in here
					selectionEl.style.left = left + "px";
					selectionEl.style.top = top + "px";
		
					markerEl.parentNode.removeChild(markerEl);
				}
			};
		})()
	;
	
	function disableAwkwardAnimations() {
		window.timeout;

		$('html').addClass('resize-in-progress');
	
		clearTimeout(window.timeout);
		window.timeout = setTimeout(
			function()
			{
				$('html').removeClass('resize-in-progress');
			}
			, 250
		);
	}

	cssDetector.css('font-size', '50px');
	$('body').append(cssDetector);
	
	if($('#css-detector').css('font-size') == '50px') {
		cssEnabled = true;
	}

	if ( !Modernizr.csshyphens )
	{
		Hyphenator.config({
			classname: 'entry-content'
		});
		Hyphenator.run();
		//console.log('what');
	} // if
	
	var ps = $('<ol />');
	$('.entry-content').children('p[id]').each(function() {
		var
			p = $(this)
			, num = p.attr('id')
			, li = $('<li><a title="Paragraph ' + num + '" href="#' + num + '"><q>' + p.text().substr(0, 39) + '</q>…</a></li>')
		;
		
		ps.append(li);
	});
	//console.log(ps);
	
	window.HTMLOutline(document.body);
	$('h1, h2, h3, h4, h5, h6').each(function (){
		var
			heading = $(this),
			parent = heading.parent(),
			parentNodeName = parent.prop('nodeName').toLowerCase()
		;
		
		if (parentNodeName == 'hgroup') {
			heading.parent().attr({
				'role': 'heading',
				'aria-level': this.depth
			});
		} else {
			heading.attr('aria-level', this.depth);
		}
	});

	var outline = $(printOutline(document.body.sectionList));
	var main = outline.find('a[href="#main"]').parent('li');
	main.find('.h5o-notitle').remove();
	main.children('ol').prepend($('<li><a href="#article">Article Text</a></li>').append(ps));
	var ol = $('<ol />').append(main);
	
	$('.entry-content + footer > .content').prepend($('<nav id="toc"><hgroup><h2>Table of Contents</h2></hgroup></nav>').append(ol));

	$('a:not([href^="#"]), a[href="#"]').on('click', function (e) {
		e.preventDefault();
		$(this).attr('title', 'Mockup: link disabled');
	});
	
	$('a:not([href^="#"]), a[href="#"]').on('mouseout', function (e) {
		$(this).removeAttr('title');
	});
	/*function supportsAriaRole() {
		var el = document.createElement('span');
		return 'role' in el;
	}
	
	console.log(supportsAriaRole());*/

	/*if ( cssEnabled && Modernizr.cssmask )
	{
		$('hgroup[aria-level="2"] > :first-child, hgroup.decorative > :first-child')
			.each(function(){
				var
					heading = $(this)
					, clone = heading.clone()
					, container = $('<span role="img" aria-hidden="true" unselectable="on"></span>').on('selectstart', false);
				;
				
				clone.find('*').each(function() {
					$(this).attr('role', 'presentation');
				});
				
				heading.attr('class', 'fancyshadow').append(container.append(clone.contents()));

				/*.attr({
					'class': 'fancyshadow'
					, 'data-text': heading.text()
				})*
			})
		;
	} else {
		console.log('no');
	}*/
	
	//$(document).on('mouseup', markSelection);
	$(window).resize(disableAwkwardAnimations);
});