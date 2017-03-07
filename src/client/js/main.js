/*
Title: Main JS File
Theme Name: Wedding
Author Name: FairyTheme
Author URI: http://themeforest.net/user/fairytheme
====================*/
/*
Table of Contents:
------------------
1. Loader
2. Page scrolling
3. Countdown
4. OWL Gallery
5. Form
6. Select arrow
7. Map
8. Gifts list
9. Blog
10. Youtube video BG

/* 1. Loader
====================*/
'use strict';
$(window).on('load', function() {
	$('.loader').delay(600).fadeOut('slow');
	imgIntoBg();
});
//jQuery to collapse the navbar on scroll
var newNav = $('nav.clone');
$(window).on('scroll', function() {
	if ($(this).scrollTop() > 350) {
		newNav.removeClass('unstick').addClass('stick');
	} else {
		newNav.removeClass('stick').addClass('unstick');
	}
});
if ($('.wedding-date').length != 0){
	$('.wedding-date').arctext({radius: 360});
}
/* 2. Page scrolling
=====================*/
//jQuery for page scrolling feature - requires jQuery Easing plugin
$(function() {
	$('a.page-scroll').on('click', function(event) {
		var $anchor = $(this);
		$('html, body').stop().animate({
			scrollTop: $($anchor.attr('href')).offset().top-76
		}, 1500, 'easeInOutExpo');
		event.preventDefault();
		$('.navbar-collapse.in').collapse('hide');
	});
});
/* 3. Countdown
=======================*/
var countdown = document.querySelector('.countdown');
function getTimeRemaining(endtime) {
	var t = Date.parse(endtime) - Date.parse(new Date());
	var seconds = Math.floor((t / 1000) % 60);
	var minutes = Math.floor((t / 1000 / 60) % 60);
	var hours = Math.floor((t / (1000 * 60 * 60)) % 24);
	var days = Math.floor(t / (1000 * 60 * 60 * 24));
	return {
		'total': t,
		'days': days,
		'hours': hours,
		'minutes': minutes,
		'seconds': seconds
	};
}

function initializeClock(id, endtime) {
	var clock = document.getElementById(id);
	var daysSpan = clock.querySelector('.days');
	var hoursSpan = clock.querySelector('.hours');
	var minutesSpan = clock.querySelector('.minutes');
	var secondsSpan = clock.querySelector('.seconds');
	var newChild;

	function updateClock() {
		var t = getTimeRemaining(endtime);
		var daysArr = String(t.days).split('');
		daysSpan.innerHTML = '';
		for (var i = 0; i < daysArr.length; i++){
			newChild = document.createElement('span');
			newChild.innerHTML = daysArr[i];
			daysSpan.appendChild(newChild);
		}
		var hoursArr = String(('0' + t.hours).slice(-2)).split('');
		hoursSpan.innerHTML = '';
		for (var i = 0; i < hoursArr.length; i++) {
			newChild = document.createElement('span');
			newChild.innerHTML = hoursArr[i];
			hoursSpan.appendChild(newChild);
		}
		var minuteArr = String(('0' + t.minutes).slice(-2)).split('');
		minutesSpan.innerHTML = '';
		for (var i = 0; i < minuteArr.length; i++) {
			newChild = document.createElement('span');
			newChild.innerHTML = minuteArr[i];
			minutesSpan.appendChild(newChild);
		}
		var secondArr = String(('0' + t.seconds).slice(-2)).split('');
		secondsSpan.innerHTML = '';
		for (var i = 0; i < secondArr.length; i++) {
			newChild = document.createElement('span');
			newChild.innerHTML = secondArr[i];
			secondsSpan.appendChild(newChild);
		}
		if (t.total <= 0) {
			clearInterval(timeinterval);
		}
	}
	updateClock();
	var timeinterval = setInterval(updateClock, 1000);
}
// set your wedding date here
var deadline = 'December 17 2017 17:30:00 GMT+0300';
if (countdown){
	initializeClock('timer', deadline);
}
/* 4. Owl Gallery
==================================*/
var mainCarousel = document.querySelector('.main-carousel');
var galleryCarousel = document.querySelector('.gallery-carousel');
function imgIntoBg() {
	$(".img-into-bg").each(function(b, c) {
		var thisImg = $(this);
		thisImg.parent().css("background-image", 'url("' + thisImg.attr("src") + '")'), thisImg.remove()
	})
}
if(mainCarousel) {
	$(mainCarousel).owlCarousel({
		loop:true,
		autoplay:true,
		responsiveClass:true,
		nav:true,
		margin:0,
		navText: [],
		responsive:{
			0:{
				items:1
			}
		}
	});
}
if(galleryCarousel) {
	$(galleryCarousel).owlCarousel({
		loop:true,
		autoplay:true,
		responsiveClass:true,
		nav:true,
		margin:2,
		responsive:{
			0:{
				items:1
			},
			600:{
				items:3
			},
		}
	});
}

/* 5. Form
===================================*/
$('#rsvp-button').click(function() {
	// remove the error class
	$('.form-group').removeClass('has-error');
	$('.help-block').remove();

	if ($("#attending option:selected").val() !== "Yes" && $("#attending option:selected").val() !== "No") {
		alert("Please select an option from the dropdown");
	}

	// get the form data
	var formData = {
		'name' : $('input[name="form-name"]').val(),
		'numGuests' : $('input[name="form-number-guests"]').val(),
		'isAttending' : $("#attending option:selected").val() === "Yes",
		'weddingCode' : $('input[name="form-wedding-code"]').val()
	};
	// process the form
	$.ajax({
		type : 'POST',
		url  : 'http://localhost:8080/rsvp',
		data : formData,
		dataType : 'json',
		encode : true
	}).done(function (data) {
		// handle errors
		if (!data.success) {
			if (data.errors.name) {
				$('#name-field').addClass('has-error');
				$('#name-field').find('.col-sm-6').append('<span class="help-block">' + data.errors.name + '</span>');
			}
			if (data.errors.email) {
				$('#email-field').addClass('has-error');
				$('#email-field').find('.col-sm-6').append('<span class="help-block">' + data.errors.email + '</span>');
			}
			if (data.errors.number) {
				$('#number-field').addClass('has-error');
				$('#number-field').find('.col-sm-6').append('<span class="help-block">' + data.errors.subject + '</span>');
			}
		} else {
			// display success message
			$form.html('<div class="message-success">' + data.message + '</div>');
		}
	}).fail(function (data) {
		// for debug
		// console.log(data);
	});
});

/* 6. Select arrow
=======================================*/
$(document).on('click', function(event) {
	if ($(event.target).closest('.select-wrap').length)
		return;
	$('.select-wrap').removeClass('active');
	event.stopPropagation();
});
$('.select-wrap').on('click', 'select', function() {
	$('.select-wrap').toggleClass('active');
	return false;
});
/* 7. Map
=========================================*/
var map;
function initMap() {
	map = new google.maps.Map(document.getElementById('map_canvas'), {
		center: {lat: 40.89, lng: -73.98},
		zoom: 13,
		scrollwheel: false,
		mapTypeControl: false
	});
	var image = 'img/point.png';
	var beachMarker = new google.maps.Marker({
		position: {lat: 40.89, lng: -73.98},
		map: map,
		icon: image
	});
}
/* 8. Gifts list
==========================================*/
$(function () {
	$('.list-group.checked-list-box .list-group-item').each(function () {
		// Settings
		var $widget = $(this),
			$checkbox = $('<input type="checkbox" class="hidden" />'),
			color = ($widget.data('color') ? $widget.data('color') : "primary"),
			style = ($widget.data('style') == "button" ? "btn-" : "list-group-item-"),
			settings = {
				on: {
					icon: 'glyphicon glyphicon-check'
				},
				off: {
					icon: 'glyphicon glyphicon-unchecked'
				}
			};
		$widget.css('cursor', 'pointer')
		$widget.append($checkbox);
		// Event Handlers
		$widget.on('click', function () {
			$checkbox.prop('checked', !$checkbox.is(':checked'));
			$checkbox.triggerHandler('change');
			updateDisplay();
		});
		$checkbox.on('change', function () {
			updateDisplay();
		});
		// Actions
		function updateDisplay() {
			var isChecked = $checkbox.is(':checked');
			// Set the button's state
			$widget.data('state', (isChecked) ? "on" : "off");
			// Set the button's icon
			$widget.find('.state-icon')
				.removeClass()
				.addClass('state-icon ' + settings[$widget.data('state')].icon);
			// Update the button's color
			if (isChecked) {
				$widget.addClass(style + color + ' active');
			} else {
				$widget.removeClass(style + color + ' active');
			}
		}
		// Initialization
		function init() {
			if ($widget.data('checked') == true) {
				$checkbox.prop('checked', !$checkbox.is(':checked'));
			}
			updateDisplay();
			// Inject the icon if applicable
			if ($widget.find('.state-icon').length == 0) {
				$widget.prepend('<span class="state-icon ' + settings[$widget.data('state')].icon + '"></span>');
			}
		}
		init();
	});
});

/* 9. Blog
==========================================*/

var blog = document.querySelector('.blog');

if (blog) {
	jQuery(".article-thumb").each(function(){
		var articleImg = $(this).find('img');
		$(this).css({
			'background-image': 'url('+articleImg.attr('src')+')'
		});
	});
	jQuery("p.entry").each(function(){
		var review = jQuery(this).html();
		if( review.length > 200)
		{
			review = review.substring(0, 200);
			jQuery(this).html( review + '<span class="read_more">...</span>' );
		}
	});
}
/* 10. Youtube video BG
==========================================*/
$(window).on('load', function() {
	if ($('div').is($('#background-video'))) {
		$('#background-video').YTPlayer({
			fitToBackground: true,
			videoId: 'fKiFfHkDAKg',
			playerVars: {
				start: 12
			}
		});
	}
});
