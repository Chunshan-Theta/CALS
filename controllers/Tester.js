'use strict';

var utils = require('../utils/writer.js');
var Tester = require('../service/TesterService');

module.exports.testerGET = function testerGET (req, res, next) {
  var eid = req.swagger.params['eid'].value;
  var mail = req.swagger.params['mail'].value;
  Tester.testerGET(eid,mail)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.testerPOST = function testerPOST (req, res, next) {
  var tester = req.swagger.params['tester'].value;
  Tester.testerPOST(tester)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.testerPUT = function testerPUT (req, res, next) {
  var testers = req.swagger.params['testers'].value;
  Tester.testerPUT(testers)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
