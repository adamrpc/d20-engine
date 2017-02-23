'use strict';

angular.module( 'd20-engine' ).factory( 'SkillLoader', function( AbstractLoader ) {
  return new AbstractLoader('skill');
});
