'use strict';


/**
 * getting a event's data
 * 
 *
 * eid String  (optional)
 * mid String this is for search all the events of the member. (optional)
 * returns event
 **/
exports.eventGET = function(eid,mid) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "eid" : "4e732ced3463d06de0ca9a15b6153677",
  "mid" : "4e732ced3463d06de0ca9a15b6153677",
  "title" : "using nuclear to generate electric power in Taiwan?",
  "question" : "do you agree that using nuclear to generate electric power in Taiwan?",
  "status" : 1
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * creating a event
 * 
 *
 * event Event  (optional)
 * no response value expected for this operation
 **/
exports.eventPOST = function(event) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}

