'use strict';

angular.module( 'd20-engine' ).factory( 'RaceLib', function( $log, Engine, AbstractLib, StatLib, FeatLib ) {
  var RaceLib = angular.copy(AbstractLib);
  RaceLib.prototype = Object.create(AbstractLib.prototype);
  RaceLib.prototype.prepareChange = function(creature) {
    if(!creature.old) {
      creature.old = {};
    }
    creature.old[ this.id ] = creature[this.id];
  };
  RaceLib.prototype.change = function(creature, change) {
    if(creature === undefined || change === undefined) {
      return null;
    }
    if(!_.isString(change)) {
      $log.warn('RaceLib.change called with bad change parameter', change);
      return null;
    }
    if( !!this.registered[change] ) {
      $log.warn('Unknown value provided, changing anyway', change);
    }
    this.prepareChange(creature);
    creature[ this.id ] = change;
    $log.debug(this.id + ' changed from ' + creature.old[this.id] + ' to ' + creature[this.id], creature);
    Engine.changed(this.id, creature, this.id);
  };
  RaceLib.prototype.changed = function(libName, creature, changes) {
    _.forOwn(this.registered,  function(value) {
      value.changed(libName, creature, changes);
    });
  };
  RaceLib.prototype.checkCondition = function( creature, condition ) {
    var matches = condition.match(/^(\?|!)(.+)$/);
    if(!matches) {
      $log.warn('Condition is not well formatted, unable to check, returning true.', condition);
      return true;
    }
    var booleanComparison = matches[1];
    var name = matches[2];
    if(!this.registered[name]) {
      $log.warn('Check condition of unknown race, continuing anyway.', name);
    }
    var currentValue = null;
    if(_.has(creature, this.id)) {
      currentValue = creature[this.id];
    }
    switch(booleanComparison) {
      case '?':
        return currentValue === name;
      case '!':
        return currentValue !== name;
      default:
        return true;
    }
  };
  RaceLib.prototype.checkRegistering = function(name, value) {
    _.forEach(value.feats, function(feat) {
      var matches = feat.match(/^([^\[]*?)(\[(.*)])?$/);
      if(!matches) {
        $log.warn('Bad feat formatting (' + feat +') while loading race (' + name + '), loading anyway.');
      } else if(matches[1] !== 'any' && !FeatLib[matches[1]]) {
        $log.warn('Unkown feat (' + matches[1] + ') while loading race (' + name + '), loading anyway.');
      }
    });
    _.forEach(value.stats, function(stat) {
      var matches = stat.match(/^(.*)[+\-*/=][0-9]+$/);
      if(!matches) {
        $log.warn('Bad stat formatting (' + stat +') while loading race (' + name + '), loading anyway.');
      } else if(matches[1] !== 'any' && matches[1] !== 'all' && !StatLib[matches[1]]) {
        $log.warn('Unkown stat (' + matches[1] + ') while loading race (' + name + '), loading anyway.');
      }
    });
  };
  return new RaceLib('race');
});
