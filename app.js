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



//var checkPersonStatus = {"997":"NONE", "988":"NONE", "989":"NONE", "991":"NONE", "993":"NONE", "990":"NONE", "981":"NONE", "977":"NONE", "992":"NONE", "976":"NONE", "984":"NONE" };

//var checkPersonName = {"997":"USER1", "988":"USER2", "989":"USER3", "991":"USER4", "993":"USER5", "990":"USER6", "981":"USER7", "977":"USER8", "992":"USER9", "976":"USER10", "984":"USER11" };


//L2 => 379
//L7 => 380
//L9 => 390
var L2 = "379";
var L7 = "380";
var L9 = "390";

var THE_ORDER_NUMBER = {"379":"NONE", "380":"NONE", "390":"NONE"};
var THE_PROJECT_NUMBER = {"379":"NONE", "380":"NONE", "390":"NONE"};
var THE_MODEL_NUMBER = {"379":"NONE", "380":"NONE", "390":"NONE"};


var checkPersonStatus = {"997":"NONE", "988":"NONE", "989":"NONE", "991":"NONE"};

var checkPersonName = {"997":"USER1", "988":"USER2", "989":"USER3", "991":"USER4"};

//console.log(checkPersonStatus);

var options_mongoDB = {
    db: { native_parser: true },
    server: { poolSize: 5 },
    replset: { rs_name: 'myReplicaSetName' },
    user: 'admin',
    pass: 'admin'
};

var mongoURL = 'mongodb://<admin>:<admin>@apollo.modulusmongo.net:27017/eveNe2gy';
//CONNECT.
var myOwnDb = mongoose.connect(mongoURL, options_mongoDB);
//CREATE THE REQUIRED SCHEMAS.

//PERSON SCHEMA.
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


//PERSON LOCATION SCHEMA. => To make things persistent.

var personPreviousLocation = new mongoose.Schema({
  id: { type: String }
, name: String
, stationId: String

});

var PersonLocation = mongoose.model('PersonLocation', personPreviousLocation);

//FIND AND DELETE ALL USER LOCATIONS.
/*
PersonLocation.find({}, function(err, persons) {
  if (err) return console.error(err);

          persons.forEach(function(doc) {

	        console.log(doc.toObject());    
		//doc.remove();
	    });
  
});
*/

//FIND AND UPDATE ALL WHEN SERVER RESTARTS.

PersonLocation.find({}, function(err, persons) {
  if (err) return console.error(err);

          persons.forEach(function(doc) {
		
		var currObject = doc.toObject();
		console.log(currObject.stationId);
		checkPersonStatus[currObject.id] = currObject.stationId;

	    });

//console.log("UPDATED USER LOCATIONS");
//console.log(checkPersonStatus);

//console.log("=======");

});



doCheckProductData("L2");
doCheckProductData("L7");
doCheckProductData("L9");

//FIND AND MODIFY SPECIFIC USER LOCATION.

/*
PersonLocation.find({ id: '989' }, function(err, persons) {
  if (err) return console.error(err);

          persons.forEach(function(doc) {

            console.log(doc.toObject());    
		var currObj = doc.toObject();

		PersonLocation.update(currObj, { stationId: 'NONE' }, function (err, raw) {
		  if (err) return handleError(err);
		  console.log('UPDATED:  ', raw);
		});

      
	    });
  
});

*/





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


function doCheckPosition(inputTagId) {

//console.log("------------------------");

	var smartTagToCheck = 'https://ih-wizdom-api:WgWq22Rq72UsW@api.trelab.fi/2/smartTag/'+inputTagId;

	https.get(smartTagToCheck, (res) => {

			res.setEncoding('utf8');

		  res.on('data', (d) => {

			var resData = JSON.parse(d);
			var personId = resData.smartTagId;
			var personName = checkPersonName[resData.smartTagId];
			var previousPosition = checkPersonStatus[resData.smartTagId];
			var currentPosition = resData.gatewayId;
			var currentStatus = resData.status;
			var currDate = new Date().getTime();

			var currOrderId = THE_ORDER_NUMBER[currentPosition];
			var currProjectId = THE_PROJECT_NUMBER[currentPosition];
			var currProductId = THE_MODEL_NUMBER[currentPosition];
/*
console.log("////////////////////////////////////");
console.log(currOrderId);
console.log(currProjectId);
console.log(currProductId);
console.log("////////////////////////////////////");
*/

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
			//MAKE SURE TO UPDATE THE LOCATION IN DB AS WELL.
			PersonLocation.find({ id: resData.smartTagId }, function(err, persons) {
			  if (err) return console.error(err);

				  persons.forEach(function(doc) {

					var currObj = doc.toObject();

					PersonLocation.update(currObj, { stationId: currentPosition }, function (err, raw) {
					  if (err) return handleError(err);
					  console.log('UPDATED PERSON IN DB:  ', raw);
					});

			      
				    });
			  
			});
			//USER LOCATION HAS NOW BEEN MODIFIED AS WELL.


				if(previousPosition == "NONE"){	
					//DONOT MODIFY THE NONE POSITION, as it does not exists, simply add one entry to DB.			

						var addNewPerson = new Person({
						  id: resData.smartTagId
						, name: personName
						, startTime: currDate
						, stationId: currentPosition
						, productId: currProductId
						, projectId: currProjectId
						, orderId: currOrderId

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
						, productId: currProductId
						, projectId: currProjectId
						, orderId: currOrderId

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


setInterval(function(){ doCheckPosition(997); }, 10000);
setInterval(function(){ doCheckPosition(988); }, 10000);
setInterval(function(){ doCheckPosition(989); }, 10000);
setInterval(function(){ doCheckPosition(991); }, 10000);


//////////////////////////////POST REQUEST TO GET THE ORDERID AND PROJECTID.

function doCheckProductData(inputWorkStation) {


//L2,L7,L9
//var searchMatch = "L7";
var searchMatch = inputWorkStation;
var postData = {
    "fields": [],
    "conditions": [
        {
            "field": "operation_status",
            "operator": "=",
            "match": "1"
        },
        {
            "field": "work_center_no",
            "operator": "=",
            "match": searchMatch
        }
    ],
    "limit": 500,
    "offset": 0
};

var postBody = JSON.stringify(postData);
//init your options object after you call querystring.stringify because you  need
// the return string for the 'content length' header

var options = {
    host: 'industryhack-ponsse.azurewebsites.net',
    port: '80',
    path: '/api/v1/module/pon_prod_orders_on_stage',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': postBody.length,
        'x-api-key': 'Hxa4cY02myr+g0SBKtlWQVoYcVv0pje+7+cUEAmU1vs='
    }
};

var postreq = http.request(options, function (response) {
    response.setEncoding('utf8');
    response.on('data', (d) => {
        //console.log(d.toString());
        //var jsonObject = JSON.parse(d);
	var jsonObject;
	var is_JSON = true;
	try {
	    jsonObject = JSON.parse(d);
	} catch (e) {
	    // not json
		is_JSON = false;
	}

        //console.log(jsonObject);
var checkGateId;

if(is_JSON){

if(searchMatch == "L7"){
checkGateId = "380";
}
else if(searchMatch == "L2"){
checkGateId = "379";
}
else{
checkGateId = "390";
}

   THE_ORDER_NUMBER[checkGateId] = jsonObject.results[0].order_no;
   THE_PROJECT_NUMBER[checkGateId] = jsonObject.results[0].proj;
   THE_MODEL_NUMBER[checkGateId] = jsonObject.results[0].model;

}



    });});

postreq.write(postBody);
postreq.end();


}

//////////////////////////////POST REQUEST TO GET THE ORDERID AND PROJECTID.

setInterval(function(){ doCheckProductData("L7"); }, 200000);
setInterval(function(){ doCheckProductData("L2"); }, 200000);
setInterval(function(){ doCheckProductData("L9"); }, 200000);



//////////////////////////////////////////////////////////////////////////////////move the item being added.

//Using Sockets the Copy the above code.

server.listen(port);

console.log('The magic happens on port ' + port);

///////////////////////////////////////////////////////////////////////////////////////////


