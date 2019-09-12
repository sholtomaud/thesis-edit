// Taken from 
// https://medium.com/hackernoon/implementing-a-websocket-server-with-node-js-d9b78ec5ffa8
// https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API/Writing_WebSocket_client_applications

const http = require('http');
const crypto = require('crypto');
const static = require('node-static');
const file = new static.Server('./');

const server = http.createServer((req, res) => {
  req.addListener('end', () => file.serve(req, res)).resume();
});


const port = 3210;

server.listen(port, () => console.log(`Server running at http://localhost:${port}`));

server.on('upgrade', function (req, socket) {
  if (req.headers['upgrade'] !== 'websocket') {
    socket.end('HTTP/1.1 400 Bad Request');
    return;
  }

  // Read the websocket key provided by the client: 
  
  const acceptKey = req.headers['sec-websocket-key']; 
  
  // Generate the response value to use in the response: 
  
  const hash = generateAcceptValue(acceptKey); 
  
  // Write the HTTP response into an array of response lines:
   
  const responseHeaders = [ 'HTTP/1.1 101 Web Socket Protocol Handshake', 'Upgrade: WebSocket', 'Connection: Upgrade', `Sec-WebSocket-Accept: ${hash}` ]; 
  
  // Write the response back to the client socket, being sure to append two 
  // additional newlines so that the browser recognises the end of the response 
  // header and doesn't continue to wait for more header data:

  socket.write(responseHeaders.join('\r\n') + '\r\n\r\n');

  const protocol = req.headers['sec-websocket-protocol'];
  // If provided, they'll be formatted as a comma-delimited string of protocol
  // names that the client supports; we'll need to parse the header value, if
  // provided, and see what options the client is offering:
  const protocols = !protocol ? [] : protocol.split(',').map(s => s.trim());
  // To keep it simple, we'll just see if JSON was an option, and if so, include
  // it in the HTTP response:
  if (protocols.includes('json')) {
    // Tell the client that we agree to communicate with JSON data
    responseHeaders.push(`Sec-WebSocket-Protocol: json`);
  }

});

 // Don't forget the hashing function described earlier:
function generateAcceptValue (acceptKey) {
  return crypto
  .createHash('sha1')
  .update(acceptKey + '258EAFA5-E914–47DA-95CA-C5AB0DC85B11', 'binary')
  .digest('base64');
}


function parseMessage (buffer) {
    const firstByte = buffer.readUInt8(0);
    const isFinalFrame = Boolean((firstByte >>> 7) & 0×1); 
    const [reserved1, reserved2, reserved3] = [ Boolean((firstByte >>> 6) & 0×1), Boolean((firstByte >>> 5) & 0×1), Boolean((firstByte >>> 4) & 0×1) ]; 
    const opCode = firstByte & 0xF; 
    // We can return null to signify that this is a connection termination frame 
    if (opCode === 0×8) 
       return null; 
    // We only care about text frames from this point onward 
    if (opCode !== 0×1) 
      return; 
    const secondByte = buffer.readUInt8(1); 
    const isMasked = Boolean((secondByte >>> 7) & 0×1); 
    // Keep track of our current position as we advance through the buffer 
    let currentOffset = 2; let payloadLength = secondByte & 0×7F; 
    if (payloadLength > 125) { 
      if (payloadLength === 126) { 
        payloadLength = buffer.readUInt16BE(currentOffset); 
        currentOffset += 2; 
      } else { 
        // 127 
        // If this has a value, the frame size is ridiculously huge! 
        const leftPart = buffer.readUInt32BE(currentOffset); 
        const rightPart = buffer.readUInt32BE(currentOffset += 4); 
        // Honestly, if the frame length requires 64 bits, you're probably doing it wrong. 
        // In Node.js you'll require the BigInt type, or a special library to handle this. throw new Error('Large payloads not currently implemented'); 
      } 
    }
  }