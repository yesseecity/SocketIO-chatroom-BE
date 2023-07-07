const express = require('express');

const app = express();
app.use(express.static(__dirname + "/static-files"));
// app.listen(8080);

module.exports = app;