var orm = require('orm')

module.exports = function(db, models){
  var Fund = db.define("funds", {
    name: {
      type: 'text',
      required: true,
      alwaysValidate: true,
    },
    cycleStartDate: {
      type: 'date',
      required: true,
      alwaysValidate: true,
    },
    paymentCycleLength: {
      type: 'integer',
      required: true,
      alwaysValidate: true,
    },
    paymentAmount: {
      type: 'integer',
      required: true,
      alwaysValidate: true,
    },
  }, {
    validations : {
      name: [
        orm.enforce.notEmptyString("name cannot be blank"),
      ],
      cycleStartDate: [
        // orm.enforce.notEmptyString("cycleStartDate cannot be blank"),
        dateValidator,
      ],
      paymentCycleLength: [
        orm.validators.rangeNumber(1, 31, "paymentCycleLength must be between 1 and 31"),
      ],
      paymentAmount: [
        orm.validators.rangeNumber(1, 999999, "must be a positive dollar amount"),
      ]
    }
  });

  Fund.sync()

  return Fund;
}


function dateValidator(value, next){
  console.log('dateValidator', [value])
  const now = new Date
  if (value && value instanceof Date && value.getTime() > now.getTime()){
    next()
  }else{
    next("must be a valid date in the future")
  }
}


function paymentAmountValidator(value, next){
  console.log('paymentAmountValidator', [value])
  next()
}
