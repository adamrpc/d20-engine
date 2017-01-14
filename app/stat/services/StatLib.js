'use strict';

angular.module( 'd20-engine' ).factory( 'StatLib', function( AbstractLib ) {
  return new AbstractLib( 'stat' );
});
