const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const routes = require('./routes/routes');
const dbMaria = require('./util/mariaDb'); // CONNECTION POOL
const dbArango = require('./util/arangoDb');

app.set('views', './views');
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', routes);

// TEST THE DB
// dbMaria.execute('SELECT * FROM users WHERE email = ?', ['brigitt@yahoo.com']).then(result =>{
//     console.log(result[0]);
// }).catch(err => {
//     console.log(err);
// });

// const user = new User('Brigitta', 'Rucz', 'brigitta@yahoo.com', 'password', 1604856996, 'denmark', 'copenhagen', "", "", new Date('1998-03-16'));

// user.createUser().then(result => {
// 	// localStorage.setItem('sessionId', user.id);
// 	console.log(result);
// }).catch(error => {
// 	console.log(error);
// })

// TEST THE DB
// var result = dbArango.query('FOR x IN circles RETURN x').then(value => {
//     return value.all();
// })

// result.then(myres => {
//     console.log(myres);
// })

app.listen(3000);