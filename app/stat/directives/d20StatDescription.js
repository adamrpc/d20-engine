'use strict';

/* jshint unused:true */
angular.module( 'd20-engine' ).directive( 'd20StatDescription', function( ) {
  return {
    restrict : 'E',
    scope:{
      name: '@',
      for: '=',
    },
    controller : function($scope, StatLib) {
      $scope.StatLib = StatLib;
    },
    templateUrl: function($elem, $attrs) {
      return 'stat/views/' + ($attrs.stat ? ($attrs.stat + '_') : '') + 'description.html';
    }
  };
});
