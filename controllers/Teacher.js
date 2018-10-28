'use strict';

var utils = require('../utils/writer.js');
var Teacher = require('../service/TeacherService');
var sql = require('./tool/mysql_con.js');
var textfilter = require('./tool/textFilter.js');



module.exports.memberGET = function memberGET (req, res, next) {
  var mid = req.swagger.params['mid'].value;
  var account = req.swagger.params['account'].value;
  var passwords = req.swagger.params['passwords'].value;
  Teacher.memberGET(mid,account,passwords)
    .then(function (response) {

      if(mid != null){
        selectMemberByMid(mid,function(re){
            utils.writeJson(res, re);
        });
      }
      else if (account != null && passwords != null) {
        selectMemberByLogin(account,passwords,function(re){
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

function selectMemberByMid(mid,nextstep){
  const connection = new sql('CALS');
  var querytext = "SELECT * FROM `member` WHERE `mid`="+mid;

  connection.query(querytext, function(returnValue) {
      nextstep(returnValue);
  });
}
function selectMemberByLogin(account,passwords,nextstep){
  const connection = new sql('CALS');
  var querytext = "SELECT * FROM `member` WHERE `account` = '"+account+"'";

  connection.query(querytext, function(returnValue) {
      if(returnValue.length!=0){
        if(returnValue[0]['passwords'] == passwords){
          //returnValue[0]['mid'] = returnValue[0]['account'];
          nextstep(returnValue[0]);
        }else {
          nextstep({"alert":"passwords error"});
        }

      }else {
        nextstep({"alert":"not found user"});
      }

  });
}


//////////////////////////////////////////////////

module.exports.memberPOST = function memberPOST (req, res, next) {
  var member = req.swagger.params['member'].value;
  Teacher.memberPOST(member)
    .then(function (response) {
      if(member['mid']=='0'){
        console.log(member);
        createMember(member,function(re){
          utils.writeJson(res, re);
        });

      }
      else {
        utils.writeJson(res, {
          'error':'422 Unprocessable Entity. input is invalid.',
          'valid input sample':{ mid: '0',
                                 account: 'Somethihg String',
                                 passwords: 'isPasswords',
                                 name: 'userName',
                                 department: 'userGroupName'
                               },
          'getting invalid input':member
        },422);
      }





    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};


function createMember(member,nextstep){
  const connection = new sql('CALS');
  var account = textfilter.sqlFilter(member['account']);
  var passwords = textfilter.sqlFilter(member['passwords']);
  var name = textfilter.sqlFilter(member['name']);
  var department = textfilter.sqlFilter(member['department']);
  var querytext = "INSERT INTO `member` (`mid`, `account`, `passwords`, `name`, `department`) VALUES (NULL, '"+account+"', '"+passwords+"', '"+name+"', '"+department+"');";

  connection.query(querytext, function(returnValue) {

          nextstep(returnValue);


  });
}

//////////////////////////////
module.exports.memberOPTIONS = function memberOPTIONS (req, res, next) {

  Teacher.memberOPTIONS()
    .then(function (response) {
      utils.writeJson(res, response);

    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
