'use strict'

var orm = require('orm')

module.exports = function(db, models){
  let FundMembership = db.define("fund_memberships", {
      id: {
        type: 'serial',
        key: true
      },
      user_id: {
        type: 'integer',
        required: true,
        alwaysValidate: true,
      },
      fund_id: {
        type: 'integer',
        required: true,
        alwaysValidate: true,
      },
      fund_creator: {
        type: 'boolean',
        default: false,
        required: true,
      },
      email: {
        type: 'text',
        // required: true,
        // alwaysValidate: true,
      },
      invite_code: {
        type: 'text',
        // required: true,
        // alwaysValidate: true,
      },
    }, {
    validations : {
      email: [
        // orm.enforce.unique("email already taken"),
        orm.enforce.notEmptyString("email cannot be blank"),
      ],
      invite_code: [
        orm.enforce.notEmptyString("invite code cannot be blank"),
      ],
    }
  });

  FundMembership.hasOne('user', models.User, {reverse: 'fundMemberships'})
  FundMembership.hasOne('fund', models.Fund, {reverse: 'memberships'})

  FundMembership.sync();

  return FundMembership;
}
