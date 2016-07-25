var express = require('express')

var app = express()
var port = process.env.PORT || 3000

app.set('view engine', 'pug');

app.use(express.static('public'));

app.get('/', function(req, res){
  res.render('index', {});
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
