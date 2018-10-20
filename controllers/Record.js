'use strict';

var utils = require('../utils/writer.js');
var Record = require('../service/RecordService');

module.exports.actionTesterPOST = function actionTesterPOST (req, res, next) {
  var log = req.swagger.params['log'].value;
  Record.actionTesterPOST(log)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
