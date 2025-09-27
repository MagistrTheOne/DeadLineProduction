const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 3001 });

console.log('🚀 WebSocket server starting on port 3001...');

wss.on('connection', function connection(ws, req) {
  console.log('✅ New WebSocket connection established');
  
  // Send welcome message
  ws.send(JSON.stringify({
    type: 'connection',
    message: 'Connected to DeadLine V2 WebSocket server',
    timestamp: new Date().toISOString()
  }));

  ws.on('message', function incoming(message) {
    try {
      const data = JSON.parse(message);
      console.log('📨 Received:', data);
      
      // Echo back the message
      ws.send(JSON.stringify({
        type: 'echo',
        original: data,
        timestamp: new Date().toISOString()
      }));
    } catch (error) {
      console.error('❌ Error parsing message:', error);
    }
  });

  ws.on('close', function close() {
    console.log('❌ WebSocket connection closed');
  });

  ws.on('error', function error(err) {
    console.error('❌ WebSocket error:', err);
  });
});

wss.on('listening', function() {
  console.log('🎉 WebSocket server is running on ws://localhost:3001');
});

wss.on('error', function(error) {
  console.error('❌ WebSocket server error:', error);
});
