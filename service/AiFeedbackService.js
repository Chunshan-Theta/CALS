'use strict';
/**
 * getting data of aiFeedback.
 * usually for setting the aiFeedback's data.
 *
 * bid String
 * ... 為了符合原先此系統的設計，程式撰寫方式完全相同...
 **/
exports.aiFeedbackGET = function(bid) {
  return new Promise(function(resolve, reject) {
    let examples = {};
    examples['application/json'] = {
        "bid" : "123"
    };
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}

exports.aiFeedbackPOST = function(bid, feedbackType, datetime) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}

exports.aiFeedbackOPTIONS = function() {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}
