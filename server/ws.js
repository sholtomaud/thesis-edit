var http = require('http'),
    websocket = require('websocket-stream');

var server = http.createServer();

websocket.createServer({ server: server }, function(stream) {
  console.log("serving socket handler");

  var roomStream = rooms.lobby.connect();

  stream.pipe(roomStream).pipe(stream);

  stream.on("error", function(error) {
    console.log(error);
  });
});

server.listen(8080);

const wrap = obj => {
  return new Proxy(obj, {
    get(target, propKey) {
      console.log(`Reading property "${propKey}"`);
      return target[propKey];
    }
  });
};
