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
  if (req.session.userId){
    req.models.user.get(req.session.userId, function(error, user){
      if (error) throw error;
      res.render('index', {user: user})
    })
  }else{
    res.render('index', {user: null})
  }
})

app.get('/signup', function(req, res){
  res.render('signup', {
    user: new req.models.user(),
    errors: [],
  });
})

app.post('/signup', function(req, res){
  var userAttributes = req.body.user
  var user = new req.models.user(userAttributes)

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
  req.models.user.find({email:req.body.email, password:req.body.password}, function(error, users){
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

app.get('/funds/:fundSlug', function(req, res){
  var fundSlug = req.params.fundSlug

  // TODO get this from the Database
  var fund = {
    id: 456,
    slug: fundSlug,
    name: 'Sally Needs A Laptop',
    cycleStartDate: new Date,
    cycleAmount: '20000', // cents ($200)
    cycleLength: 7, // days
  };

  res.render('funds/show', {
    fund: fund
  });
})

app.listen(port)
console.log('server started at http://0.0.0.0:'+port)
