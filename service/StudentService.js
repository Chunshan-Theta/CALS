'use strict';


/**
 * getting data of member.
 * usually for logining method or getting a member's data.
 *
 * mid String md5(mid) (optional)
 * account String  (optional)
 * passwords String  (optional)
 * returns member
 **/
exports.studentGET = function(log,passwords) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "mid" : "4e732ced3463d06de0ca9a15b6153677",
  "account" : "description",
  "passwords" : "title",
  "name" : "Theta Wang",
  "department" : "NLT"
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}