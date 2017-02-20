'use strict';

angular.module( 'd20-engine' ).factory( 'AbstractRace', function( $log ) {
  var i = 0;
  function AbstractRace( name ){
    this.feats = [];
    this.stats = [];
    this.languages = [];
    this.availableLanguages = [];
    this.name = 'Race-' + i;
    this.id = name;
    this.description = '';
    i++;
  }
  AbstractRace.prototype.changed = function(libName, creature, changes) {
    $log.debug('Change detected on ' + libName, this, creature, changes);
  };
  return AbstractRace;
});
