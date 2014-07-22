var BasePromise = require('rsvp').Promise,
  util = require('util');


function Promise () {
  BasePromise.apply(this, arguments);
}

util.inherits(Promise, BasePromise);

module.exports = {
  Promise: Promise
};