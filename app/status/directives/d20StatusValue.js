'use strict';

/* jshint unused:true */
angular.module( 'd20-engine' ).directive( 'd20StatusValue', function( ) {
  return {
    restrict : 'E',
    scope:{
      name: '@',
      for: '=',
    },
    controller : function($scope, StatusLib) {
      $scope.StatusLib = StatusLib;
    },
    templateUrl: function($elem, $attrs) {
      return 'status/views/' + ($attrs.stat ? ($attrs.stat + '_') : '') + 'value.html';
    }
  };
});
