/*!
 * Copyright 2013 Justinmind. All rights reserved.
 */

(function (window, undefined) {

  /*********************** START DROPDOWN METHODS ************************/
  var $dropdown, initialInputValue;

  function checkExternalClick(event, data) {
	var $target = $(event.target || event.srcElement);
	if($target.closest(".jim-web-dd").length == 0) {
		if(jQuery(".jim-web-dd").is(':visible')) {
			jQuery(".jim-web-dd").stop().hide({duration: 300, effect: "slide", direction: "up"});
		}
		jQuery(".jim-web-dd").get(0).style.removeProperty('height');
		unbindClickEvents();
		var value = $dropdown.children(".valign").children(".value").text();
		if(initialInputValue!==value) {
			$dropdown.closest(".firer").trigger("change");
		}
	}
  }
  function loadDropDown() {
  	if(jQuery(".jim-web-dd").is(':visible')) {
  		jQuery(".jim-web-dd").stop().hide({duration: 300, effect: "slide", direction: "up"});
  		unbindClickEvents();
  		return false;
  	}
  	else {
  		unloadDropDown();
  		unbindClickEvents();
  		createDropDown($dropdown);
  		fillDropDownOptions($dropdown);
		bindClickEvents();
		bindDropDown($dropdown);
		var position = getCurrentPosition($dropdown),
			height = parseInt($dropdown.css("height"));
		jQuery(".jim-web-dd").css("top", position.y + (parseInt($dropdown.css("height")) + 10) + "px");
		jQuery(".jim-web-dd").css("left", position.x + "px");
		jQuery(".jim-web-dd").css("width", parseInt($dropdown.css("width")) + "px");
		jQuery(".jim-web-dd").stop().hide().show({duration: 300, effect: "slide", direction: "up"});
		jQuery(".jim-web-dd").trigger("openedDD");
  	}
  }
  function unloadDropDown() {
	jQuery(".jim-web-dd").off();
	jQuery(".jim-web-dd").remove();
	jQuery(".simulation").undelegate(".dropdown:not([readonly])", "click");
  }
  
  /*********************** END DROPDOWN METHODS ************************/

  jQuery("#simulation")
  .on("mousedown", ".dropdown-options", function(event) {    
    var $dd = jQuery(event.target || event.srcElement).closest(".dropdown, .nativedropdown");
    if(jimUtil.isAlternateModeActive() || !($dd.length && typeof($dd.attr("readonly")) === "undefined")) {
      return false;
    }
    if(jimUtil.isMobileDevice())
    	return;
    else if(jimDevice.isIOS() || jimDevice.isAndroid() || jimDevice.isAndroidNamed())
    	return false;
    else {
    	$dropdown = jQuery(event.target || event.srcElement).closest(".dropdown");
    	if($dropdown.length) {
    		loadDropDown();
    		event.stopPropagation();
    		return false;
    	}
    }
  })
  .on("change", ".dropdown-options", function(event) {
	var $parent = jQuery(this).parent();
	var value = this.value;
	for (var intLoop = 0; intLoop < this.length; intLoop++) {
        if(this[intLoop].selected) {
            value = this[intLoop].value;
        }
    }
    $parent.find(".value").text(value);
  })
  
  /*********************** START DROPDOWN METHODS ************************/
	
	function createDropDown(element) {
		var newId = jQuery(element).attr("id");
		newId = newId.replace(/^r[0-9]*_/, "");
		var html = '<div class="jim-web-dd ' + newId + '" onselectstart="return false;"><div class="dd_content" class="scrollable"><div class="dd_options"></div></div></div>';
		jQuery(element).closest(".screen,.template,.master").append(html);
	}
	
	function bindDropDown(element) {
		jQuery(".jim-web-dd").on("mouseup", function(event, data) {
			if (event.target.tagName === "DIV") {
				var key = event.target.className;
				if(key === "")
					key = event.target.id;
				if(key) {
					if(key.indexOf(" ")>0)
						key = key.substring(0, key.indexOf(" "));
					switch(key) {
						case "options":
							jQuery(".jim-web-dd .dd_options .selected").removeClass("selected");
							setDropDrownValue($dropdown);
							var value = $target.text();
							if(initialInputValue!==value) {
								$dropdown.closest(".firer").trigger("change");
								initialInputValue = value;
							}
							jQuery(".jim-web-dd").hide();
							jQuery(".jim-web-dd").get(0).style.removeProperty('height');
							break;
						default:
							break;
					}
				}
			}
		});
		
		jQuery(".jim-web-dd").on("mousedown", function(event, data) {
			if (event.target.tagName === "DIV") {
				var key = event.target.className;
				if(key.indexOf(" ")>0)
					key = key.substring(0, key.indexOf(" "));
				switch(key) {
					case "options":
						$target = jQuery(event.target).closest(".options"),
						$currentPressed = jQuery(".jim-web-dd .dd_options .selected");
						jQuery(".jim-web-dd .dd_options .pressed").removeClass("pressed");
						$target.parent().removeClass("pressed").addClass("pressed");
						break;
					default:
						break;
				}
				event.preventDefault();
			}
		});
		jQuery(".jim-web-dd").on("openedDD", function(event) {
			var $dropDiv = jQuery(".jim-web-dd");
			var $mainDiv = jQuery("body").is(".web") ? jQuery("#jim-web") : jQuery("#jim-mobile");
			var $dropContentDiv = jQuery(".jim-web-dd .dd_content");
			$dropContentDiv.get(0).style.removeProperty('position');
			//control height overflow
			var deviceHeight = parseInt($mainDiv.css("height"));
			var ddRemainingHeight = deviceHeight - parseInt(jQuery(".jim-web-dd").css("top")) - 10;
			var ddCurrentHeight = $dropDiv.get(0).clientHeight;
			if(ddCurrentHeight>deviceHeight){
				var currentTop = parseInt($dropDiv.css("top"));
				$dropDiv.css("top",currentTop - parseInt(jQuery(".jim-web-dd").css("top"))+20 +"px");
				$dropDiv.css("height",(deviceHeight-40)+"px");
				$dropContentDiv.css("position","absolute");
			}
			else if(ddCurrentHeight>ddRemainingHeight){
				var currentTop = parseInt($dropDiv.css("top"));
				var overflowHeight = ddCurrentHeight - ddRemainingHeight;
				$dropDiv.css("top",currentTop - overflowHeight + "px");
				$dropDiv.get(0).style.removeProperty('height');
			}
			
			//control width overflow
			var deviceWidth = parseInt($mainDiv.css("width"));
			var ddRemainingWidth = deviceWidth - parseInt(jQuery(".jim-web-dd").css("left"));
			var ddCurrentWidth = $dropDiv.get(0).clientWidth;
			var currentLeft = parseInt($dropDiv.css("left"));
			if(currentLeft<0)
				$dropDiv.css("left",0 + "px");
			if(ddCurrentWidth>ddRemainingWidth){
				var overflowWidth = ddCurrentWidth - ddRemainingWidth;
				$dropDiv.css("left",currentLeft - overflowWidth + "px");
			}
		});
	}
	
	function fillDropDownOptions($target) {
		var type = $target.jimGetType();
		jQuery(".jim-web-dd .dd_options >").remove();
		switch(type) {
			case itemType.dropdown:
				var html = "";
				$holder = jQuery("#"+$target.attr("id"));
	            $options = $holder.find(".option");
	            ddSize = $options.length;
	            defaultValue = $target.find(".valign").children(".value").text();
	            var newOption;
	            var newStyle = "color:" + $target.css('color') + "; font-family:" + $target.css('font-family') + "; font-size:" + $target.css('font-size') + 
	            		"; font-style:" + $target.css('font-style') + "; font-weight:" + $target.css('font-weight') + "; text-decoration:" + $target.css('text-decoration');
	            		
	            for(i=0, iLen=ddSize; i<iLen; i+=1) {
	            	newOption = "<div class='line_options"; 

	            	if(defaultValue === jQuery($options[i]).text()) {
	            		selectedPos = i;
	            		newOption += " selected'><div class='options' style='" + newStyle + "'>" + jQuery($options[i]).text() + "</div></div>";
	            	}
	            	else {
	            		newOption += "'><div class='options' style='" + newStyle + "'>" + jQuery($options[i]).text() + "</div></div>";
	            	}
	            	html += newOption;
	            }
	            
	            var $colorLayer = $holder.children(".backgroundLayer").children(".colorLayer");
	            var targetBackground = $colorLayer.css("background-color");
				if(targetBackground !== undefined)
					jQuery(".jim-web-dd .dd_content").css("background-color", targetBackground);
				
				var $optionsDiv = jQuery(".jim-web-dd .dd_options");
				$optionsDiv.append(html);
				break;
		}
	}
	
	function setDropDrownValue($target) {
		var type = $target.jimGetType();
		switch(type) {
			case itemType.dropdown:
				$options = $target.children(".dropdown-options").children(".option").removeClass("selected").removeAttr("selected");
				var value = jQuery(".jim-web-dd .dd_options .line_options.pressed .options").text();
				for(o=0, oLen=$options.length; o<oLen; o+=1) {
				  option = $options[o];
				  if(option.textContent === value || option.innerText === value) {
				    jQuery(option).addClass("selected");
				    jQuery(option).attr("selected","selected");
				    $target.find(".value").html(jimUtil.toHTML(value));
				    return false;
				  }
				}
				break;
		}
	}
	
	/*********************** END DROPDOWN METHODS ************************/
  
  
  	/*********************** START STATIC ACCESS METHODS ************************/
	
	function bindClickEvents() {
		$("#jim-web").on("mousedown",checkExternalClick);
		$("#simulation").on("mousedown",checkExternalClick);
	}
	
	function unbindClickEvents() {
		$("#jim-web").off("mousedown",checkExternalClick);
		$("#simulation").off("mousedown",checkExternalClick);
	}
	
	function getCurrentPosition(element) {
		return {"x": element.jimPosition().left, "y": element.jimPosition().top };
	}
	
	/*********************** END STATIC ACCESS METHODS ************************/
	
  
})(window);