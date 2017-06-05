'use strict'

var orm = require('orm')

module.exports = function(db){
  let User = db.define("users", {
      id: {
        type: 'serial',
        key: true
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
      password: {
        type: 'text',
        required: true,
        alwaysValidate: true,
      },
      passwordConfirmation: {
        type: 'text',
        required: true,
        alwaysValidate: true,
      },
    }, {
    validations : {
      name: [
        orm.enforce.notEmptyString("name cannot be blank"),
      ],
      email: [
        orm.enforce.unique("email already taken"),
        orm.enforce.notEmptyString("email cannot be blank"),
      ],
      password: [
        orm.enforce.notEmptyString("password cannot be blank"),
      ],
      passwordConfirmation: [
        orm.enforce.equalToProperty('password', 'does not match password')
      ],
    }
  });

  User.sync();

  return User;
}
