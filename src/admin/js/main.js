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

				var responseElement = document.createElement("p");
				responseElement.innerHTML = response.Name;
				console.log(response);
				$('#responses-container').append(responseElement);
			});
		}
	}).fail(function (jqXHR, textStatus, errorThrown) {
		console.log(jqXHR.responseJSON.message);
	});
});
