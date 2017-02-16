'use strict';

angular.module( 'd20-engine' ).factory( 'AbstractLoader', function( $log, Engine ) {
  var AbstractLoader = function( name ) {
    this.id = name;
    this.ALL = 'all';
    this.initLoader();
    Engine.registerLoader( this.id, this);
  };
  AbstractLoader.prototype.initLoader = function() {
    this.registered = {};
  };
  AbstractLoader.prototype.load = function() {
    var args = Array.from(arguments);
    _.forOwn(this.registered,  function(value) {
      value.load.apply(value, args);
    });
  };
  AbstractLoader.prototype.register = function(name, loader) {
    if(!!this.registered[name]) {
      $log.warn('Loader ' + name + ' already defined, overwriting.', this.registered[name], loader);
    }
    this.registered[name] = loader;
  };
  return new Proxy( AbstractLoader, {
    construct: function( Target, argumentsList ) {
      var newTarget = Object.create(Target.prototype);
      return new Proxy( Target.apply(newTarget, argumentsList) || newTarget, {
        get: function( target, name ) {
          if(_.has(target.prototype, name)) {
            return target.prototype[name];
          }
          if(_.has(target.registered, name) ) {
            return target.registered[ name ];
          }
          return target[ name ];
        },
        set: function() {
          return true;
        }
      } );
    }
  } );
});
