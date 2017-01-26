'use strict';

angular.module( 'd20-engine' ).factory( 'AbstractPerk', function( $log ) {
  var i = 0;
  function AbstractPerk( name ){
    this.min = 0;
    this.max = null;
    this.name = 'Perk-' + i;
    this.id = name;
    i++;
    this.description = '';
  }
  AbstractPerk.prototype.changed = function(libName, creature, changes) {
    $log.debug('Change detected on ' + libName, this, creature, changes);
  };
  return AbstractPerk;
});
