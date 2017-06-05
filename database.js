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
  db.drop(function() {
    db.sync(function(err) {
      if (err) throw err;
      next();
    })
  })
}

var middleware = orm.express(connectionString, {
  define: defineModels
})

module.exports = {
  middleware: middleware,
}

function inspectModelInstance(model){
  // console.log('model properties', Object.getOwnPropertyNames(model))
  console.log(model.constructor.name, model.id)
  var attributes = {}
  for(var k in model) attributes[k] = model[k]
  console.log('attributes', attributes)
  Object.getOwnPropertyNames(model).forEach(function(k){
    var value = typeof model[k] === 'function' ? '[Function]' : model[k]
    console.log('model['+k+'] = ', value)
  })
}
