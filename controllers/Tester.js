'use strict';

var utils = require('../utils/writer.js');
var Tester = require('../service/TesterService');
var sql = require('./tool/mysql_con.js');
var textfilter = require('./tool/textFilter.js');

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
        unitTester['mail']=unitTester['tid'].substring(eid.toString().length+1,unitTester['tid'].length);
        //unitTester['tid']=null;
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
      console.log(tester);
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
  console.log(testerData['mail']);
  testerData['mail'] = textfilter.sqlFilter(testerData['mail']);
  testerData['log'] = textfilter.sqlFilter(testerData['log']);
  var tid  =testerData['eid']+'-'+testerData['mail'];
  var querytext = "INSERT INTO `tester` (`tid`, `eid`, `chatroomTag`, `log`, `questionAnswer`) VALUES ('"+tid+"', '"+testerData['eid']+"', NULL, '"+testerData['log']+"', '"+testerData['questionAnswer']+"');";
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

      reInsertTester(testers,function(re){
          utils.writeJson(res, re);
      });
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

function reInsertTester(testers,nextstep){
  //INSERT INTO `tester` (`tid`, `eid`, `chatroomTag`, `Log`, `questionAnswer`) VALUES ('1-s6@gmail.com', '1', NULL, '{}', '1');
  //DELETE FROM `tester` WHERE `tester`.`tid` = '1-s6@gmail.com';
  const connection1 = new sql('CALS');
  var deleteSql = "DELETE FROM `tester` WHERE 0";
  var reInsertSql = "INSERT INTO `tester` (`tid`, `eid`, `chatroomTag`, `log`, `questionAnswer`) VALUES ";
  for(var i in testers){
    var unitTester = testers[i];
    var unitTid = unitTester['eid']+"-"+unitTester['mail'];
    deleteSql +=" OR `tester`.`tid` = '"+unitTid+"'";

    reInsertSql += '("'+unitTid+'", '+unitTester['eid']+', "'+unitTester['chatroomTag']+'", "'+unitTester['log']+'", "'+unitTester['questionAnswer']+'"),';

  }


  reInsertSql = reInsertSql.substring(0,reInsertSql.length-1);
  console.log(deleteSql);
  console.log(reInsertSql);

  connection1.query(deleteSql, function(returnValueDelete) {
      const connection2 = new sql('CALS');
      console.log(returnValueDelete);
      connection2.query(reInsertSql, function(returnValueReInsert) {
          console.log(returnValueReInsert);
          nextstep(returnValueReInsert);
      });
  });
}



/////////////////////////////////////////////////////////////////////////////////////////////////

//INSERT INTO `event` (`eid`, `mid`, `title`, `question`, `status`) VALUES (uuid(), '1', 'nuclear power', 'Do you agree?', '1');
module.exports.testerOPTIONS = function testerOPTIONS (req, res, next) {

  Tester.testerOPTIONS()
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
