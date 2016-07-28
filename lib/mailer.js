var parallel = require('node-parallel');

var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport('smtps://fundkoala@gmail.com:$awesome$@smtp.gmail.com');

var fromAddress = 'fundkoala@gmail.com'

var fundInviteSender = transporter.templateSender({
    subject: 'Join Fund: {{fundname}}',
    text: 'come join {{fundname}}',
    html: '<p>come join <strong>{{fundname}}</strong></p>',
},{
    from: fromAddress,
});


var mailer = {
  sendFundInvites: function(fund, callback){
    var p = parallel().timeout(3000)
    fund.invites.forEach(function(invite){
      var options = {
        to: invite.email,
      };
      var locals = {
        fundname: fund.name,
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
}

module.exports = mailer
