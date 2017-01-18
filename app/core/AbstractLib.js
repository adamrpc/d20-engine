'use strict';

angular.module( 'd20-engine' ).factory( 'AbstractLib', function( $log, Engine ) {
  var AbstractLib = function( libName ) {
    this.libName = libName;
    this.initLib();
    Engine.registerLib( this.libName, this);
  };
  AbstractLib.prototype.initLib = function() {};
  AbstractLib.prototype.init = function() { return null; };
  AbstractLib.prototype.change = function() {};
  AbstractLib.prototype.changed = function(libName, creature, changes) {};
  return AbstractLib;
});
