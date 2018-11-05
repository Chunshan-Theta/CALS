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

  var querytext = "INSERT INTO `behaviorRcord` (`bid`, `tid`, `Type`, `content`, `log`, `time`) VALUES "
  for(var i in logs){
    var unitLog = logs[i];
    unitLog['content'] = textfilter.sqlFilter(unitLog['content']);
    var unitTid = unitLog['eid']+'-'+unitLog['mail'];
    querytext += "(NULL, '"+unitTid+"', '"+unitLog['type']+"', '"+unitLog['content']+"', 'NULL', '"+unitLog['time']+"'),";
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
  Record.actionTesterGET(eid,mail,beforeTime)
    .then(function (response) {
      if(mail!=null){
        selectActionBymail(eid,mail,beforeTime,function(re){

            utils.writeJson(res, re);
        });
      }else {
        selectActionByeid(eid,beforeTime,function(re){
            utils.writeJson(res, re);
        });
      }
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

function selectActionByeid(eid,beforeTime,nextstep){
  const connection = new sql('CALS');
  if(beforeTime!=null){
    var querytext = "SELECT * FROM `behaviorRcord` WHERE `tid` LIKE '"+eid+"-%' AND `time` < '"+beforeTime+"'";
  }else{
    var querytext = "SELECT * FROM `behaviorRcord` WHERE `tid` LIKE '"+eid+"-%'";
  }




  connection.query(querytext, function(returnValue) {
      nextstep(returnValue);
  });
}

function selectActionBymail(eid,mail,beforeTime,nextstep){
  const connection = new sql('CALS');
  if(beforeTime!=null){
    var querytext = "SELECT * FROM `behaviorRcord` WHERE `tid` LIKE '"+eid+"-"+mail+"%' AND `time` < '"+beforeTime+"'";
  }else{
    var querytext = "SELECT * FROM `behaviorRcord` WHERE `tid` LIKE '"+eid+"-"+mail+"%'";
  }




  connection.query(querytext, function(returnValue) {
      nextstep(returnValue);
  });
}
/////////////////////////////
module.exports.actionTesterOPTIONS = function actionTesterOPTIONS (req, res, next) {

  Tester.actionTesterOPTIONS()
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
