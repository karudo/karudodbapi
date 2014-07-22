var fs = require('fs'),
  path = require('path'),
  lodash = require('lodash');


function Main(config) {
  var _this = this;
  this.pastures = {};
  this.drivers = {};
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

Main.prototype.getCollection = function(fullCollPath) {
  var _splitedFCP = (fullCollPath+'').split('#'),
    pastureId = _splitedFCP[0],
    collPath = _splitedFCP[1];
};

Main.prototype.execCollectionMethod = function(fullCollPath, method, args) {

}

module.exports = Main;
