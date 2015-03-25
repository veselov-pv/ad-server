var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000));

function getData(){
	return {
		'ads': [
			{
				"click_url":"http://spherical-cow.herokuapp.com/click",
				"image_url":"http://spherical-cow.herokuapp.com/images/image1.jpg",
				"ad_like":"http://spherical-cow.herokuapp.com/ad_like",
				"ad_dislike":"http://spherical-cow.herokuapp.com/ad_dislike",
				"ad_hide":"http://spherical-cow.herokuapp.com/ad_hide",
				"ad_share":"http://spherical-cow.herokuapp.com/ad_share",
				"inbox_open":"http://spherical-cow.herokuapp.com/inbox_open"
			}
		],
		'version': "v0.2.440",
		'session': {
			'si': 'kwlrkrxf',
			'beacons': {}
		}
	};
}

app.get('/data', function (request, response) {
	response.send(JSON.stringify(getData()));
});

app.use('/images', express.static('images'));

app.use('/service-img', express.static('service-img'));

app.use('/app', express.static('ad-site'));

app.listen(app.get('port'), function () {
	console.log("Node app is running at localhost:" + app.get('port'))
});
