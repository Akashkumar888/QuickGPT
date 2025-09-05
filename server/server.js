import app from './app.js';   // 👈 don’t forget the `.js` extension in ES modules

import http from 'http';

const server = http.createServer(app);

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`🚀 Server is running on: http://localhost:${PORT}`);
});
