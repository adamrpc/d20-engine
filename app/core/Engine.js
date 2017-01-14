'use strict';

angular.module( 'd20-engine' ).factory( 'Engine', function( $log ) {
  var Engine = function() {
    this.registeredLibs = {};
  };
  Engine.prototype.registerLib = function(libName, lib) {
    if(!!this.registeredLibs[libName]) {
      $log.warn('Lib ' + libName + ' already defined, overwriting.', this.registeredLibs[libName], lib);
    }
    this.registeredLibs[libName] = lib;
  };
  Engine.prototype.change = function(libName, creature, changes) {
    if(!this.registeredLibs[libName]) {
      $log.warn('Lib ' + libName + ' not existing, changing nothing.');
      return;
    }
    this.registeredLibs[ libName ].change(creature, changes);
  };
  Engine.prototype.changed = function(libName, creature, changes) {
    if(!this.registeredLibs[libName]) {
      $log.warn('Lib ' + libName + ' not existing, changing nothing.');
      return;
    }
    _.forOwn(this.registeredLibs, function(value) {
      value.changed(libName, creature, changes);
    });
  };
  Engine.prototype.compute = function(currentValue, operator, value, min, max) {
    switch( operator ) {
      case '-':
        currentValue -= this.roll( value );
        break;
      case '+':
        currentValue += this.roll( value );
        break;
      case '*':
        currentValue *= this.roll( value );
        break;
      case '/':
        currentValue /= this.roll( value );
        break;
      case '=':
        currentValue = this.roll( value );
        break;
      default:
        $log.warn( 'Engine.compute called with bad operator', operator );
        return currentValue;
    }
    if( !isNaN( min ) ) {
      currentValue = Math.max( _.toNumber( min ), currentValue );
    }
    if( !isNaN( max ) ) {
      currentValue = Math.min( _.toNumber( max ), currentValue );
    }
    return currentValue;
  };
  Engine.prototype.roll = function(dices) {
    if(dices === undefined) {
      $log.warn('Engine.roll called without parameter, returning 0');
      return 0;
    }
    var parts = dices.split('d');
    if(parts.length === 0 || parts.length > 2 || !_.isNumber(parts[0]) || !_.isNumber(parts[1])) {
      $log.warn('Engine.roll called with bad parameter, returning 0', dices);
      return 0;
    }
    if(parts.length === 1) {
      return parts[0];
    }
    var result = 0;
    _.forEach(_.range(parts[0]), function() {
      result += Math.random(1, parts[1] + 1);
    });
    return result;
  };
  var EngineProxy = new Proxy( Engine, {
    construct: function( Target ) {
      return new Proxy( new Target(), {
        get: function( target, name ) {
          if(_.has(target.prototype, name)) {
            return target.prototype[name];
          }
          if(_.has(target.registeredLibs, name) ) {
            return target.registeredLibs[ name ];
          }
          return target[ name ];
        },
        set: function() {
          return true;
        }
      } );
    }
  } );
  return new EngineProxy();
});
