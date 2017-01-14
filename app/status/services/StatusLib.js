'use strict';

angular.module( 'd20-engine' ).factory( 'StatusLib', function( $log, AbstractLib, Engine ) {
  var StatusLib = new AbstractLib( 'status' );
  StatusLib.changeStat = function(creature, change) {
    if(creature === undefined || change === undefined) {
      return null;
    }
    if(!_.isString(change)) {
      $log.warn('StatusLib.changeStat called with bad change parameter', change);
      return null;
    }
    var parts = change.split('[-+*/=]');
    var operator = change.substring(parts[ 0 ].length, parts[ 0 ].length + 1);
    var timeOperator = change.substring(parts[ 0 ].length + 1 + parts[ 1 ].length, parts[ 0 ].length + 1 + parts[ 1 ].length + 1);
    if(!isNaN(parts[1])) {
      parts[1] = _.toNumber(parts[1]);
    }
    if(!isNaN(parts[2])) {
      parts[2] = _.toNumber(parts[2]);
    }
    if(parts.length !== 3 || !_.find(['-', '+', '*', '/', '='], operator) || !_.find(['-', '+', '*', '/', '='], timeOperator) || !_.isNumber(parts[1]) || !_.isNumber(parts[2]) ) {
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
        value: null,
        time: null
      });
      creature[ this.libName ][ parts[ 0 ] ].value = Engine.compute( creature[ this.libName ][ parts[ 0 ] ].value, operator, parts[ 1 ], null, null );
      creature[ this.libName ][ parts[ 0 ] ].time = Engine.compute( creature[ this.libName ][ parts[ 0 ] ].time, timeOperator, parts[ 2 ], null, null );
    }
    $log.debug(parts[0] + ' changed from ' + creature.old[this.libName][parts[0]] + ' to ' + creature[this.libName][parts[0]], creature);
    Engine.changed(this.libName, creature, parts[0]);
  };
});
