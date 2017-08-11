var selectBox = $("<select />");
var nav = $('nav[role="navigation"]');
var links = nav.children('ul');

function respawnd() {
	if (matchMedia("only screen and (max-width: 767px)").matches) {
		// Based on: <http://css-tricks.com/13303-convert-menu-to-dropdown/>
		// Create the dropdown base			
		if(nav.children('select').length == 0) {
			selectBox.appendTo("nav[role='navigation']");
		}
		//$('nav[role="navigation"] ul').hide();
		links.remove();
	} else {
		//$('nav[role="navigation"] select').remove();
		$('nav[role="navigation"] select').remove();
		nav.append(links);
		//$('nav[role="navigation"] ul').show();
		
	}
}

// Populate dropdown with menu items
$("nav[role='navigation'] > ul > li > a").each(function() {
	var el = $(this);
	
	var submenu = el.siblings('ul');
	
	if(submenu.length > 0) {
		var optgroup = $('<optgroup label="' + el.text() + '" />');
		var title = el.attr('title');
		
		if(typeof title !== 'undefined' && title !== false) {
			var text = title;
		} else {
			var text = el.text();
		}
		
		$("<option />", {
			"value"   : el.attr("href"),
			"text"    : text
		}).appendTo(optgroup);	
		
		submenu.find('a').each(function() {
			var a = $(this);
			//console.log(a);
			$("<option />", {
				"value"   : a.attr("href"),
				'title'   : a.attr('title'),
				"text"    : a.text()
			}).appendTo(optgroup);
		});
		
		optgroup.appendTo(selectBox);
	} else {
		$("<option />", {
			"value"   : el.attr("href"),
			'title'   : el.attr('title'),
			"text"    : el.text()
		}).appendTo(selectBox);
	}
});

$("nav[role='navigation'] select").live('change', function() {
	window.location = $(this).find("option:selected").val();
});

respawnd();
$(window).resize(respawnd);