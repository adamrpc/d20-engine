'use strict';

angular.module( 'd20-engine' ).factory( 'AbstractStatLib', function( $log, Engine, AbstractLib ) {
  var AbstractStatLib = angular.copy(AbstractLib);
  angular.extend(AbstractStatLib.prototype, AbstractLib.prototype);
  AbstractStatLib.prototype.initLib = function() {
    this.registered = {};
  };
  AbstractStatLib.prototype.change = function(creature, changes) {
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
  AbstractStatLib.prototype.prepareChange = function(creature, name, defaultValue, subName) {
    if(!creature[this.id]) {
      creature[this.id] = {};
    }
    if(!creature[this.id][name] && !subName) {
      creature[this.id][name] = defaultValue;
    } else if(!creature[this.id][name] && subName) {
      creature[this.id][name] = {};
    }
    if(subName && !creature[this.id][name][subName]) {
      creature[this.id][name][subName] = defaultValue;
    }
    if(!creature.old) {
      creature.old = {};
    }
    if(!creature.old[this.id]) {
      creature.old[ this.id ] = {};
    }
    if(!creature.old[this.id][name] && subName) {
      creature.old[this.id][name] = {};
    }
    if(subName) {
      creature.old[this.id][name][subName] = creature[this.id][name][subName];
    } else {
      creature.old[this.id][name] = creature[this.id][name];
    }
  };
  AbstractStatLib.prototype.changeValue = function(creature, change) {
    if(creature === undefined || change === undefined) {
      return null;
    }
    if(!_.isString(change)) {
      $log.warn('AbstractLib.changeStat called with bad change parameter', change);
      return null;
    }
    var parts = change.split(/[-+*/=]/);
    var operator = parts.length > 0 ? change.substring(parts[ 0 ].length, parts[ 0 ].length + 1) : null;
    var statNameParts = parts[0].split(/[\[\]]/);
    var statName = parts[0];
    var statSubName = null;
    if(statNameParts.length === 3 && statNameParts[2] === '' && statNameParts[1] !== '' && statNameParts[0] !== '') {
      statName = statNameParts[0];
      statSubName = statNameParts[1];
    }
    if(parts.length !== 2 || statName === '' || (statSubName === null && statNameParts.length === 3) || (statNameParts.length !== 1 && statNameParts.length !== 3) || parts[1] === '' || !_.includes(['-', '+', '*', '/', '='], operator)) {
      $log.warn('AbstractLib.changeStat called with bad change parameter', change);
      return null;
    }
    var min = !!this.registered[statName] ? this.registered[ statName ].min : null;
    var max = !!this.registered[statName] ? this.registered[ statName ].max : null;
    this.prepareChange(creature, statName, min ? min : 0, statSubName);
    if( statSubName ) {
      creature[ this.id ][ statName ][ statSubName ] = Engine.compute( creature[ this.id ][ statName ][ statSubName ], operator, parts[ 1 ], min, max );
      $log.debug(statName + '[ ' + statSubName +' ] changed from ' + creature.old[this.id][statName][ statSubName ] + ' to ' + creature[this.id][statName][ statSubName ], creature);
    } else {
      creature[ this.id ][ statName ] = Engine.compute( creature[ this.id ][ statName ], operator, parts[ 1 ], min, max );
      $log.debug(statName + ' changed from ' + creature.old[this.id][statName] + ' to ' + creature[this.id][statName], creature);
    }
    Engine.changed(this.id, creature, parts[0]);
  };
  AbstractStatLib.prototype.changed = function(libName, creature, changes) {
    _.forOwn(this.registered,  function(value) {
      value.changed(libName, creature, changes);
    });
  };
  AbstractStatLib.prototype.register = function(statName, stat) {
    if(!!this.registered[statName]) {
      $log.warn('Stat ' + statName + ' already defined, overwriting.', this.registered[statName], stat);
    }
    this.registered[statName] = stat;
  };
  return new Proxy( AbstractStatLib, {
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
