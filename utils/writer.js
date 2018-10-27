var ResponsePayload = function(code, payload) {
  this.code = code;
  this.payload = payload;
}

exports.respondWithCode = function(code, payload) {
  return new ResponsePayload(code, payload);
}

var writeJson = exports.writeJson = function(response, arg1, arg2) {
  var code;
  var payload;
  console.log('!!!!!!!!!!!!!!!!!!!!0.4');
  if(arg1 && arg1 instanceof ResponsePayload) {
    writeJson(response, arg1.payload, arg1.code);
    return;
  }

  if(arg2 && Number.isInteger(arg2)) {
    code = arg2;
  }
  else {
    if(arg1 && Number.isInteger(arg1)) {
      code = arg1;
    }
  }
  if(code && arg1) {
    payload = arg1;
  }
  else if(arg1) {
    payload = arg1;
  }

  if(!code) {
    // if no response code given, we default to 200
    code = 200;
  }
  if(typeof payload === 'object') {
    console.log('!!!!!!!!!!!!!!!!!!!!0.5');
    payload = JSON.stringify(payload, null, 2);
    console.log('!!!!!!!!!!!!!!!!!!!!0.6');
  }
  console.log('!!!!!!!!!!!!!!!!!!!!0.7');
  response.writeHead(code, {
    'Access-Control-Allow-Origin':'*',
    'Access-Control-Allow-Methods':'GET, POST, DELETE, PUT, PATCH, OPTIONS',
    'Access-Control-Allow-Headers':'Content-Type, api_key, Authorization',
    'Content-Type': 'application/json'
  });
  console.log('!!!!!!!!!!!!!!!!!!!!0.8');
  response.end(payload);
  console.log('!!!!!!!!!!!!!!!!!!!!0.9');
}
