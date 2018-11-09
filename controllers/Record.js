'use strict';

var utils = require('../utils/writer.js');
var Record = require('../service/RecordService');
var sql = require('./tool/mysql_con.js');
var textfilter = require('./tool/textFilter.js');
module.exports.actionTesterPOST = function actionTesterPOST (req, res, next) {
  var logs = req.swagger.params['logs'].value;
  Record.actionTesterPOST(logs)
    .then(function (response) {
      insertAction(logs,function(re){
          utils.writeJson(res, re);
      });
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};


function insertAction(logs,nextstep){
  const connection = new sql('CALS');

  var querytext = "INSERT INTO `behaviorRcord` (`bid`, `tid`, `Type`, `content`, `name`, `time`) VALUES "
  for(var i in logs){
    var unitLog = logs[i];
    unitLog['content'] = textfilter.sqlFilter(unitLog['content']);
    unitLog['name'] = textfilter.sqlFilter(unitLog['name']);
    var unitTid = unitLog['eid']+'-'+unitLog['mail'];
    querytext += "(NULL, '"+unitTid+"', '"+unitLog['type']+"', '"+unitLog['content']+"', '"+unitLog['name']+"', '"+unitLog['time']+"'),";
  }

  querytext = querytext.substring(0,querytext.length-1);
  connection.query(querytext, function(returnValue) {
      nextstep(returnValue);
  });
}

//INSERT INTO `behaviorRcord` (`bid`, `tid`, `Type`, `content`, `log`, `time`) VALUES (NULL, '1-gavin19950511@gmail.com', 'read', 'qweqweqweqwe', 'qweqwe,qweqweqwe,qweqweqwe,', CURRENT_TIMESTAMP);
////////////////////////////////////////////////////////////

module.exports.actionTesterGET = function actionTesterGET (req, res, next) {
  var eid = req.swagger.params['eid'].value;
  var mail = req.swagger.params['mail'].value;
  var beforeTime = req.swagger.params['beforeTime'].value;
  var recordType = req.swagger.params['recordType'].value;
  Record.actionTesterGET(eid,mail,beforeTime)
    .then(function (response) {
      if(mail!=null){
        selectActionBymail(eid,mail,beforeTime,recordType,function(re){

            utils.writeJson(res, re);
        });
      }else {
        selectActionByeid(eid,beforeTime,recordType,function(re){
            utils.writeJson(res, re);
        });
      }
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

function selectActionByeid(eid,beforeTime,recordType,nextstep){
  const connection = new sql('CALS');
  var querytext = "SELECT * FROM `behaviorRcord` WHERE `tid` LIKE '"+eid+"-%'";
  if(beforeTime!=null){
    querytext+=" AND `time` < '"+beforeTime+"';"
  }
  if(recordType!=null){
    querytext+=" AND `Type` = '"+recordType+"';"
  }



  console.log(querytext);
  connection.query(querytext, function(returnValue) {
      nextstep(returnValue);
  });
}

function selectActionBymail(eid,mail,beforeTime,recordType,nextstep){
  const connection = new sql('CALS');
  var querytext = "SELECT * FROM `behaviorRcord` WHERE `tid` LIKE '"+eid+"-"+mail+"%'";
  if(beforeTime!=null){
    querytext += " AND `time` < '"+beforeTime+"'";
  }
  if(recordType!=null){
    querytext+=" AND `Type` = '"+recordType+"';"
  }


  console.log(querytext);
  connection.query(querytext, function(returnValue) {
      nextstep(returnValue);
  });
}
/////////////////////////////
module.exports.actionTesterOPTIONS = function actionTesterOPTIONS (req, res, next) {

  Record.actionTesterOPTIONS()
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

////////////////////////////////////////////////////////////

module.exports.actionChatroomGET = function actionChatroomGET (req, res, next) {
  var chatroomTag = req.swagger.params['chatroomTag'].value;
  console.log("chatroomTag",chatroomTag);
  Record.actionChatroomGET(chatroomTag)
    .then(function (response) {
      selectActionByChatroomTag(chatroomTag,function(re){
        utils.writeJson(res, re);
      });
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

function selectActionByChatroomTag(Tag,nextstep){
  //SELECT `behaviorRcord`.*,`tester`.`chatroomTag` FROM `behaviorRcord`,`tester` WHERE `tester`.`chatroomTag`='2' AND `behaviorRcord`.`tid`=`tester`.`tid` ORDER BY `bid` DESC
  console.log("chatroomTag",Tag);
  const connection = new sql('CALS');
  console.log("chatroomTag",Tag);
  var querytext = "SELECT `behaviorRcord`.*,`tester`.`chatroomTag` FROM `behaviorRcord`,`tester` WHERE `tester`.`chatroomTag`='"+Tag+"' AND `behaviorRcord`.`tid`=`tester`.`tid` ORDER BY `behaviorRcord`.`time` ASC";
  console.log(querytext);




  connection.query(querytext, function(returnValue) {
      nextstep(returnValue);
  });
}
