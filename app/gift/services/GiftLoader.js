'use strict';

angular.module( 'd20-engine' ).factory( 'GiftLoader', function( AbstractLoader ) {
  return new AbstractLoader('gift');
});
