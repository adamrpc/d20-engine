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
    i++;
  }
  AbstractGift.prototype.activate = function() {
    $log.warn('Gift ' + this.id + ' activation method undefined, doing nothing.', this);
  };
  AbstractGift.prototype.changed = function(libName, creature, changes) {
    $log.debug('Change detected on ' + libName, this, creature, changes);
  };
  return AbstractGift;
});
