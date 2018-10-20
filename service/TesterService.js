'use strict';


/**
 *  getting a tester 
 * 
 *
 * eid String 
 * mail String if for searching all the tester of events, please typing 'NULL' or keep blank. (optional)
 * returns tester
 **/
exports.testerGET = function(eid,mail) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "mail" : "gavin19950511@gmail.com",
  "eid" : "4e732ced3463d06de0ca9a15b6153677",
  "chatroomTag" : "23",
  "log" : "",
  "questionAnswer" : 0
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 *  create a tester 
 * 
 *
 * tester Tester  (optional)
 * no response value expected for this operation
 **/
exports.testerPOST = function(tester) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


/**
 * update tester's data
 * it's only for settle tester to chatroom.
 *
 * testers List 
 * no response value expected for this operation
 **/
exports.testerPUT = function(testers) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}

