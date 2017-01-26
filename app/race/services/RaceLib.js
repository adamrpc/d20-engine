'use strict';

angular.module( 'd20-engine' ).factory( 'RaceLib', function( $log, Engine, AbstractLib ) {
  var RaceLib = angular.copy(AbstractLib);
  angular.extend(RaceLib.prototype, AbstractLib.prototype);
  RaceLib.prototype.initLib = function() {
    this.registered = {};
  };
  RaceLib.prototype.prepareChange = function(creature) {
    if(!creature.old) {
      creature.old = {};
    }
    creature.old[ this.id ] = creature[this.id];
  };
  RaceLib.prototype.change = function(creature, change) {
    if(creature === undefined || change === undefined) {
      return null;
    }
    if(!_.isString(change)) {
      $log.warn('AbstractLib.changeStat called with bad change parameter', change);
      return null;
    }
    if( !!this.registered[change] ) {
        $log.warn('Unknown value provided, changing anyway', change);
    }
    this.prepareChange(creature);
    creature[ this.id ] = change;
    $log.debug(this.id + ' changed from ' + creature.old[this.id] + ' to ' + creature[this.id], creature);
    Engine.changed(this.id, creature, this.id);
  };
  RaceLib.prototype.changed = function(libName, creature, changes) {
    _.forOwn(this.registered,  function(value) {
      value.changed(libName, creature, changes);
    });
  };
  RaceLib.prototype.register = function(raceName, race) {
    if(!!this.registered[raceName]) {
      $log.warn('Race ' + raceName + ' already defined, overwriting.', this.registered[raceName], race);
    }
    this.registered[raceName] = race;
  };
  return new Proxy( RaceLib, {
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
