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

  // models.Fund.find({}, function(error, funds){
  //   if (error) return console.error(error)
  //   var fund = funds[0]
  //   inspectModelInstance(fund)
  //
  //   // user.getFundMemberships(function(error, fundMemberships){
  //   //   console.log('fundMemberships', fundMemberships)
  //   //   fundMemberships.forEach(inspectModelInstance)
  //   // })
  // })
  //
  // var invites = ['a','b','c'].map(function(x){
  //   return new models.Invite({
  //     name: x+' Smith',
  //     email: x+'@example.com',
  //     code: x+x+x+x+x,
  //   })
  // })
  //
  // var fund = new models.Fund({
  //   name: 'test fund',
  //   cycleStartDate: new Date(Date.parse('01/01/2018')),
  //   paymentCycleLength: 1,
  //   paymentAmount: 1,
  //   invites: invites
  // })
  //
  // fund.save(function(error){
  //   if (error) throw error;
  //
  //   models.Invite.find({}, function(error, allInvites){
  //     console.log('allInvites.length', allInvites.length)
  //
  //
  //   })
  //
  //   // inspectModelInstance(models.Fund)
  //
  //
  //   models.Fund.get(fund.id, function(error, fund){
  //     if (error) throw error;
  //     fund.getInvites(function(error){
  //       if (error) throw error;
  //       inspectModelInstance(fund)
  //     })
  //   })
  //
  // })


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
