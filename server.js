var express = require('express');
var app = express();
const port = process.env.PORT || 3000

app.listen(port, () => console.log(`Chess listening on port ${port}!`));

app.use(express.static('public'));