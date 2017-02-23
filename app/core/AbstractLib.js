'use strict';

angular.module( 'd20-engine' ).factory( 'AbstractLib', function( $log, Engine ) {
  var AbstractLib = function( name ) {
    this.id = name;
    this.registered = {};
    this.initLib();
    Engine.registerLib( this.id, this);
  };
  AbstractLib.prototype.initLib = function() {};
  AbstractLib.prototype.change = function() {};
  AbstractLib.prototype.changed = function() {};
  AbstractLib.prototype.checkConditions = function( creature, name ) {
    if(!creature) {
      $log.warn('No creature provided, returning true.');
      return true;
    }
    if(_.isString( name )) {
      var statName = name.split(/[\[\]]/)[0];
      if(!!this.registered[statName]) {
        name = this.registered[statName];
      } else {
        $log.warn('Can\'t check condition of unknown stat, returning true.', name);
        return true;
      }
    }
    if(!_.has(name, 'conditions')) {
      $log.debug('Stat has no condition, returning true;');
      return true;
    }
    return !_.find( name.conditions, function(condition) {
      return !Engine.checkCondition(creature, condition);
    } );
  };
  AbstractLib.prototype.checkCondition = function() {};
  AbstractLib.prototype.checkRegistering = function() { return []; };
  AbstractLib.prototype.getValue = function(creature, name) {
    if(!_.has(creature, this.id)) {
      $log.warn(this.id + ' property not found while computing value, returning 0.');
      return 0;
    }
    var data = creature[this.id];
    var matches = name.match(/^([a-zA-Z_]+?)(\[(([a-zA-Z_]+?)|([a-zA-Z_]+)\(([a-zA-Z_]+?)\))])?$/);
    if(!matches) {
      $log.warn('Bad property formatting (' + name +') while computing value, returning 0.');
      return 0;
    }
    var part1 = matches[1];
    if(!_.has(data, part1)) {
      return 0;
    }
    data = data[part1];
    var part2 = matches[4] ? matches[4] : matches[5];
    if(part2 && !_.has(data, part2)) {
      return 0;
    } else if(!part2) {
      return data;
    }
    data = data[part2];
    var part3 = matches[6];
    if(part3 && !_.has(data, part3)) {
      return 0;
    } else if(!part3) {
      return data;
    }
    return data[part3];
  };
  AbstractLib.prototype.register = function(name, value) {
    if(!!this.registered[name]) {
      $log.warn('Stat ' + name + ' already defined, overwriting.', this.registered[name], value);
    }
    this.registered[name] = value;
    return this.checkRegistering(name, value);
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
