var orm = require('orm');

var connectionString = process.env.DATABASE_URL || 'postgres://'+process.env.USER+'@localhost:5432/fundkoala';

console.log('connectionString', connectionString)

var defineModels = function (db, models, next) {
  db.settings.set("instance.returnAllErrors", true);

  models.user = require('./models/user')(db)
  models.fund = require('./models/fund')(db)

  db.sync(function(err) {
    if (err) throw err;
    next();
  })
}

var middleware = orm.express(connectionString, {
  define: defineModels
})

module.exports = {
  middleware: middleware,
}
// var pg = require('pg');


// var db = new pg.Client(connectionString);
// db.connect();


// db.query('\\\d+ users').on('end', function() {
//   console.log(arguments)
//   db.end();
// });

// // var query = db.query('CREATE TABLE items(id SERIAL PRIMARY KEY, text VARCHAR(40) not null, complete BOOLEAN)');
// // query.on('end', function() { db.end(); });






// module.exports = db
