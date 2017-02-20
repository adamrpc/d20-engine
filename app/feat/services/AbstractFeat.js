'use strict';

angular.module( 'd20-engine' ).factory( 'AbstractFeat', function( $log ) {
  var i = 0;
  function AbstractFeat( name ){
    this.min = 0;
    this.max = 1;
    this.conditions = [];
    this.name = 'Feat-' + i;
    this.id = name;
    this.description = '';
    this.bonuses = [];
    this.hidden = false;
    i++;
  }
  AbstractFeat.prototype.changed = function(libName, creature, changes) {
    $log.debug('Change detected on ' + libName, this, creature, changes);
  };
  return AbstractFeat;
});
