'use strict';

angular.module( 'd20-engine' ).factory( 'PerkLib', function( AbstractLib ) {
  return new AbstractLib( 'perk' );
});
