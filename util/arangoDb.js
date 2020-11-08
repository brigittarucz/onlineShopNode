const arangojs = require('arangojs');
const dbConfig = {
	host: 'localhost',
	port: '8529',
	username: 'root',
	password: '',
	database: '_system',
};

const db = new arangojs.Database({
	url: `http://${dbConfig.host}:${dbConfig.port}`,
	databaseName: dbConfig.database
});

db.useBasicAuth(dbConfig.username, dbConfig.password);

module.exports = db;