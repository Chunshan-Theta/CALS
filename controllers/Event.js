'use strict';

var utils = require('../utils/writer.js');
var Event = require('../service/EventService');

module.exports.eventGET = function eventGET (req, res, next) {
  var eid = req.swagger.params['eid'].value;
  var mid = req.swagger.params['mid'].value;
  Event.eventGET(eid,mid)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.eventPOST = function eventPOST (req, res, next) {
  var event = req.swagger.params['event'].value;
  Event.eventPOST(event)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
