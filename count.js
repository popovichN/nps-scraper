var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');

var arr = ['Established', 'Enlarged', 'Established (USFS)', 'Established (BLM)', 'Enlarged & Renamed', 'Resurveyed & Enlarged', 'Enlarged and transferred to NPS', 'Enlarged, administered by Canyonlands NP', 'Enlarged (BLM)',
'Enlarged under BLM', 'Enlarged, redesignated Statue of Liberty NM', 'Established (FWS)', 'Established (USFWS)', 'Established (FWS and NOAA)', 'Established (NPS and FWS)', 'Established (NOAA and FWS)',
'Established (NOAA and FWS)', 'Established (BLM and USFS)', 'Established (USFS and BLM)'];

var counts = {};

fs.readFile('data.json', 'utf8', function (err, data) {
	if (err) throw err;

	var parsed = JSON.parse(data);
	parsed.forEach(function ( obj ) {
		obj.details.forEach(function ( detail ) {
			// if (arr.indexOf(detail.action) < 0 ) {
			// 	console.log(detail.action)
			// 	arr.push(detail.action);
			// }
			if (arr.indexOf(detail.action) >= 0 ) {
				if (!counts[detail.president_congress]) {
					counts[detail.president_congress] = {
						"count": 1,
						"total_acres": +detail.acres 
					};

				} else {
					var acres = detail.acres;
					if (!acres) {
						console.log(detail, 'first')
					}
					else {
						acres = acres.replace(/\+/g, "")
					}
					
					counts[detail.president_congress].count += 1;
					if (!+acres) {
						console.log(detail, 'second')
						if (acres === '1.6 million') { 
							counts[detail.president_congress].total_acres += 1600000; 
						}
					}
					else {
						counts[detail.president_congress].total_acres += +acres;
					}
				}
			}
		});
	});
	console.log(counts)
  
 //  	fs.writeFileSync('count.json', JSON.stringify(counts), 'utf8', function (err) {
	// 	if (err) {
	// 		console.log("failed!");
	// 	} else {
	// 		console.log("success!");
	// 	}
	// });
});
