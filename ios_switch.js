// simulate iOS-like switch button
//
// author: vegetabird@gmail.com
//
// prerequiste: jQuery
//
// usage:
// <canvas class="ios_switch" cvalue="ON">
//	<div>ON</div>
//	<div>OFF</div>
// </canvas>
// in script:
// 	init_ios_switch();

var GLOBAL_BUTTON_WIDTH = 100;
var GLOBAL_BUTTON_HEIGHT = 30;
var GLOBAL_SLIDE_WIDTH = 40;
var GLOBAL_RADIUS = 5;

//$(init_ios_switch);

function init_ios_switch(){
	$("canvas.ios_switch").each(function(){
		$(this).css("cursor", "pointer");
		var cv = $(this)[0];
		//console.log($(this).attr("left_text"));
		//console.log($(this).attr("right_text"));
		var start_left = 0;
		if($(this).attr("cvalue") == $(this).find("div").first().text()){
			start_left = 0;
		}else{
			start_left = -(GLOBAL_BUTTON_WIDTH - GLOBAL_SLIDE_WIDTH);
		}
		render_ios_switch(cv, start_left);
		$(this).click(function(){
			if($(this).attr("sliding") != "true"){
				$(this).attr("sliding", "true");
				var slide_to_left = true;
				var from_left = 0;
				var to_left = (GLOBAL_BUTTON_WIDTH - GLOBAL_SLIDE_WIDTH);
				if($(this).attr("cvalue") == $(this).find("div").first().text()){
					slide_to_left = true;
					//console.log("slide from right to left");
				}else{
					slide_to_left = false;
					//console.log("slide from left to right");
				}
				//console.log(slide_to_left);
				var current_switch = $(this);
				$("div").css("left", from_left + "px").animate({
					left: to_left
				}, {
					duration: 500,
					step: function(now){
						var current_left = 0;
						if(slide_to_left){
							//console.log("slide to left");
							current_left = -now;
						}else{
							//console.log("slide to right");
							current_left = - (GLOBAL_BUTTON_WIDTH - GLOBAL_SLIDE_WIDTH) + now;
						}
						//console.log(current_left);
						//console.log(now);
						redraw_ios_switch(current_switch[0], current_left);
					},
					complete: function(){
						//console.log("complete");
						current_switch.attr("sliding", "false");
						if(slide_to_left){
							//console.log("complete: slide to left");
							current_switch.attr("cvalue", current_switch.find("div").last().text());
						}else{
							//console.log("complete: slide to right");
							current_switch.attr("cvalue", current_switch.find("div").first().text());
						}
					}
				});
			}
		});
	});
}

function slide_tick(){
	current_offset_left += current_slide_speed;
	window.setTimeout("slide_tick()", 100);
}

function render_ios_switch(cv, current_left){
	console.log("render ios switch");
	$(cv).attr("width", "" + GLOBAL_BUTTON_WIDTH);
	$(cv).attr("height", "" + GLOBAL_BUTTON_HEIGHT);
	redraw_ios_switch(cv, current_left);
}

function redraw_ios_switch(cv, current_left){
	var c = cv.getContext("2d");
	draw_background(c);
	c.save();
	c.translate(current_left, 0);
	draw_text(c, $(cv).find("div").first().text());
	c.translate(GLOBAL_BUTTON_WIDTH - GLOBAL_SLIDE_WIDTH, 0);
	draw_slide(c);
	c.translate(GLOBAL_SLIDE_WIDTH, 0);
	draw_text(c, $(cv).find("div").last().text());
	c.restore();
}

function draw_text(c, text){
	c.save();
	c.text
	c.textAlign = "center";
	c.textBaseline = "middle";
	c.font = "bold 20px sans-serif";
	c.fillStyle = "#FFF";
	c.fillText(text, (GLOBAL_BUTTON_WIDTH - GLOBAL_SLIDE_WIDTH) /2, GLOBAL_BUTTON_HEIGHT / 2);
	c.restore();
}

function draw_slide(c){
	c.save();
	c.fillStyle = "#CCC";
	draw_round_rect(c, 0, 0, GLOBAL_SLIDE_WIDTH, GLOBAL_BUTTON_HEIGHT, GLOBAL_RADIUS);
	c.strokeStyle = "#555";
	c.lineWidth = 1;
	c.strokeRect(GLOBAL_SLIDE_WIDTH / 2 - 2, 5, 4, GLOBAL_BUTTON_HEIGHT - 10);
	c.restore();
}

function draw_background(c){
	c.save();
	c.fillStyle = "#0180eb";
	draw_round_rect(c, 0, 0, GLOBAL_BUTTON_WIDTH, GLOBAL_BUTTON_HEIGHT, GLOBAL_RADIUS);
	c.restore();
}

function draw_round_rect(c, left, top , width, height, r){
	c.save();
	c.beginPath();
	c.moveTo(left + r, top);
	c.lineTo(left + width - r, top);
	c.arc(left + width - r, top + r, r, rads(-90), rads(0), false);
	c.lineTo(left + width, top + height - r);
	c.arc(left + width - r, top + height - r, r, rads(0), rads(90), false);
	c.lineTo(left + r, top + height);
	c.arc(left + r, top + height - r, r, rads(90), rads(180), false);
	c.lineTo(left, top + r);
	c.arc(left + r, top + r, r, rads(180), rads(270), false);
	c.fill();
	c.closePath();
	c.restore();
}

function rads(x){
	return Math.PI * x / 180;
}
