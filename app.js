const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const routes = require('./routes/routes');
const dbMaria = require('./util/mariaDb'); // CONNECTION POOL
const dbArango = require('./util/arangoDb');
const db = require('./util/arangoDb');

app.set('views', './views');
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', routes);

app.listen(3000);

