'use strict';

angular.module( 'd20-engine' ).factory( 'StatLoader', function( AbstractLoader ) {
  return new AbstractLoader('stat');
});
