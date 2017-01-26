'use strict';

angular.module( 'd20-engine' ).factory( 'AbstractLib', function( Engine ) {
  var AbstractLib = function( name ) {
    this.id = name;
    this.initLib();
    Engine.registerLib( this.id, this);
  };
  AbstractLib.prototype.initLib = function() {};
  AbstractLib.prototype.change = function() {};
  AbstractLib.prototype.changed = function() {};
  return AbstractLib;
});
