'use strict';

angular.module( 'd20-engine' ).factory( 'PlayerLib', function( AbstractLib ) {
  var PlayerLib = angular.copy(AbstractLib);
  angular.extend(PlayerLib.prototype, AbstractLib.prototype);
  PlayerLib.prototype.initLib = function() {
    this.registeredBuilder = {};
  };
  PlayerLib.prototype.init = function(creature, phase, builderName) {
    var sequence = ['initStats', 'initRace', 'initClass', 'initCompetencesAndGifts', 'initEquipment', 'initInducedStats'];
    if(!_.isNumber(phase) || phase < 0 || phase >= sequence.length) {
      $log.warn('Player initialization called with unknown phase, doing nothing.', phase, creature);
      return null;
    }
    if(!this.registeredBuilder[builderName || 'standard']) {
      $log.warn('Builder ' + builderName + ' not existing, changing nothing.');
      return null;
    }
    var builder = this.registeredBuilder[builderName || 'standard' ];
    var phaseMethod = sequence[phase];
    if(!_.isFunction(builder[phaseMethod])) {
      $log.warn('Builder ' + builderName + ' is not an ' + phaseMethod + ' builder, changing nothing.', builder);
      return null;
    }
    builder[phaseMethod](creature);
    return phase >= sequence.length - 1 ? null : phase + 1;
  };
  PlayerLib.prototype.registerBuilder = function(builderName, builder) {
    if(!!this.registeredBuilder[builderName]) {
      $log.warn('Builder ' + builderName + ' already defined, overwriting.', this.registeredBuilder[builderName], builder);
    }
    this.registeredBuilder[builderName] = builder;
  };
  return new PlayerLib( 'player' );
});
