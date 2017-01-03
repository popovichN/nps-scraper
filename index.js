var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');

var url = 'https://www.nps.gov/archeology/sites/antiquities/monumentslist.htm';
var fullList = [];

request(url, function (err, resp, body) {

	if (err)
        throw err;
    $ = cheerio.load(body);
    //console.log(body);

	$('.midBg div').each(function( row ) {
		var monument = {
			"name": null,
			"index": null,
			"details": []
		};

		$(this).find('h1').each(function() {
			var index_name = $(this).text().split('. ');
			var index = +index_name[0];
			var name = index_name[1].trim();
			//console.log(name)
			monument.name = name;
			monument.index = index;
		});

		//console.log(row, 'tr')
		$(this).find('table.myTable').each(function() {
			$(this).find('tr').each(function( index_row ) {
				var details = {};

				$(this).find('td').each(function( index_cell ){
					if (index_cell === 0) {
						details['action'] = $(this).text().trim();
					}
					else if (index_cell === 1) {
						details['date'] = $(this).text().trim();
					}
					else if (index_cell === 2) {
						details['president_congress'] = $(this).text().trim();
					}
					else if (index_cell === 3) {
						details['acres'] = $(this).text().trim();
					}
				})

				monument.details.push( details );
			});
		});

	   	fullList.push(monument);
	});

	//add missing monuments
	var bears_ears = {
		"name": "Bears Ears",
		"index": 154,
		"details": [{
			"action": "Established",
			"date": "12/28/2016",
			"president_congress": "B. H. Obama",
			"acres": "1,350,000"
		}]
	};
	var gold_butte = {
		"name": "Gold Butte",
		"index": 155,
		"details": [{
			"action": "Established",
			"date": "12/28/2016",
			"president_congress": "B. H. Obama",
			"acres": "296,937"
		}]
	};

	fullList.push(bears_ears);
	fullList.push(gold_butte);


	//console.log(fullList)
	fs.writeFileSync('data.json', JSON.stringify(fullList), 'utf8', function (err) {
		if (err) {
			console.log("failed!");
		} else {
			console.log("success!");
		}
	});
});