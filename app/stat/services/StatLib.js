'use strict';

angular.module( 'd20-engine' ).factory( 'StatLib', function( AbstractStatLib ) {
  return new AbstractStatLib( 'stat' );
});
