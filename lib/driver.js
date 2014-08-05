var lodash = require('lodash'),
  promise = require('./promise'),
  Collection = require('./collection');

function Driver (driverObject, params) {
  this._collections = {};
  if (!lodash.isFunction(driverObject.getSchema)) {
    throw new Error('getSchema is not function');
  }
  this.driverObject = driverObject;
  this.params = params;
  if (lodash.isFunction(driverObject.init)) {
    driverObject.init.call(this);
  }
}

Driver.prototype.getSchema = function() {
  return this.driverObject.getSchema.call(this);
};

Driver.prototype.getCollection = function(collUrl) {
  if (!this._collections[collUrl]) {
    var pathArr, coll, collectionParams, initFuncs,
      _this = this;

    pathArr = collUrl.split('/').map(function(v) {
      var _ref = v.split(':');
      return {
        name: _ref[0],
        query: _ref[1]
      };
    });

    initFuncs = [];

    collectionParams = pathArr.reduce(function(curSchema, pathStep, idx) {
      var curCollectionParams, iFunc, _base, _ref;
      curCollectionParams = ((_ref = curSchema.childs) != null) && _ref[pathStep.name];
      if (!(curCollectionParams && curCollectionParams.methods)) {
        throw new Error("can't find methods for " + pathStep.name);
      }
      if (idx + 1 < pathArr.length) {
        if (curCollectionParams.methods._getInitFunction) {
          iFunc = curCollectionParams.methods._getInitFunction();
          initFuncs.push(iFunc);
        }
      }
      return curCollectionParams;
    }, {
      childs: this.getSchema()
    });

    //TODO need to implement
    coll = new Collection(collectionParams, this, pathArr);

    if (initFuncs.length) {
      coll.initFuncs = initFuncs;
    }

    this._collections[collUrl] = coll;

  }
  return this._collections[collUrl];
};

module.exports = Driver;