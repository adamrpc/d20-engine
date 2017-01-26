'use strict';

angular.module( 'd20-engine' ).factory( 'AbstractStat', function( $log ) {
  var i = 0;
  function AbstractStat( name ){
    this.min = null;
    this.max = null;
    this.name = 'Stat-' + i;
    this.id = name;
    i++;
    this.description = '';
  }
  AbstractStat.prototype.changed = function(libName, creature, changes) {
    $log.debug('Change detected on ' + libName, this, creature, changes);
  };
  AbstractStat.prototype.modifier = function(creature) {
    return creature.stat[this.id] / 2 - 5;
  };
  return AbstractStat;
});
