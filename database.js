var orm = require('orm');

var connectionString = process.env.DATABASE_URL || 'postgres://'+process.env.USER+'@localhost:5432/fundkoala';

console.log('connectionString', connectionString)

var defineModels = function (db, models, next) {
  db.settings.set("debug", true);
  db.settings.debug = true
  db.settings.set("instance.returnAllErrors", true);

  models.User = require('./models/user')(db, models)
  models.Fund = require('./models/fund')(db, models)
  models.Invite = require('./models/invite')(db, models)
  models.FundMembership = require('./models/fundMembership')(db, models)

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
//
//
// var db = new pg.Client(connectionString);
// db.connect();


// db.query('\\\d+ users').on('end', function() {
//   console.log(arguments)
//   db.end();
// });

// // var query = db.query('CREATE TABLE items(id SERIAL PRIMARY KEY, text VARCHAR(40) not null, complete BOOLEAN)');
// // query.on('end', function() { db.end(); });






// module.exports = db
