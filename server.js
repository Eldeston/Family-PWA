const express = require('express');
const path = require('path');
const app = express();

// Used locally; Vercel serves public/ automatically
app.use(express.static(path.join(__dirname, 'public')));

if (require.main === module) {
  app.listen(3000, () => console.log('http://localhost:3000'));
}
module.exports = app;
