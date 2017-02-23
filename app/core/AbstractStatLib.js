'use strict';

angular.module( 'd20-engine' ).factory( 'AbstractStatLib', function( $log, Engine, AbstractLib ) {
  var AbstractStatLib = angular.copy(AbstractLib);
  AbstractStatLib.prototype = Object.create(AbstractLib.prototype);
  AbstractStatLib.prototype.change = function(creature, changes) {
    if(creature === undefined || changes === undefined) {
      return;
    }
    if(!_.isString(changes)) {
      $log.warn('AbstractStatLib.change called with bad changes parameter', changes);
      return;
    }
    var that = this;
    _.forEach(changes.split(','),  function(value) {
      that.changeValue(creature, value);
    });
  };
  AbstractStatLib.prototype.prepareChange = function(creature, name, defaultValue, subName, subSubName, any) {
    if(!creature[this.id]) {
      creature[this.id] = {};
    }
    if(!creature[this.id][name] && !subName) {
      creature[this.id][name] = any ? {any: defaultValue} : defaultValue;
    } else if(!creature[this.id][name] && subName) {
      creature[this.id][name] = {};
    }
    if(subName && !creature[this.id][name][subName] && !subSubName) {
      creature[this.id][name][subName] = any ? {any: defaultValue} : defaultValue;
    } else if(subName && !creature[this.id][name][subName] && subSubName) {
      creature[this.id][name][subName] = {};
    }
    if(subName && subSubName && !creature[this.id][name][subName][subSubName]) {
      creature[this.id][name][subName][subSubName] = defaultValue;
    }
    if(!creature.old) {
      creature.old = {};
    }
    if(!creature.old[this.id]) {
      creature.old[ this.id ] = {};
    }
    if(subName && !creature.old[this.id][name]) {
      creature.old[this.id][name] = {};
    }
    if(subName && subSubName && !creature.old[this.id][name][subName]) {
      creature.old[this.id][name][subName] = {};
    }
    if(subName && subSubName) {
      creature.old[this.id][name][subName][subSubName] = creature[this.id][name][subName][subSubName];
    } else if(subName) {
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
      $log.warn('AbstractStatLib.changeStat called with bad change parameter', change);
      return null;
    }
    var parts = change.match(/^(([a-zA-Z_]+?)(\[(([a-zA-Z_]+?)|([a-zA-Z_]+)\(([a-zA-Z_]+?)\))])?)([-+*/=])([0-9]+|[0-9]+d[0-9]+)$/);
    if(!parts || !parts[2] || !parts[8]) {
      $log.warn('AbstractStatLib.changeStat called with bad change parameter', change);
      return null;
    }
    var operator = parts[8];
    var statName = parts[2];
    var statSubName = parts[5] ? parts[5] : parts[6];
    var statSubSubName = parts[7];
    if( !!this.registered[statName] ) {
      $log.warn('Unknown value provided, changing anyway', statName);
    }
    var min = !!this.registered[statName] ? this.registered[ statName ].min : null;
    var max = !!this.registered[statName] ? this.registered[ statName ].max : null;
    this.prepareChange(creature, statName, min ? min : 0, statSubName, statSubSubName, true);
    if( statSubSubName ) {
      creature[ this.id ][ statName ][ statSubName ][statSubSubName] = Engine.compute( creature[ this.id ][ statName ][ statSubName ][statSubSubName], operator, parts[ 9 ], min, max );
      $log.debug(statName + '[ ' + statSubName +' ][ ' + statSubSubName +' ] changed from ' + creature.old[this.id][statName][ statSubName ][statSubSubName] + ' to ' + creature[this.id][statName][ statSubName ][statSubSubName], creature);
    } else if( statSubName ) {
      creature[ this.id ][ statName ][ statSubName ].any = Engine.compute( creature[ this.id ][ statName ][ statSubName ].any, operator, parts[ 9 ], min, max );
      $log.debug(statName + '[ ' + statSubName +' ] changed from ' + creature.old[this.id][statName][ statSubName ] + ' to ' + creature[this.id][statName][ statSubName ], creature);
    } else {
      creature[ this.id ][ statName ].any = Engine.compute( creature[ this.id ][ statName ].any, operator, parts[ 9 ], min, max );
      $log.debug(statName + ' changed from ' + creature.old[this.id][statName] + ' to ' + creature[this.id][statName], creature);
    }
    Engine.changed(this.id, creature, parts[1]);
  };
  AbstractStatLib.prototype.changed = function(libName, creature, changes) {
    _.forOwn(this.registered,  function(value) {
      value.changed(libName, creature, changes);
    });
  };
  AbstractStatLib.prototype.checkCondition = function( creature, condition ) {
    if(!creature) {
      $log.warn('No creature provided, returning true.');
      return true;
    }
    if(!condition) {
      $log.info('No condition provided, returning true.');
      return true;
    }
    var matches = condition.match(/^(([a-zA-Z_]+?)(\[(([a-zA-Z_]+?)|([a-zA-Z_]+)\(([a-zA-Z_]+?)\))])?)((>|<|>=|<=|=|!=)([0-9.]+)|(\?|!))$/);
    if(!matches) {
      $log.warn('Condition is not well formatted, unable to check, returning true.', condition);
      return true;
    }
    var numericComparison = matches[9];
    var numericValue = matches[10];
    var booleanComparison = matches[11];
    var currentValue = this.getValue(creature, matches[1]);
    if(numericComparison) {
      numericValue = parseFloat(numericValue);
      switch(numericComparison) {
        case '>':
          return currentValue > numericValue;
        case '<':
          return currentValue < numericValue;
        case '>=':
          return currentValue >= numericValue;
        case '<=':
          return currentValue <= numericValue;
        case '=':
          return currentValue === numericValue;
        case '!=':
          return currentValue !== numericValue;
        default:
          return true;
      }
    }
    if(booleanComparison) {
      switch(booleanComparison) {
        case '?':
          return !!currentValue || currentValue > 0;
        case '!':
          return !currentValue || currentValue <= 0;
        default:
          return true;
      }
    }
  };
  AbstractStatLib.prototype.getValue = function(creature, name) {
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
    if((!part2 || (part2 && !_.has(data, part2))) && _.isObject(data) && !_.has(data, 'any')) {
      return 0;
    } else if((part2 && !_.has(data, part2) && !_.isObject(data)) || (!part2 && !_.isObject(data))) {
      return data;
    } else if((!part2 || !_.has(data, part2)) && _.isObject(data) && _.has(data, 'any')) {
      return data.any;
    }
    data = data[part2];
    var part3 = matches[6];
    if((!part3 || (part3 && !_.has(data, part3))) && _.isObject(data) && !_.has(data, 'any')) {
      return 0;
    } else if((part3 && !_.has(data, part3) && !_.isObject(data)) || (!part3 && !_.isObject(data))) {
      return data;
    } else if((!part3 || !_.has(data, part3)) && _.isObject(data) && _.has(data, 'any')) {
      return data.any;
    }
    return data[part3];
  };
  return AbstractStatLib;
});
