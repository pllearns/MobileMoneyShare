var express = require('express')
var bodyParser = require('body-parser');
var cookieSession = require('cookie-session')
var Mailer = require('./lib/mailer')
var uuid = require('node-uuid')
var URL = require('url')



var app = express()
var port = process.env.PORT || 3000

var db = require('./database')

app.set('trust proxy', 1) // trust first proxy
app.set('view engine', 'pug');

app.use(express.static('public'));


app.use(cookieSession({
  name: 'fundkoala',
  keys: [
    '465d3596e8578b71ac3e5b64c48bfd87d45f683a',
    'b18177e442d2bac2b1b7a62a705e3443a9f3c363',
  ]
}))

app.use(db.middleware)

app.use(function(req, res, next){
  req.mailer = new Mailer({
    host: req.protocol + '://' + req.get('host')
  })
  next();
});

app.use(function(req, res, next){
  req.currentUserId = req.session ? req.session.userId : null
  req.loggedIn = !!req.currentUserId

  req.getCurrentUser = function(callback){
    if (req.session.userId)
      req.models.User.get(req.session.userId, function(error, currentUser){
        if (currentUser){
          console.log('currentUser', currentUser)
          callback(error, currentUser)
        }else{
          req.session = null
          res.redirect('/?goto='+req.url)
        }
      })
    else
      callback(null, null)
  }
  next();
})

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.get('/', function(req, res){
  req.getCurrentUser(function(error, currentUser){
    res.render('index', {currentUser: currentUser})
  })
})

app.get('/signup', function(req, res){
  res.render('signup', {
    user: new req.models.User({
      name: req.query.name,
      email: req.query.email,
    }),
    errors: [],
    query: URL.parse(req.url).query,
    goto: req.query.goto,
  });
})

app.post('/signup', function(req, res){
  var userAttributes = req.body.user
  var user = new req.models.User(userAttributes)

  user.save(function(errors){
    if (errors){
      res.render('signup', {
        user: user,
        errors: errors,
        goto: req.body.goto,
      });
    }else{
      req.session.userId = user.id
      res.redirect(req.body.goto || '/')
    }
  })
})


app.get('/signin', function(req, res){
  if (req.session.userId){
    res.redirect('/')
    return
  }
  res.render('signin', {
    email: req.query.email,
    query: URL.parse(req.url).query,
    goto: req.query.goto,
  })
})

app.post('/signin', function(req, res){
  req.body.email
  // res.send(JSON.stringify(req.body))
  req.models.User.find({email:req.body.email, password:req.body.password}, function(error, users){
    if (users[0]){
      req.session.userId = users[0].id
      res.redirect(req.body.goto || '/')
    }else{
      res.render('signin', {
        email: req.body.email,
        loginFailed: true,
        goto: req.body.goto,
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
app.get('/', function(req, res){

})

// new
app.get('/funds/new', function(req, res){
  req.getCurrentUser(function(error, currentUser){
    if (!currentUser) return res.redirect('/signin')
    res.render('funds/new', {
      fund: {
        invites: [
          {name: '', email:''},
          {name: '', email:''},
          {name: '', email:''},
          {name: '', email:''},
        ]
      },
      errors: [],
    })
  })
})

// create
app.post('/funds', function(req, res){
  req.getCurrentUser(function(error, currentUser){
    if (!currentUser) return res.redirect('/signin')

    var fundParams = req.body.fund

    fundParams.invites = fundParams.invites.filter(function(invite){
      return invite.name && invite.email
    })
    fundParams.invites.forEach(function(invite){
      invite.code = uuid.v1()
    })

    var fundAttributes = {
      name:               fundParams.name,
      paymentCycleLength: (fundParams.paymentCycleLength ? Number(fundParams.paymentCycleLength) : undefined),
      paymentAmount:      (fundParams.paymentAmount      ? Number(fundParams.paymentAmount) : undefined),
      cycleStartDate:     (fundParams.cycleStartDate     ? new Date(Date.parse(fundParams.cycleStartDate)) : undefined),
      invites:            fundParams.invites,
    }

    var fund = new req.models.Fund(fundAttributes)

    if (req.body.action === "confirm"){
      fund.validate(function(_, errors){
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
      res.render('funds/new', {
        fund: req.body.fund,
      });
      return
    }

    if (req.body.action === "create"){
      fund.save(function(errors){
        if (errors){
          res.render('funds/new', {
            fund: req.body.fund,
            errors: errors
          });
        }else{
          var memberships = [
            new req.models.FundMembership({
              fund_creator: true,
              fund_id: fund.id,
              user_id: currentUser.id,
            })
          ]
          fund.setMemberships(memberships, function(error){
            if (error) throw error;
            // TODO send emails to invite emails
            req.mailer.sendFundInvites(fund, function(emails){
              res.redirect('/funds/'+fund.id)
            })
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
    if (error) throw error
    if (!fund) return res.status(404).send('Fund Not Found')
    fund.getInvites(function(error){
      if (error) throw error
      fund.getMemberships(function(error){
        if (error) throw error
        res.render('funds/show', {
          error: error,
          fund: fund,
        })
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

app.get('/invites/:inviteCode', function(req, res){
  var inviteCode = req.params.inviteCode
  var action = req.query.action
  req.models.Invite.one({code: inviteCode}, function(error, invite){
    if (error) throw error
    if (!invite){
      res.send('Bad invite')
      return
    }
    invite.getFund(function(error, fund){
      if (error) throw error
      fund.getMemberships(function(error){
        if (error) throw error
        if (req.loggedIn){
          var membership = fund.memberships.find(function(membership){
            return membership.user_id == req.currentUserId
          })
          if (membership){
            res.redirect('/funds/'+fund.id)
            return
          }
        }
        if (action === 'accept'){
          if (req.loggedIn){
            var membership = new req.models.FundMembership({
              fund_creator: false,
              fund_id: fund.id,
              user_id: req.currentUserId,
            })
            membership.save(function(error){
              if (error) throw error;
              res.redirect('/funds/'+fund.id)
            })
          }else{
            var signupURL = URL.format({
              pathname: '/signup',
              query: {
                goto: req.url,
                name: invite.name,
                email: invite.email,
              }
            })
            res.redirect(signupURL)
          }
          // if logged in
            // add current user as member to fund
          // else
           // redirect to login with goto callback url
        }else if (action === 'reject'){
          res.redirect('/')
        }else {
          res.render('funds/invite', {
            invite: invite,
            fund: fund,
          })
        }
      })
    })

  })

})

app.listen(port)
console.log('server started at http://0.0.0.0:'+port)
