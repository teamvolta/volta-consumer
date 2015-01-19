var spawn = require('child_process').spawn;

if (process.env.SITE_TYPE === "backend") {
  console.log("choosing backend run script");
  spawn('node', ['consumer-server/server.js']);	
} else if (process.env.SITE_TYPE === "producer") {
  console.log("choosing producer run script");
  spawn('node', ['producer-server/server.js']);
} else if (process.env.SITE_TYPE === "frontend") {
  console.log("choosing frontend run script");
  spawn('node', ['client/client-server/server.js']);
} else {
  console.log("SITE_TYPE variable should be set to backend, producer or frontend");
}