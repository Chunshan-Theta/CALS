'use strict';

var utils = require('../utils/writer.js');
var Record = require('../service/RecordService');
var sql = require('./tool/mysql_con.js');

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
    var unitTid = unitLog['eid']+'-'+unitLog['mail'];
    querytext += "(NULL, '"+unitTid+"', '"+unitLog['type']+"', '"+unitLog['content']+"', 'NULL', '"+unitLog['time']+"'),";
  }

  querytext = querytext.substring(0,querytext.length-1);
  connection.query(querytext, function(returnValue) {
      nextstep(returnValue);
  });
}

//INSERT INTO `behaviorRcord` (`bid`, `tid`, `Type`, `content`, `log`, `time`) VALUES (NULL, '1-gavin19950511@gmail.com', 'read', 'qweqweqweqwe', 'qweqwe,qweqweqwe,qweqweqwe,', CURRENT_TIMESTAMP);
