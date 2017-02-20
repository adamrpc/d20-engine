'use strict';

/* jshint unused:true */
angular.module( 'd20-engine' ).directive( 'd20SkillDescription', function( ) {
  return {
    restrict : 'E',
    scope:{
      name: '@',
      for: '=',
    },
    controller : function($scope, SkillLib) {
      $scope.SkillLib = SkillLib;
    },
    templateUrl: function($elem, $attrs) {
      return 'skill/views/' + ($attrs.stat ? ($attrs.stat + '_') : '') + 'description.html';
    }
  };
});
