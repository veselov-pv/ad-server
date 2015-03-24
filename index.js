var express = require('express');
var app = express();
var pg = require('pg');

app.set('port', (process.env.PORT || 5000));

/*app.get('/db', function (request, response) {
	pg.connect(process.env.DATABASE_URL, function (err, client, done) {
		client.query('SELECT * FROM ad_data_table', function (err, result) {
			done();
			if (err) {
				console.error(err);
				response.send("Error " + err);
			}
			else {
				response.send(result.rows);
			}
		});
	});
});*/

function formatAdData(sqlString) {
	return {
		'ads': JSON.parse(sqlString),
		'version': "v0.2.440",
		'session': {
			'si': 'kwlrkrxf',
			'beacons': {}
		}
	};
}
app.get('/ad-data', function (request, response) {
	pg.connect(process.env.DATABASE_URL, function (err, client, done) {
		client.query('SELECT * FROM ad_data_table', function (err, result) {
			done();
			if (err) {
				console.error(err);
				response.send(JSON.stringify({error: err}));
			} else {
				var formatedData = formatAdData(result.rows);
				response.send(JSON.stringify(formatedData));
			}
		});
	});
});

app.listen(app.get('port'), function () {
	console.log("Node app is running at localhost:" + app.get('port'))
});
