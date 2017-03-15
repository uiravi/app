/*
Plugin Name: Tooltip
Dependency: JavaScript, jQuery, CSS 3.0
Complete Reference on: https://github.com/uiravi/Tooltip

Developer: Ravi Shankar kumar
Website: http://uiravi.com
*/


function Tooltip(option){
	// Private Variables
	var $elm = option.elm, //on hover element would come here
		$tooltip_container = this, //for adding tooltip container on runtime
		top = option.tooltipPosition === "top" || "top", //if "tooltipPosition" is not in instance then "top" would be default
		right = option.tooltipPosition === "right" || false, //if "tooltipPosition" is "right"  
		bottom = option.tooltipPosition === "bottom" || false, //if "tooltipPosition" is "bottom"
		left = option.tooltipPosition === "left" || false; //if "tooltipPosition" is "left"

	// == Public Functions == //
	this.tooltip = function(){

		var $tpContainer = $("<div class='tooltip transition-hide'></div>").appendTo('body'); //Adding Tooltip Container on runtime
			offset = $(this).offset(),
			tpWidth = $(this).width(),
			$tooltip_container = $tpContainer;

		$tpContainer
		.html($(this).attr('data')) // Getting attribute for tolltip data (Could change as per requirment)
		.addClass("transition-show"); //Adding this class for show hide and animation (Could change as per requirment)
		
		if(right){
			$tpContainer
			.addClass("tooltip-right")
			.css({
				"left":offset.left + tpWidth + 20,
				"top":offset.top - ($tpContainer.height() - $tpContainer.height() / 2)
			});

		}else if(left){
			$tpContainer
				.addClass("tooltip-left")
				.css({
				"left":offset.left - ($tpContainer.width() + 48),
				"top":offset.top - ($tpContainer.height() - $tpContainer.height() / 2)
			});

		}else if(bottom){
			$tpContainer
				.addClass("tooltip-bottom")
				.css({
				"left":offset.left + (tpWidth / 2) - ($tpContainer.width() / 2) - 15,
				"top":offset.top + 40
			});

		}else if(top){
			$tpContainer
				.addClass("tooltip-top")
				.css({
				"left":offset.left + (tpWidth / 2) - ($tpContainer.width() / 2) - 15,
				"top":offset.top - ($tpContainer.height() + 40)
			});
		};
	};

	// Init
	(function(instance){
		//Event Binding
		$elm.on("mouseenter", instance.tooltip);
		$elm.on("mouseleave", function(){
			//Removing element on mouse out.
			$tooltip_container.remove();
		});
	})(this);
};

// Creating Instance of the Tooltip
var tooltip = new Tooltip({
	tooltipPosition: "top", //set tooltip position "top, left, right, bottom" (Default is top if nothing here) {remove full line "tooltipPosition: 'top'," if you want default}
	elm: $(".tp") //Add classname for tooltip
});

// Creating Instance of the Tooltip
var tooltip1 = new Tooltip({
	tooltipPosition: "right", //set tooltip position "top, left, right, bottom" (Default is top if nothing here) {remove full line "tooltipPosition: 'top'," if you want default}
	elm: $(".tp1") //Add classname for tooltip
});



