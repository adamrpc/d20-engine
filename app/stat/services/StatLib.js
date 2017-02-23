'use strict';

angular.module( 'd20-engine' ).factory( 'StatLib', function( AbstractStatLib ) {
  var StatLib = angular.copy(AbstractStatLib);
  StatLib.prototype = Object.create(AbstractStatLib.prototype);
  StatLib.prototype.getBonus = function( creature, stat ) {
    return _.has(creature, this.id) && _.has(creature[this.id], stat) ? Math.floor(creature[this.id][stat] / 2) - 5 : -5;
  };
  return new StatLib( 'stat' );
});
