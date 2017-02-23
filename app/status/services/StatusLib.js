'use strict';

angular.module( 'd20-engine' ).factory( 'StatusLib', function( $log, AbstractStatLib, Engine ) {
  var StatusLib = angular.copy(AbstractStatLib);
  StatusLib.prototype = Object.create(AbstractStatLib.prototype);
  StatusLib.prototype.changeValue = function(creature, change) {
    if(creature === undefined || change === undefined) {
      return null;
    }
    if(!_.isString(change)) {
      $log.warn('StatusLib.changeStat called with bad change parameter', change);
      return null;
    }
    var parts = change.split(/[-+*/=]/);
    var operator = parts.length > 0 ? change.substring(parts[ 0 ].length, parts[ 0 ].length + 1) : null;
    var timeOperator = parts.length > 1 ? change.substring(parts[ 0 ].length + 1 + parts[ 1 ].length, parts[ 0 ].length + 1 + parts[ 1 ].length + 1) : null;
    var statNameParts = parts[0].split(/[\[\]]/);
    var statName = parts[0];
    var statSubName = null;
    if(statNameParts.length === 3 && statNameParts[2] === '' && statNameParts[1] !== '' && statNameParts[0] !== '') {
      statName = statNameParts[0];
      statSubName = statNameParts[1];
    }
    if(parts.length !== 3 || (statSubName === null && statNameParts.length === 3) || (statNameParts.length !== 1 && statNameParts.length !== 3) || parts[1] === '' || parts[2] === '' || !_.includes(['-', '+', '*', '/', '='], operator) || !_.includes(['-', '+', '*', '/', '='], timeOperator) ) {
      $log.warn('StatusLib.changeStat called with bad change parameter', change);
      return null;
    }
    var min = !!this.registered[statName] ? this.registered[ statName ].min : null;
    var minTime = !!this.registered[statName] ? this.registered[ statName ].minTime : null;
    var max = !!this.registered[statName] ? this.registered[ statName ].max : null;
    var maxTime = !!this.registered[statName] ? this.registered[ statName ].maxTime : null;
    this.prepareChange(creature, statName, {
      value: min ? min : 0,
      time: minTime ? minTime : 0
    }, statSubName);
    if( statSubName ) {
      creature[ this.id ][ statName ][ statSubName ].value = Engine.compute( creature[ this.id ][ statName ][ statSubName ].value, operator, parts[ 1 ], min, max );
      creature[ this.id ][ statName ][ statSubName ].time = Engine.compute( creature[ this.id ][statName ][ statSubName ].time, timeOperator, parts[ 2 ], minTime, maxTime );
      if( !isNaN(min) && creature[ this.id ][ statName ][ statSubName ].time <= _.toNumber(min)) {
        delete creature[ this.id ][ statName ][ statSubName ];
      }
      $log.debug(statName + '[ ' + statSubName +' ] changed from ' + creature.old[this.id][statName][ statSubName ] + ' to ' + creature[this.id][statName][ statSubName ], creature);
    } else {
      creature[ this.id ][ statName ].value = Engine.compute( creature[ this.id ][ statName ].value, operator, parts[ 1 ], min, max );
      creature[ this.id ][ statName ].time = Engine.compute( creature[ this.id ][statName ].time, timeOperator, parts[ 2 ], minTime, maxTime );
      if( !isNaN(min) && creature[ this.id ][ statName ].time <= _.toNumber(min)) {
        delete creature[ this.id ][ statName ];
      }
      $log.debug(statName + ' changed from ' + creature.old[this.id][ statName ].value + ' to ' + creature[this.id][ statName ].value, creature);
    }
    Engine.changed(this.id, creature, parts[0]);
  };
  StatusLib.prototype.super_getValue = StatusLib.prototype.getValue;
  StatusLib.prototype.getValue = function(creature, name) {
    var value = this.super_getValue(creature, name);
    if(!_.isObject(value) || !_.has(value, 'value') || (_.has(value, 'time') && value.time <= 0)) {
      return 0;
    }
    return value.value;
  };
  return new StatusLib( 'status' );
});
