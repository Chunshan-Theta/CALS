'use strict';

var utils = require('../utils/writer.js');
var Teacher = require('../service/TeacherService');
var sql = require('./tool/mysql_con.js');



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
