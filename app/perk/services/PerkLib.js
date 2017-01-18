'use strict';

angular.module( 'd20-engine' ).factory( 'PerkLib', function( AbstractStatLib ) {
  return new AbstractStatLib( 'perk' );
});
