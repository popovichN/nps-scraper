var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');

var url = 'https://www.nps.gov/archeology/sites/antiquities/monumentslist.htm';
var fullList = [];
 
var headers = 'name	index';
for (var i = 1; i <= 10; i++) {
	headers = headers + '	' + 'action_' + i + '	' + 'date_' + i + '	' + 'president_congress_'  + i + '	' + 'acres_'  + i;
}
fs.writeFileSync('data.tsv', headers + '\n', 'utf8');

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

		//console.log(row, 'tr')
		$(this).find('h1').each(function() {
			//console.log($(this).text());
			var index_name = $(this).text().split('. ');
			var index = +index_name[0];
			var name = index_name[1].trim();
			//console.log(name)
			monument.name = name.replace(/(\r\n|\n|\r)/gm,"").replace(/\s+/g,' ').replace(/"/g, "'");
			monument.index = index;
		});

		//console.log(row, 'tr')
		$(this).find('table.myTable').each(function() {
			$(this).find('tr').each(function( index_row ) {
				var details = {};

				$(this).find('td').each(function( index_cell ){
					if (index_cell === 0) {
						details['action'] = $(this).text().trim().replace(/(\r\n|\n|\r)/gm,"").replace(/\s+/g,' ');
					}
					else if (index_cell === 1) {
						details['date'] = $(this).text().trim();
					}
					else if (index_cell === 2) {
						details['president_congress'] = $(this).text().trim();
					}
					else if (index_cell === 3) {
						details['acres'] = $(this).text().replace(/,/g, "").trim();
					}
				});

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
			"acres": "1350000"
		}]
	};
	var gold_butte = {
		"name": "Gold Butte",
		"index": 155,
		"details": [{
			"action": "Established",
			"date": "12/28/2016",
			"president_congress": "B. H. Obama",
			"acres": "296937"
		}]
	};

	fullList.push(bears_ears);
	fullList.push(gold_butte);

	fullList.forEach( function ( monument ) {
		var action_length = monument.details.length;
		var commify_actions = '';
		for (var i = 0; i < action_length; i++) {
			var action = monument.details[i];
			if (action_length === 1) {
				commify_actions = action.action  + '	' + action.date  + '	' + action.president_congress  + '	' + action.acres;
			}
			else {
				if (i === 0) {
					commify_actions = action.action  + '	' + action.date  + '	' + action.president_congress  + '	' + action.acres;
				} else {
					commify_actions = commify_actions + '	' + action.action  + '	' + action.date  + '	' + action.president_congress  + '	' + action.acres;
				}
			}			
		}
		var commaData = monument.name + '	' + monument.index + '	' + commify_actions + '\n'; 
	
		fs.appendFileSync('data.tsv', commaData, 'utf8', function (err) {
			if (err) {
				console.log("failed!");
			} else {
				console.log("success!");
			}
		});	

	});

});