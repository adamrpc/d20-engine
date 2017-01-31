'use strict';

angular.module( 'd20-engine' ).factory( 'GiftLib', function( AbstractStatLib ) {
  return new AbstractStatLib('gift');
});
