// $.ajax({
	// 	type : 'POST',
	// 	url  : 'http://localhost:8080/rsvp',
	// 	headers: {'Content-Type': 'application/json'},
	// 	data : formData,
	// 	processData: false

$(window).on('load', function() {
	$.get({
		url  : 'http://localhost:8080/rsvps',
		dataType: 'json'
	}).done(function (data) {
		// handle errors
		if (!data.responses) {
			
		} else {
			data.responses.forEach(function(response) {

				// var responseElement = document.createElement("p");
				// responseElement.innerHTML = response.Name;
				// console.log(response);
				console.log(createResponseElement(response));
				var responseElement = createResponseElement(response);
				$('#responses-container').append(responseElement);

			});
		}
	}).fail(function (jqXHR, textStatus, errorThrown) {
		console.log(jqXHR.responseJSON.message);
	});

	$.get({
		url:	'http://localhost:8080/songs',
		dataType: 'json'
	}).done(function (data) {
		// handle errors
		if (!data.responses) {

		} else {
			data.responses.forEach(function(response) {
				var songElement = createSongElement(response);
				$('#song-responses-container').append(songElement);
			});
		}
	}).fail(function (jqXHR, textStatus, errorThrown) {
		console.log(jqXHR.responseJSON.message);
	});
});

// returns the html string for an rsvp response
function createResponseElement(response) {
	var iconHtml;
	if (response.IsAttending) {
		iconHtml = [
			'<div class="attending-number-container attending">',
				'<div class="attending-number">',
					response.NumGuests,
				'</div>',
			'</div>'
		].join(' ');
	} else {
		iconHtml = [
			'<div class="attending-icon-container">',
				'<i class="glyphicon glyphicon-remove circle-icon not-attending"></i>',
			'</div>'
		].join(' ');
	}

	var html = [
		'<div class="response-container">',
			iconHtml,
			'<span class="guest-name">',
				response.Name,
			'</span>',
		'</div>'
	];

	return html.join(" ");
}

// returns the html string for a song
function createSongElement(song) {
	var html = [
		'<div class="response-container">',
			'<span class="song-title">',
				song.Song,
			'</span>',
		'</div>'
	];

	return html.join(' ');
}