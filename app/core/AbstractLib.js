'use strict';

angular.module( 'd20-engine' ).factory( 'AbstractLib', function( $log, Engine ) {
  var AbstractLib = function( libName ) {
    this.libName = libName;
    this.registered = {};
    Engine.registerLib( this.libName, this);
  };
  AbstractLib.prototype.change = function(creature, changes) {
    if(creature === undefined || changes === undefined) {
      return;
    }
    if(!_.isString(changes)) {
      $log.warn('AbstractLib.change called with bad changes parameter', changes);
      return;
    }
    var that = this;
    _.forEach(changes.split(','),  function(value) {
      that.changeValue(creature, value);
    });
  };
  AbstractLib.prototype.prepareChange = function(creature, name, defaultValue) {
    if(!creature[this.libName]) {
      creature[this.libName] = {};
    }
    if(!creature[this.libName][name]) {
      creature[this.libName][name] = defaultValue;
    }
    if(!creature.old) {
      creature.old = {};
    }
    if(!creature.old[this.libName]) {
      creature.old[ this.libName ] = {};
    }
    creature.old[this.libName][name] = creature[this.libName][name];
  };
  AbstractLib.prototype.changeValue = function(creature, change) {
    if(creature === undefined || change === undefined) {
      return null;
    }
    if(!_.isString(change)) {
      $log.warn('AbstractLib.changeStat called with bad change parameter', change);
      return null;
    }
    var parts = change.split(/[-+*/=]/);
    var operator = change.substring(parts[ 0 ].length, parts[ 0 ].length + 1);
    if(parts.length !== 2 || parts[0] === '' || parts[1] === '' || !_.includes(['-', '+', '*', '/', '='], operator)) {
      $log.warn('AbstractLib.changeStat called with bad change parameter', change);
      return null;
    }
    if( !!this.registered[parts[0]] ) {
      this.prepareChange(creature, parts[0], this.registered[ parts[0] ].min);
      creature[ this.libName ][ parts[ 0 ] ] = Engine.compute( creature[ this.libName ][ parts[ 0 ] ], operator, parts[ 1 ], this.registered[ parts[0] ].min, this.registered[ parts[0] ].max );
    } else {
      this.prepareChange(creature, parts[0], 0);
      creature[ this.libName ][ parts[ 0 ] ] = Engine.compute( creature[ this.libName ][ parts[ 0 ] ], operator, parts[ 1 ], null, null );
    }
    $log.debug(parts[0] + ' changed from ' + creature.old[this.libName][parts[0]] + ' to ' + creature[this.libName][parts[0]], creature);
    Engine.changed(this.libName, creature, parts[0]);
  };
  AbstractLib.prototype.changed = function(libName, creature, changes) {
    _.forOwn(this.registered,  function(value) {
      value.changed(libName, creature, changes);
    });
  };
  AbstractLib.prototype.register = function(statName, stat) {
    if(!!this.registered[statName]) {
      $log.warn('Stat ' + statName + ' already defined, overwriting.', this.registered[statName], stat);
    }
    this.registered[statName] = stat;
  };
  return new Proxy( AbstractLib, {
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
