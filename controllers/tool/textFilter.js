

module.exports.sqlFilter = function (text,filter="'"){

  return text.replace(new RegExp(filter, 'g'), "’");
}
