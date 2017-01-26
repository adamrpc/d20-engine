'use strict';

angular.module( 'd20-engine' ).factory( 'AbstractStatus', function( $log ) {
  var i = 0;
  function AbstractStatus( name ){
    this.min = 0;
    this.max = null;
    this.minTime = 0;
    this.maxTime = null;
    this.name = 'Status-' + i;
    this.id = name;
    i++;
    this.description = '';
  }
  AbstractStatus.prototype.changed = function(libName, creature, changes) {
    $log.debug('Change detected on ' + libName, this, creature, changes);
  };
  return AbstractStatus;
});
