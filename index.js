var express = require('express'),
	cors = require('cors');
	app = express();

app.use(cors());

app.set('port', (process.env.PORT || 5000));

function getData(){
	return {
		'ads': [
			{
				"click_url":"https://spherical-cow.herokuapp.com/click",
				"image_url":"https://spherical-cow.herokuapp.com/images/image1.jpg",
				"ad_like":"https://spherical-cow.herokuapp.com/ad_like",
				"ad_dislike":"https://spherical-cow.herokuapp.com/ad_dislike",
				"ad_hide":"https://spherical-cow.herokuapp.com/ad_hide",
				"ad_share":"https://spherical-cow.herokuapp.com/ad_share",
				"inbox_open":"https://spherical-cow.herokuapp.com/inbox_open"
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

['/click', '/ad_like', '/ad_dislike', '/ad_hide', '/ad_share', '/inbox_open'].forEach(function(url){
	app.get(url, function (request, response) {
		response.sendStatus(200);
	});
});

app.use('/images', express.static('images'));

app.use('/app', express.static('ad-site'));

app.listen(app.get('port'), function () {
	console.log("Node app is running at localhost:" + app.get('port'))
});
