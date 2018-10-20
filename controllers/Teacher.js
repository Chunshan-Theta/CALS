'use strict';

var utils = require('../utils/writer.js');
var Teacher = require('../service/TeacherService');
var sql = require('./mysql_con.js');


module.exports.memberGET = function memberGET (req, res, next) {
  var mid = req.swagger.params['mid'].value;
  var account = req.swagger.params['account'].value;
  var passwords = req.swagger.params['passwords'].value;
  Teacher.memberGET(mid,account,passwords)
    .then(function (response) {
      selectMember(function(re){
          utils.writeJson(res, re);
      });
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

function selectMember(nextstep){

  const connection = new sql('CALS');
  var querytext = "SELECT * FROM `member`";

  connection.query(querytext, function(returnValue) {
      nextstep(returnValue);
  });
}
