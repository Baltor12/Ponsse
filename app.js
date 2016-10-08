// server.js

// set up ======================================================================
// get all the tools we need
var express = require('express');
var app = express();
var http = require('http');
var server = http.createServer(app);

var port = process.env.PORT || 8080;
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');

var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');



var checkPersonStatus = {"997":"NONE", "988":"NONE", "989":"NONE", "991":"NONE", "993":"NONE", "990":"NONE", "981":"NONE", "977":"NONE", "992":"NONE", "976":"NONE", "984":"NONE" };

var checkPersonName = {"997":"USER1", "988":"USER2", "989":"USER3", "991":"USER4", "993":"USER5", "990":"USER6", "981":"USER7", "977":"USER8", "992":"USER9", "976":"USER10", "984":"USER11" };

//console.log(checkPersonStatus);

var options_mongoDB = {
    db: { native_parser: true },
    server: { poolSize: 5 },
    replset: { rs_name: 'myReplicaSetName' },
    user: 'admin',
    pass: 'admin'
};

var mongoURL = 'mongodb://<admin>:<admin>@apollo.modulusmongo.net:27017/eveNe2gy';

var myOwnDb = mongoose.connect(mongoURL, options_mongoDB);

var personSchema = new mongoose.Schema({
  id: { type: String }
, name: String
, startTime: Number
, endTime: Number
, stationId: String
, productId: String
, projectId: String
, orderId: String

});


var Person = mongoose.model('Person', personSchema);

//ADD NEW PERSON.
/*
	var addNewPerson = new Person({
	  id: '2'
	, name: 'USERNAME'
	, startTime: 1234
	, stationId: 'WS7'
	, productId: '102123'
	, projectId: '213213'
	, orderId: '121244'

	});

	addNewPerson.save(function(err, thor) {
	  if (err) return console.error(err);

	  console.dir("Person SAVED.");
	});
*/


//FINDING A PERSON

//FIND AND DELETE ALL.
/*
Person.find({}, function(err, persons) {
  if (err) return console.error(err);

          persons.forEach(function(doc) {

	        console.log(doc.toObject());    
		//doc.remove();
	    });
  
});
*/


//FIND AND MODIFY SPECIFIC.
/*
Person.find({ id: '2', endTime: {$exists: false} }, function(err, persons) {
  if (err) return console.error(err);

          persons.forEach(function(doc) {
            //console.log("Persons");
            //console.dir(doc.toObject().name);
            console.log(doc.toObject());    
		var currObj = doc.toObject();

		Person.update(currObj, { endTime: 12312312 }, function (err, raw) {
		  if (err) return handleError(err);
		  console.log('The raw response from Mongo was ', raw);
		});

      
	    });
  
});

*/



// routes ======================================================================
require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

// launch ======================================================================


/*
{
  "smartTagId": 997,
  "available": true,
  "proximity": 84,
  "lastSeen": "2016-10-08T15:35:37Z",
  "gatewayId": 379,
  "location": "GW-02 Assembly 10-50",
  "status": "PRESENT",
  "odometers": {},
  "measurements": {
    "humidity": 30.018372,
    "pressure": 1023.9524,
    "temperature": 20.932617
  }
}
*/


const https = require('https');

//setInterval(function(){ alert("Hello"); }, 3000);


function doCheckPosition() {

	https.get('https://ih-wizdom-api:WgWq22Rq72UsW@api.trelab.fi/2/smartTag/991', (res) => {

			res.setEncoding('utf8');

		  res.on('data', (d) => {

			var resData = JSON.parse(d);
			var personId = resData.smartTagId;
			var personName = checkPersonName[resData.smartTagId];
			var previousPosition = checkPersonStatus[resData.smartTagId];
			var currentPosition = resData.gatewayId;
			var currentStatus = resData.status;
			var currDate = new Date().getTime();

		console.log(previousPosition);
		console.log(currentPosition);

			if(previousPosition == currentPosition){
				console.log("Same Position.");	//DO NOTHING. :)
			}
			else if(currentStatus == "NOT_SEEN" || currentStatus == "CONNECTION_LOST"){

				console.log("Position Changed AND NOT IN RANGE OF ANY OTHER SENSOR");
				//SIMPLY MODIFY THE CHANGE, NO NEED TO ENTER A NEW ENTRY.

				Person.find({ id: personId, endTime: {$exists: false} }, function(err, persons) {
				  if (err) return console.error(err);

					  persons.forEach(function(doc) {
		   
						var currObj = doc.toObject();

						Person.update(currObj, { endTime: currDate }, function (err, raw) {
						  if (err) return handleError(err);
						  console.log('Updated Successfully.');
						});

				      
					    });
				  
				});


			}
			else{
				console.log("Position Changed TO NEW WORKSTATION.");
				checkPersonStatus[resData.smartTagId] = currentPosition;	//Also update the array for future purposes.
				//ADD TO THE DB. :)

				if(previousPosition == "NONE"){	
					//DONOT MODIFY THE NONE POSITION, as it does not exists, simply add one entry to DB.			

						var addNewPerson = new Person({
						  id: resData.smartTagId
						, name: personName
						, startTime: currDate
						, stationId: currentPosition
						, productId: '102123'
						, projectId: '878'
						, orderId: '123'

						});

						addNewPerson.save(function(err, thor) {
						  if (err) return console.error(err);

						  console.dir("Person SAVED.");
						});
	

				}

				else {	
					//SO MODIFY PREVIOUS ENTRY AND ADD THE NEW ONE.
					//DONOT MODIFY THE NONE POSITION, as it does not exists.

				//MODIFIED.

				Person.find({ id: personId, endTime: {$exists: false} }, function(err, persons) {
				  if (err) return console.error(err);

					  persons.forEach(function(doc) {
		   
						var currObj = doc.toObject();

						Person.update(currObj, { endTime: currDate }, function (err, raw) {
						  if (err) return handleError(err);
						  console.log('Updated Successfully.');
						});

				      
					    });
				  
				});
	
					//ADDED.

					var addNewPerson = new Person({
					  id: resData.smartTagId
					, name: personName
					, startTime: currDate
					, stationId: currentPosition
					, productId: '102123'
					, projectId: '878'
					, orderId: '123'

					});

					addNewPerson.save(function(err, thor) {
					  if (err) return console.error(err);

					  console.dir("Person SAVED.");
					});


				}
	

			}	

		    	//process.stdout.write(d);
			//console.log(d);
		  });

		}).on('error', (e) => {
		  console.error(e);
		});



}


//setInterval(function(){ doCheckPosition(); }, 10000);

///////////////////////////////////////////////////////////////////////////////////////////////////////AJAX POLLING.
/*
https.get('https://ih-wizdom-api:WgWq22Rq72UsW@api.trelab.fi/2/smartTag/991', (res) => {

	res.setEncoding('utf8');

  res.on('data', (d) => {

	var resData = JSON.parse(d);
	var personId = resData.smartTagId;
	var personName = checkPersonName[resData.smartTagId];
	var previousPosition = checkPersonStatus[resData.smartTagId];
	var currentPosition = resData.gatewayId;
	var currentStatus = resData.status;
	var currDate = new Date().getTime();

console.log(previousPosition);
console.log(currentPosition);

	if(previousPosition == currentPosition){
		console.log("Same Position.");	//DO NOTHING. :)
	}
	else if(currentStatus == "NOT_SEEN" || currentStatus == "CONNECTION_LOST"){

		console.log("Position Changed AND NOT IN RANGE OF ANY OTHER SENSOR");
		//SIMPLY MODIFY THE CHANGE, NO NEED TO ENTER A NEW ENTRY.

		Person.find({ id: personId, endTime: {$exists: false} }, function(err, persons) {
		  if (err) return console.error(err);

			  persons.forEach(function(doc) {
   
				var currObj = doc.toObject();

				Person.update(currObj, { endTime: currDate }, function (err, raw) {
				  if (err) return handleError(err);
				  console.log('Updated Successfully.');
				});

		      
			    });
		  
		});


	}
	else{
		console.log("Position Changed TO NEW WORKSTATION.");
		checkPersonStatus[resData.smartTagId] = currentPosition;	//Also update the array for future purposes.
		//ADD TO THE DB. :)
		
		if(previousPosition == "NONE"){	
			//DONOT MODIFY THE NONE POSITION, as it does not exists, simply add one entry to DB.			

				var addNewPerson = new Person({
				  id: resData.smartTagId
				, name: personName
				, startTime: currDate
				, stationId: currentPosition
				, productId: '102123'
				, projectId: '878'
				, orderId: '123'

				});

				addNewPerson.save(function(err, thor) {
				  if (err) return console.error(err);

				  console.dir("Person SAVED.");
				});
			

		}

		else {	
			//SO MODIFY PREVIOUS ENTRY AND ADD THE NEW ONE.
			//DONOT MODIFY THE NONE POSITION, as it does not exists.

		//MODIFIED.

		Person.find({ id: personId, endTime: {$exists: false} }, function(err, persons) {
		  if (err) return console.error(err);

			  persons.forEach(function(doc) {
   
				var currObj = doc.toObject();

				Person.update(currObj, { endTime: currDate }, function (err, raw) {
				  if (err) return handleError(err);
				  console.log('Updated Successfully.');
				});

		      
			    });
		  
		});
			
			//ADDED.

			var addNewPerson = new Person({
			  id: resData.smartTagId
			, name: personName
			, startTime: currDate
			, stationId: currentPosition
			, productId: '102123'
			, projectId: '878'
			, orderId: '123'

			});

			addNewPerson.save(function(err, thor) {
			  if (err) return console.error(err);

			  console.dir("Person SAVED.");
			});


		}
			

	}	

    	//process.stdout.write(d);
	//console.log(d);
  });

}).on('error', (e) => {
  console.error(e);
});

*/
///////////////////////////////////////////////////////////////////////////////////////////////////////AJAX POLLING.











//////////////////////////////////////////////////////////////////////////////////move the item being added.

//Using Sockets the Copy the above code.

server.listen(port);

console.log('The magic happens on port ' + port);

///////////////////////////////////////////////////////////////////////////////////////////


