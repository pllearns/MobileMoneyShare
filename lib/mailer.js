var parallel = require('node-parallel');
var nodemailer = require('nodemailer');

if (process.env.NODE_ENV === "production"){
  var sgTransport = require('nodemailer-sendgrid-transport');
  var sgOptions = {
    auth: {
        api_user: process.env.SENDGRID_PASSWORD,
        api_key: process.env.SENDGRID_USERNAME
    }
  };
  console.log('USING SENDGRID' sgOptions)
  var transporter = nodemailer.createTransport(sgTransport(sgOptions));

}else{
  var transporter = nodemailer.createTransport('smtps://fundkoala@gmail.com:AEjHL4MrPoOpOROjGpkhFxvy@smtp.gmail.com');
}


var fromAddress = 'fundkoala@gmail.com'

var fundInviteSender = transporter.templateSender({
    subject: 'Join Fund: {{fundname}}',
    text: 'Hi New Koala! come join {{fundname}} by going to {{inviteLink}}',
    html: (

      '<p>If you are getting this email it’s because you are now in a special place, the home of the fund koala. Fund Koalas work together to help each other save money and use savings for life issues, buying capital goods, and possibly even bigger things like a house!So come on and join <strong><a href="{{inviteLink}}">{{fundname}}</a></strong></p>'
    ),
},{
    from: fromAddress,
});


function Mailer(options){
  this.host = options.host
}

Mailer.prototype.sendFundInvites = function(fund, callback){
  var p = parallel().timeout(3000)
  var host = this.host
  fund.invites.forEach(function(invite){
    var options = {
      to: invite.email,
    };
    var locals = {
      fundname: fund.name,
      inviteLink: host+'/invites/'+invite.code
    };
    p.add(function(done){
      fundInviteSender(options, locals, function(error, info){
        if (error) throw error;
        console.log('Sent Fund invite to '+invite.email, info)
        done(info)
      });
    });
  })

  p.done(callback)
}

module.exports = Mailer
