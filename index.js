var express = require('express')
var bodyParser = require('body-parser');
var cookieSession = require('cookie-session')



var app = express()
var port = process.env.PORT || 3000

var db = require('./database')

app.set('trust proxy', 1) // trust first proxy
app.set('view engine', 'pug');

app.use(express.static('public'));

app.use(db.middleware)

app.use(function(req, res, next){
  req.getCurrentUser = function(callback){
    if (req.session.userId)
      req.models.User.get(req.session.userId, function(error, currentUser){
        if (currentUser){
          console.log('currentUser', currentUser)
          callback(error, currentUser)
        }else{
          console.log('CANNOT FIDM CURETN SUSER')
          req.session = null
          res.redirect('/')
        }
      })
    else
      callback(null, null)
  }
  next();
})

app.use(cookieSession({
  name: 'fundkoala',
  keys: [
    '465d3596e8578b71ac3e5b64c48bfd87d45f683a',
    'b18177e442d2bac2b1b7a62a705e3443a9f3c363',
  ]
}))

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.get('/', function(req, res){
  req.getCurrentUser(function(error, currentUser){
    res.render('index', {currentUser: currentUser})
  })
})

app.get('/signup', function(req, res){
  res.render('signup', {
    user: new req.models.User(),
    errors: [],
  });
})

app.post('/signup', function(req, res){
  var userAttributes = req.body.user
  var user = new req.models.User(userAttributes)

  user.save(function(errors){
    console.log('saved?', user.id, user, errors)
    if (errors){
      res.render('signup', {
        user: user,
        errors: errors
      });
    }else{
      console.log('signing in as user', user.id, user)
      req.session.userId = user.id
      res.redirect('/')
    }
  })
})


app.get('/signin', function(req, res){
  if (req.session.userId){
    res.redirect('/')
    return
  }
  res.render('signin', {
    email: "",
  })
})

app.post('/signin', function(req, res){
  req.body.email
  // res.send(JSON.stringify(req.body))
  req.models.User.find({email:req.body.email, password:req.body.password}, function(error, users){
    if (users[0]){
      req.session.userId = users[0].id
      res.redirect('/')
    }else{
      res.render('signin', {
        email: req.body.email,
        loginFailed: true,
      })
    }
  })
})


app.get('/signout', function(req, res){
  req.session = null;
  res.redirect("/")
})

app.get('/about', function(req, res){
  res.render('about', {});
})

app.post('/fakebullshit', function(req, res){
  res.send('whatever');
})


// index
app.get('/funds', function(req, res){

})

// new
app.get('/funds/new', function(req, res){
  req.getCurrentUser(function(error, currentUser){
    if (!currentUser) return res.redirect('/signin')
    res.render('funds/new', {
      fund: {},
      errors: [],
    })
  })
})

// create
app.post('/funds', function(req, res){
  req.getCurrentUser(function(error, currentUser){
    if (!currentUser) return res.redirect('/signin')

    var fundParams = req.body.fund

    var fundAttributes = {
      name:               fundParams.name,
      paymentCycleLength: (fundParams.paymentCycleLength ? Number(fundParams.paymentCycleLength) : undefined),
      paymentAmount:      (fundParams.paymentAmount      ? Number(fundParams.paymentAmount) : undefined),
      cycleStartDate:     (fundParams.cycleStartDate     ? new Date(Date.parse(fundParams.cycleStartDate)) : undefined),
    }

    var fund = new req.models.Fund(fundAttributes)

    if (req.body.action === "confirm"){
      console.log('ACTION CONFIRM')
      fund.validate(function(_, errors){
        console.log('validation errors:', errors)
        if (errors){
          res.render('funds/new', {
            fund: req.body.fund,
            errors: errors
          });
        }else{
          // res.redirect('/funds/'+fund.id)
          res.render('funds/confirm', {
            fund: req.body.fund,
          });
        }
      })
      return
    }

    if (req.body.action === "edit"){
      console.log('ACTION EDIT')
      res.render('funds/new', {
        fund: req.body.fund,
      });
      return
    }

    if (req.body.action === "create"){
      console.log('ACTION CREATE')
      fund.save(function(errors){
        console.log('saved?', fund.id, errors)
        if (errors){
          res.render('funds/new', {
            fund: req.body.fund,
            errors: errors
          });
        }else{
          // fund.addMember(currentUser)

          console.log('req.models', req.models)
          var fundMembership = new req.models.FundMembership({
            fund_creator: true,
            fund_id: fund.id,
            user_id: currentUser.id,
          })

          fundMembership.save(function(error, fundMembership){
            if (error){
              res.send('ERROR'+JSON.stringify(error), 500)
            }else{
              res.redirect('/funds/'+fund.id)
            }
          })
        }
      })
      return
    }

  });
})

// show
app.get('/funds/:fundId', function(req, res){
  req.models.Fund.get(req.params.fundId, function(error, fund){
    if (!fund) return res.status(404).send('Fund Not Found')
    fund.getFundMemberships(function(error, fundMemberships){
      res.render('funds/show', {
        error: error,
        fund: fund,
        fundMemberships: fundMemberships,
      })
    })
  })
})

// edit
app.get('/funds/:fundId/edit', function(req, res){
})

// update
app.post('/funds/:fundId', function(req, res){

})

// delete
app.delete('/funds', function(req, res){

})

app.listen(port)
console.log('server started at http://0.0.0.0:'+port)
