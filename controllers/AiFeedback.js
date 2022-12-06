'use strict';

let utils = require('../utils/writer.js');
let AiFeedback = require('../service/AiFeedbackService');
let sql = require('./tool/mysql_con.js');
let textfilter = require('./tool/textFilter.js');


module.exports.aiFeedbackGET = function aiFeedbackGET (req, res, next) {
  let bid = req.swagger.params['bid'].value;
  AiFeedback.aiFeedbackGET(bid)
    .then(function (response) {
      if(bid != null){
        selectAiFeedbackByBid(bid,function(re){
          utils.writeJson(res, re);
        });
      }else{
        utils.writeJson(res, {"error":"bad input"} ,400);
      }
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

function selectAiFeedbackByBid(bid, nextstep){
  const connection = new sql('CALS');
  let querytext = "SELECT * FROM `aiFeedback` WHERE `bid`=" + bid;

  connection.query(querytext, function(returnValue) {
      nextstep(returnValue);
  });
}

//////////////////////////////////////////////////
module.exports.aiFeedbackPOST = function aiFeedbackPOST (req, res, next) {
// console.log('###### aiFeedbackPOST params:',req.swagger.params)  
//   let bid = req.swagger.params['bid'].value;
// console.log('###### bid:',bid)
//   let feedbackType = req.swagger.params['feedbackType'].value;
// console.log('###### feedbackType:',feedbackType)  
  let datetime = Date.now()  
console.log('###### datetime:',datetime)    
  let aiFeedback = req.swagger.params['aifeedback'].value;
console.log('###### aiFeedback:',aiFeedback)    
  let bid = parseInt(aiFeedback[0].bid);
  let feedbackType = aiFeedback[0].feedbacktype;
console.log('###### bid feedbackType:', bid, feedbackType) 

  AiFeedback.aiFeedbackPOST(bid, feedbackType, datetime)
    .then(function (response) {
      if(bid != null && feedbackType != null){
        console.log(bid, feedbackType);
        createAiFeedback(bid, feedbackType, datetime, function(re){
          utils.writeJson(res, re);
        });

      }
      else {
        utils.writeJson(res, {
          'error':'422 Unprocessable Entity. input is invalid.',
          'valid input sample': { 
              bid: '123',
              feedbackType: '離題',
          }
        }, 422);
      }

    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};


function createAiFeedback(bid, feedbackType, datetime, nextstep){
console.log('###### fn createAiFeedback:', bid, feedbackType, datetime);  
  const connection = new sql('CALS');
  // let querytext = "INSERT INTO `aiFeedback` (`bid`, `feedback_type`, `create_datetime`) VALUES (" + bid + ", '" + feedbackType + "', '" + datetime + "');";
  let querytext = "INSERT INTO `aiFeedback` (`bid`, `feedback_type`, `create_datetime`) VALUES (" + bid + ", '" + feedbackType + "', now());";

console.log('###### querytext:', querytext);
  connection.query(querytext, function(returnValue) {
    nextstep(returnValue);
  });
}

//////////////////////////////
module.exports.aiFeedbackOPTIONS = function aiFeedbackOPTIONS (req, res, next) {

  AiFeedback.aiFeedbackOPTIONS()
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
