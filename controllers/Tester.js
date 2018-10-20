'use strict';

var utils = require('../utils/writer.js');
var Tester = require('../service/TesterService');
var sql = require('./tool/mysql_con.js');


/////////////////////////////////////////////
module.exports.testerGET = function testerGET (req, res, next) {
  var eid = req.swagger.params['eid'].value;
  var mail = req.swagger.params['mail'].value;
  Tester.testerGET(eid,mail)
    .then(function (response) {
      if(eid != null && mail != null){

        selectTesterByLogin(eid,mail,function(re){
            utils.writeJson(res, re);
        });
      }else if (eid != null && mail == null) {
        selectTesterByEid(eid,function(re){
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
function selectTesterByLogin(eid,mail,nextstep){
  ////SELECT `event`.* FROM `member`,`event` WHERE `member`.`mid`=`event`.`mid` AND `member`.`account` = 'gavin1995011@gmail.com'
  const connection = new sql('CALS');

  var querytext = "SELECT `tester`.`eid`,`tester`.`chatroomTag`,`tester`.`log`,`tester`.`questionAnswer` FROM `tester` WHERE `tid` ='"+eid+'-'+mail+"'";;
  console.log(querytext);
  connection.query(querytext, function(returnValue) {
      returnValue[0]['tid']=null;
      returnValue[0]['mail']=mail;
      nextstep(returnValue);
  });
}

function selectTesterByEid(eid,nextstep){
  ////SELECT `event`.* FROM `member`,`event` WHERE `member`.`mid`=`event`.`mid` AND `member`.`account` = 'gavin1995011@gmail.com'
  const connection = new sql('CALS');

  var querytext = "SELECT * FROM `tester` WHERE `eid` ='"+eid+"'";;
  console.log(querytext);
  connection.query(querytext, function(returnValue) {
      for(var i in returnValue){
        var unitTester = returnValue[i];

        unitTester['mail']=unitTester['tid'].substring(eid.length+1,unitTester['tid'].length);
        unitTester['tid']=null;
      }
      nextstep(returnValue);
  });
}



///////////////////////////////////////////////
//
module.exports.testerPOST = function testerPOST (req, res, next) {
  var tester = req.swagger.params['tester'].value;
  Tester.testerPOST(tester)
    .then(function (response) {
      insertTester(tester,function(re){
          utils.writeJson(res, re);
      });



    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};



function insertTester(testerData,nextstep){
  const connection = new sql('CALS');
  var tid  =testerData['eid']+'-'+testerData['mail'];
  var querytext = "INSERT INTO `tester` (`tid`, `eid`, `chatroomTag`, `Log`, `questionAnswer`) VALUES ('"+tid+"', '"+testerData['eid']+"', NULL, '{}', '"+testerData['questionAnswer']+"');";
  console.log(querytext);
  connection.query(querytext, function(returnValue) {
      nextstep(returnValue);
  });
}







////////////////////////////////////////////////
module.exports.testerPUT = function testerPUT (req, res, next) {
  var testers = req.swagger.params['testers'].value;
  Tester.testerPUT(testers)
    .then(function (response) {
      var tids = [];
      for(var i in testers){
        var unitTester = testers[i];
        tids.push(unitTester['eid']+"-"+unitTester['mail']);

      }
      console.log(tids);
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
