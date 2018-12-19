'use strict';

var utils = require('../utils/writer.js');
var Event = require('../service/EventService');
var sql = require('./tool/mysql_con.js');
var textfilter = require('./tool/textFilter.js');
module.exports.eventGET = function eventGET (req, res, next) {
  var eid = req.swagger.params['eid'].value;
  var mid = req.swagger.params['mid'].value;
  Event.eventGET(eid,mid)
    .then(function (response) {
      if(mid != null){

        selectEventByMid(mid,function(re){
            utils.writeJson(res, re);
        });
      }
      else if (eid != null) {
        selectEventByEid(eid,function(re){
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


//local function
function selectEventByMid(mid,nextstep){
  ////SELECT `event`.* FROM `member`,`event` WHERE `member`.`mid`=`event`.`mid` AND `member`.`account` = 'gavin1995011@gmail.com'
  const connection = new sql('CALS');
  var querytext = "SELECT `event`.* FROM `event` WHERE `mid`='"+mid+"'";;

  connection.query(querytext, function(returnValue) {
      nextstep(returnValue);
  });
}
function selectEventByEid(eid,nextstep){
  ////SELECT `event`.* FROM `member`,`event` WHERE `member`.`mid`=`event`.`mid` AND `member`.`account` = 'gavin1995011@gmail.com'
  const connection = new sql('CALS');
  var querytext = "SELECT `event`.* FROM `event` WHERE `eid`='"+eid+"'";
  console.log(querytext);
  connection.query(querytext, function(returnValue) {
      nextstep(returnValue);
  });
}



/////////////////////////////////////////////////////////////////////////////////////////////////

//INSERT INTO `event` (`eid`, `mid`, `title`, `question`, `status`) VALUES (uuid(), '1', 'nuclear power', 'Do you agree?', '1');
module.exports.eventPOST = function eventPOST (req, res, next) {
  var event = req.swagger.params['event'].value;
  Event.eventPOST(event)
    .then(function (response) {
      console.log("POST");
      //console.log(event);
      if(event["eid"] == 0){
        insertEvent(event,function(re){
            utils.writeJson(res, re);
        });


      }else {
        utils.writeJson(res, {"error":"'eid' please typing 0"} ,400);

      }




    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};



function insertEvent(eventData,nextstep){
  const connection = new sql('CALS');
  //var querytext = "INSERT INTO `event` (`eid`, `mid`, `title`, `question`, `status`) VALUES (null, '"+eventData['mid']+"', '"+eventData['title']+"', '"+eventData['question']+"', '"+eventData['status']+"');";
  //INSERT INTO `event` (`eid`, `mid`, `title`, `question`, `status`, `memo`, `eventTime`, `log`) VALUES (NULL, '1', 'using nuclear to generate electric power in Taiwan?', 'do you agree that using nuclear to generate electric power in Taiwan?', '1', NULL, NULL, 'createTime::20180928-211300,updateTime::20181030-110321');
  eventData['memo'] = textfilter.sqlFilter(eventData['memo']);
  eventData['question'] = textfilter.sqlFilter(eventData['question']);
  eventData['title'] = textfilter.sqlFilter(eventData['title']);
  eventData['log'] = textfilter.sqlFilter(eventData['log']);
  eventData['needToRead'] = textfilter.sqlFilter(eventData['needToRead']);
  var querytext = "INSERT INTO `event` (`eid`, `mid`, `title`, `question`, `status`, `memo`, `eventTime`, `log`,`needToRead`) VALUES (null, '"+eventData['mid']+"', '"+eventData['title']+"', '"+eventData['question']+"', '"+eventData['status']+"', '"+eventData['memo']+"', '"+eventData['eventTime']+"', '"+eventData['log']+"','"+eventData['needToRead']+"');";
  console.log(querytext);
  connection.query(querytext, function(returnValue) {
      nextstep(returnValue);
  });
}



/////////////////////////////////////////////////////////////////////////////////////////////////

//INSERT INTO `event` (`eid`, `mid`, `title`, `question`, `status`) VALUES (uuid(), '1', 'nuclear power', 'Do you agree?', '1');
module.exports.eventOPTIONS = function eventOPTIONS (req, res, next) {

  Event.eventOPTIONS()
    .then(function (response) {

      utils.writeJson(res, {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
        "Access-Control-Allow-Headers": "X-PINGOTHER, Content-Type",
        "Access-Control-Max-Age":"86400"
      });



    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};



/////////////////////////////////////////////////////////////////////////////////////////////////

module.exports.eventPUT = function eventPUT (req, res, next) {
  var event = req.swagger.params['event'].value;
  Event.eventPUT(event)
    .then(function (response) {
      if(event['mid']=='-1'){
        console.log(event);

        updateEvent(event,function(re){
          utils.writeJson(res, re);
        });

      }
      else {
        utils.writeJson(res, {
          'error':'422 Unprocessable Entity. input is invalid.<br> please confirmed that mid = "-1"',
          'valid input sample':{
            "eid": 1,
            "mid": "-1",
            "title": "some text.",
            "question": "some text.",
            "status": 1,
            "memo": "some text.",
            "eventTime": "2018-09-28 16:00:00",
            "log": "createTime::20180928-211300,updateTime::20181030-110321",
            "needToRead": "some text."
          },
          'getting invalid input':event
        },422);
      }






    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

function updateEvent(eventData,nextstep){
  const connection = new sql('CALS');
  //UPDATE `event` SET `title` = 'something' WHERE `event`.`eid` = 1;
  eventData['memo'] = textfilter.sqlFilter(eventData['memo']);
  eventData['question'] = textfilter.sqlFilter(eventData['question']);
  eventData['title'] = textfilter.sqlFilter(eventData['title']);
  eventData['log'] = textfilter.sqlFilter(eventData['log']);
  eventData['needToRead'] = textfilter.sqlFilter(eventData['needToRead']);
  //var querytext = "INSERT INTO `event` (`eid`, `mid`, `title`, `question`, `status`, `memo`, `eventTime`, `log`,`needToRead`) VALUES (null, '"+eventData['mid']+"', '"+eventData['title']+"', '"+eventData['question']+"', '"+eventData['status']+"', '"+eventData['memo']+"', '"+eventData['eventTime']+"', '"+eventData['log']+"','"+eventData['needToRead']+"');";
  var querytext = "UPDATE `event` SET `title` = '"+eventData['title']+"',`memo` = '"+eventData['memo']+"',`question` = '"+eventData['question']+"',`log` = '"+eventData['log']+"',`needToRead` = '"+eventData['needToRead']+"',`status` = '"+eventData['status']+"' WHERE `event`.`eid` = "+eventData['eid']+";";

  console.log(querytext);
  connection.query(querytext, function(returnValue) {
      nextstep(returnValue);
  });
}
