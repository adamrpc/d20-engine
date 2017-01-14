'use strict';

angular.module( 'd20-engine' ).factory( 'AbstractStat', function( $log, StatLib ) {
  var i = 0;
  function AbstractStat( name ){
    this.min = null;
    this.max = null;
    this.name = 'Stat-' + i;
    i++;
    this.description = '';
    StatLib.register( name, this );
  }
  AbstractStat.prototype.changed = function(libName, creature, changes) {
    $log.debug('Change detected on ' + libName, this, creature, changes);
  };
});
