'use strict';

angular.module( 'd20-engine' ).factory( 'AbstractSkill', function( $log ) {
  var i = 0;
  function AbstractSkill( name ){
    this.min = 0;
    this.max = null;
    this.name = 'Skill-' + i;
    this.id = name;
    i++;
    this.description = '';
  }
  AbstractSkill.prototype.changed = function(libName, creature, changes) {
    $log.debug('Change detected on ' + libName, this, creature, changes);
  };
  return AbstractSkill;
});
