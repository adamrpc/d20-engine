'use strict';

angular.module( 'd20-engine' ).factory( 'AbstractGift', function( $log ) {
  var i = 0;
  function AbstractGift( name ){
    this.min = 0;
    this.max = 1;
    this.conditions = [];
    this.name = 'Gift-' + i;
    this.id = name;
    this.description = '';
    this.bonuses = [];
    this.hidden = false;
    i++;
  }
  AbstractGift.prototype.changed = function(libName, creature, changes) {
    $log.debug('Change detected on ' + libName, this, creature, changes);
  };
  return AbstractGift;
});
