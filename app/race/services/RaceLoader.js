'use strict';

angular.module( 'd20-engine' ).factory( 'RaceLoader', function( AbstractLoader ) {
  return new AbstractLoader('race');
});
