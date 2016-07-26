var orm = require('orm')

module.exports = function(db){
  var schema = {
    name:     String,
    email:    String,
    password: String,
    passwordConfirmation: String,
  }
  return db.define("user", schema, {
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
}
