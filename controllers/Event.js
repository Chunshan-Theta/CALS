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
      console.log(event);
      if(event["eid"] == 0){
        insertEvent(event,function(re){
            utils.writeJson(res, re);
        });


      }else {
        utils.writeJson(res, {"error":"'eid' please typing 0, event = "+JSON.stringify(event)} ,400);

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
