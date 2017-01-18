'use strict';

angular.module( 'd20-engine' ).factory( 'PlayerLib', function( AbstractLib, Engine ) {
  var PlayerLib = angular.copy(AbstractLib);
  angular.extend(PlayerLib.prototype, AbstractLib.prototype);
  PlayerLib.prototype.init = function(creature, phase) {
    var sequence = ['initStats', 'initRace', 'initJob', 'initPerksAndGifts', 'initEquipment', 'initInducedStats'];
    if(!_.isNumber(phase) || phase < 0 || phase >= sequence.length) {
      $log.warn('Player initialization called with unknown phase, doing nothing.', phase, creature);
      return null;
    }
    this[sequence[phase]].apply(this, [creature].concat(Array.prototype.slice.call(arguments, 2)));
    return phase >= sequence.length - 1 ? null : phase + 1;
  };
  PlayerLib.prototype.initStats = function(creature, changes) {
    Engine.change( 'stat', creature, changes);
  };
  PlayerLib.prototype.initRace = function(creature, race) {
    Engine.change( 'race', creature, race );
  };
  PlayerLib.prototype.initJob = function(creature, job) {
    Engine.change( 'job', creature, job );
  };
  PlayerLib.prototype.initPerksAndGifts = function(creature, perks, gifts) {
    Engine.change( 'perk', creature, perks);
    Engine.change( 'gift', creature, gifts);
  };
  PlayerLib.prototype.initEquipment = function(creature, items) {
    Engine.change( 'item', creature, items );
  };
  PlayerLib.prototype.initInducedStats = function(creature, changes) {
    Engine.change( 'stat', creature, changes);
  };
  return new PlayerLib( 'player' );
});
