'use strict';

angular.module( 'd20-engine' ).factory( 'SkillLib', function( AbstractStatLib ) {
  return new AbstractStatLib( 'skill' );
});
