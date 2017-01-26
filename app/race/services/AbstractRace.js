'use strict';

angular.module( 'd20-engine' ).factory( 'AbstractRace', function( $log ) {
  var i = 0;
  function AbstractRace( name ){
    this.perks = [];
    this.spells = [];
    this.competences = [];
    this.gifts = [];
    this.statBonuses = [];
    this.bonusRolls = [];
    this.raceTargets = [];
    this.additionalPredilectionClasses = 0;
    this.additionalCompetencePoint = 0;
    this.languages = [];
    this.availableLanguages = [];
    this.size = 'M';
    this.speed = 9;
    this.familiarWeapons = [];
    this.warWeapons = [];
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
