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


			$(this).find('td').each(function ( td_index ) {
				if(td_index === 3) {
					monument.size_type = $(this).text().trim().replace(' Affected', '');
				}

			});
				
			$(this).find('tr').each(function( index_row ) {

				//console.log(index_row, $(this).text().trim())
				var details = {};

				$(this).find('td').each(function( index_cell ){
					if (index_cell === 0) {
						details['action'] = $(this).text().trim();
					}
					else if (index_cell === 1) {
						details['date'] = $(this).text().trim();
					}
					else if (index_cell === 2) {
						var founder = $(this).text().trim();

						//fix name discrepancies
						if(founder === 'F.D. Roosevelt') {
							founder = 'F. Roosevelt';
						}
						if (founder === 'B.H. Obama') {
							founder = 'B. H. Obama'
						}

						details['president_congress'] = founder;

					}
					else if (index_cell === 3) {
						details['size_num'] = $(this).text().replace(/,/g, "").replace(/,/g, "").trim();
					}
				});

				monument.details.push( details );
			});
		});

	   	fullList.push(monument);
	});

	//add missing monuments
	var new_monuments = [
		{
			"name": "Bears Ears",
			"index": 154,
			"details": [{
				"action": "Established",
				"date": "12/28/2016",
				"president_congress": "B. H. Obama",
				"acres": "1350000"
			}],
			"size_type": "Acres"
		},
		{
			"name": "Gold Butte",
			"index": 155,
			"details": [{
				"action": "Established",
				"date": "12/28/2016",
				"president_congress": "B. H. Obama",
				"acres": "296937"
			}],
			"size_type": "Acres"
		},
		{
			"name": "Birmingham Civil Rights National Monument",
			"index": 156,
			"details": [{
				"action": "Established",
				"date": "01/12/2017",
				"president_congress": "B. H. Obama",
				"acres": "unknown" 
			}],
			"size_type": "Acres"
		},
		{
			"name": "Freedom Riders National Monument",
			"index": 157,
			"details": [{
				"action": "Established",
				"date": "01/12/2017",
				"president_congress": "B. H. Obama",
				"acres": "unknown" 
			}],
			"size_type": "Acres"
		},
		{
			"name": "Reconstruction Era National Monument",
			"index": 158,
			"details": [{
				"action": "Established",
				"date": "01/12/2017",
				"president_congress": "B. H. Obama",
				"acres": "unknown" 
			}],
			"size_type": "Acres"
		}
	];

 	new_monuments.forEach(function ( monument ) {
		fullList.push(monument);
 	});

 // 	function findParks( parks ) { 
	//     return parks.name === 'California Coastal';
	// }

	fullList.forEach(function ( park ) {
		if(park.name === 'California Coastal') {
			park.details.push({
				"action": "Enlarged",
				"date": "01/12/2017",
				"president_congress": "B. H. Obama",
				"size_num": "6230"
			})
		}

		if(park.name === 'Cascade-Siskiyou') {
			park.details.push({
				"action": "Enlarged",
				"date": "01/12/2017",
				"president_congress": "B. H. Obama",
				"size_num": "47000"
			})
		}
	}); 


	//write files
	fs.writeFileSync('data.json', JSON.stringify(fullList), 'utf8', function (err) {
		if (err) {
			console.log("failed!");
		} else {
			console.log("success!");
		}
	});
});