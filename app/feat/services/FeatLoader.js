'use strict';

angular.module( 'd20-engine' ).factory( 'FeatLoader', function( AbstractLoader ) {
  return new AbstractLoader('feat');
});
