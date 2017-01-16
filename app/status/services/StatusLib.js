'use strict';

angular.module( 'd20-engine' ).factory( 'StatusLib', function( $log, AbstractLib, Engine ) {
  var StatusLib = angular.copy(AbstractLib);
  angular.extend(StatusLib.prototype, AbstractLib.prototype);
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
    if(parts.length !== 3 || parts[0] === '' || parts[1] === '' || parts[2] === '' || !_.includes(['-', '+', '*', '/', '='], operator) || !_.includes(['-', '+', '*', '/', '='], timeOperator) ) {
      $log.warn('StatusLib.changeStat called with bad change parameter', change);
      return null;
    }
    if( !!this.registered[parts[0]] ) {
      this.prepareChange(creature, parts[0], {
        value: this.registered[parts[0] ].min,
        time: this.registered[parts[0] ].minTime
      });
      creature[ this.libName ][ parts[ 0 ] ].value = Engine.compute( creature[ this.libName ][ parts[ 0 ] ].value, operator, parts[ 1 ], this.registered[parts[0] ].min, this.registered[parts[0] ].max );
      creature[ this.libName ][ parts[ 0 ] ].time = Engine.compute( creature[ this.libName ][ parts[ 0 ] ].time, timeOperator, parts[ 2 ], this.registered[parts[0] ].minTime, this.registered[parts[0] ].maxTime );
      if( !isNaN(this.registered[ parts[0] ].min) && creature[ this.libName ][ parts[ 0 ] ].time <= _.toNumber(this.registered[parts[0] ].min)) {
        delete creature[ this.libName ][ parts[ 0 ] ];
      }
    } else {
      this.prepareChange(creature, parts[0], {
        value: 0,
        time: 0
      });
      creature[ this.libName ][ parts[ 0 ] ].value = Engine.compute( creature[ this.libName ][ parts[ 0 ] ].value, operator, parts[ 1 ], null, null );
      creature[ this.libName ][ parts[ 0 ] ].time = Engine.compute( creature[ this.libName ][ parts[ 0 ] ].time, timeOperator, parts[ 2 ], null, null );
    }
    $log.debug(parts[0] + ' changed from ' + creature.old[this.libName][parts[0] ].value + ' to ' + creature[this.libName][parts[0] ].value, creature);
    Engine.changed(this.libName, creature, parts[0]);
  };
  return new StatusLib( 'status' );
});
