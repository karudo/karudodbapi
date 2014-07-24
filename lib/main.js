var fs = require('fs'),
  path = require('path'),
  lodash = require('lodash'),
  promise = require('./promise');


function Main(config) {
  var _this = this;
  this.pastures = {};
  this.drivers = {};
  this.connections = {};
  if (!config.driversDir) {
    config.driversDir = path.join(__dirname, 'drivers');
  }
  this.addDriversDir(config.driversDir);

  if (config.pastures) {
    lodash.forEach(config.pastures, function(vars, id) {
      _this.addPasture(id, vars);
    });
  }

  this.config = config;
}

Main.prototype.addPasture = function(id, vars) {
  this.pastures[id] = vars;
};

Main.prototype.addDriversDir = function(driversDir) {
  var _this = this,
    dirs = fs.readdirSync(driversDir);
  dirs.forEach(function(code) {
    var driver = require( path.join(driversDir, code) );
    _this.addDriver(code, driver);
  });
};

Main.prototype.addDriver = function(code, driver) {
  this.drivers[code] = driver;
};

Main.prototype.getConnection = function(pastureId) {
  var connections = this.connections;
  if (!this.pastures[pastureId]) {
    return Promise.reject('no pasture');
  }
  if (!connections[pastureId]) {
    var pasture = this.pastures[pastureId],
      driverCode = pasture.driver,
      driverClass = this.drivers[driverCode],
      driverInstance = new driverClass(pasture.params);
    connections[pastureId] = driverInstance;
    driverInstance.on('disconnect', function() {
      delete connections[pastureId];
    });
  }
  return Promise.resolve(this.connections[pastureId]);
}

Main.prototype.getCollection = function(pastureId, collPath) {
  return this.getConnection(pastureId).then(function(connection) {
    return connection.getCollection(collPath);
  });
};

Main.prototype.execCollectionMethod = function(pastureId, collPath, method, args) {
  return this.getCollection(pastureId, collPath).then(function(collection) {
    return collection.execMethod(method, args);
  })
}

module.exports = Main;
