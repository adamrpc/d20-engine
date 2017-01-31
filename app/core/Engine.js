'use strict';

angular.module( 'd20-engine' ).factory( 'Engine', function( $log ) {
  var Engine = function() {
    this.registeredLibs = {};
    this.registeredLoaders = {};
  };
  Engine.prototype.registerLib = function(libName, lib) {
    if(!!this.registeredLibs[libName]) {
      $log.warn('Lib ' + libName + ' already defined, overwriting.', this.registeredLibs[libName], lib);
    }
    this.registeredLibs[libName] = lib;
  };
  Engine.prototype.registerLoader = function(name, loader) {
    if(!!this.registeredLoaders[name]) {
      $log.warn('Loader ' + name + ' already defined, overwriting.', this.registeredLoaders[name], loader);
    }
    this.registeredLoaders[name] = loader;
  };
  Engine.prototype.load = function(name) {
    if(!this.registeredLoaders[name]) {
      $log.warn('Loader ' + name + ' not existing, loading nothing.');
      return;
    }
    this.registeredLoaders[ name ].load.apply(this.registeredLoaders[ name ], Array.from(arguments).slice(1));
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
  Engine.prototype.checkConditions = function( libName, creature, name ) {
    if(!this.registeredLibs[libName]) {
      $log.warn('Lib ' + libName + ' not existing, checking nothing, returning true.');
      return true;
    }
    return this.registeredLibs[ libName ].checkConditions(creature, name);
  };
  Engine.prototype.checkCondition = function( creature, condition ) {
    var matches = condition.match(/^(.*)\((.*)\)$/);
    if(!this.registeredLibs[matches[1]]) {
      $log.warn('Lib ' + matches[1] + ' not existing, checking nothing, returning true.');
      return true;
    }
    return this.registeredLibs[ matches[1] ].checkCondition(creature, matches[2]);
  };
  Engine.prototype.compute = function(currentValue, operator, value, min, max) {
    var rolled = this.roll( value );
    switch( operator ) {
      case '-':
        currentValue -= rolled;
        break;
      case '+':
        currentValue += rolled;
        break;
      case '*':
        currentValue *= rolled;
        break;
      case '/':
        if( rolled === 0 ) {
          $log.warn( 'Engine.compute called with bad value for operator /', value );
          return currentValue;
        }
        currentValue /= rolled;
        break;
      case '=':
        currentValue = rolled;
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
  Engine.prototype.roll = function(dices, bestDices) {
    if(dices === undefined) {
      $log.warn('Engine.roll called without parameter, returning 0');
      return 0;
    }
    var parts = [];
    if( dices.split ) {
      var rolls = dices.split(',');
      if(rolls.length > 1) {
        var that = this;
        return rolls.map(function(value) { return that.roll(value, bestDices);});
      }
      _.forEach(dices.split('d'), function(value) {
          parts.push( !isNaN(value) ? parseFloat(value) : null);
      });
    } else {
      parts.push( parseFloat(dices) );
    }
    if(parts.length === 0 || parts.length > 2 || !_.isNumber(parts[0]) || (parts.length > 1 && !_.isNumber(parts[1]))) {
      $log.warn('Engine.roll called with bad parameter, returning 0', dices);
      return 0;
    }
    if(parts.length === 1) {
      return parts[0];
    }
    if(bestDices === undefined) {
      bestDices = parts[0];
    }
    return _.sum(_.sortBy(_.range(parts[0]).map(function() {
      return Math.random(1, parts[1] + 1);
    } ), function(value) { return value;} ).slice(Math.max(0, parts[0] - bestDices)));
  };
  var EngineProxy = new Proxy( Engine, {
    construct: function( Target, argumentsList ) {
      var newTarget = Object.create(Target.prototype);
      return new Proxy( Target.apply(newTarget, argumentsList) || newTarget, {
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
