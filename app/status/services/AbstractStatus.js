'use strict';

angular.module( 'd20-engine' ).factory( 'AbstractStatus', function( $log, PerkLib ) {
  var i = 0;
  function AbstractStat( name ){
    this.min = 0;
    this.max = null;
    this.name = 'Status-' + i;
    i++;
    this.description = '';
    PerkLib.register( name, this );
  }
  AbstractStat.prototype.changed = function(libName, creature, changes) {
    $log.debug('Change detected on ' + libName, this, creature, changes);
  };
});