var orm = require('orm')

module.exports = function(db, models){
  var Invite = db.define("invites", {
    code: {
      type: 'text',
      required: true,
      alwaysValidate: true,
    },
    name: {
      type: 'text',
      required: true,
      alwaysValidate: true,
    },
    email: {
      type: 'text',
      required: true,
      alwaysValidate: true,
    },
    fund_id: {
      type: 'integer',
      required: true,
      alwaysValidate: true,
    },
  }, {
    validations : {
      code: [
        orm.enforce.notEmptyString("code cannot be blank"),
      ],
      name: [
        orm.enforce.notEmptyString("name cannot be blank"),
      ],
      email: [
        orm.enforce.notEmptyString("name cannot be blank"),
      ],
    }
  });

  Invite.hasOne('fund', models.Fund, {reverse: 'invites'})

  Invite.sync()

  return Invite;
}
