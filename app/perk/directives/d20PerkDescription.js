'use strict';

/* jshint unused:true */
angular.module( 'd20-engine' ).directive( 'd20PerkDescription', function( ) {
  return {
    restrict : 'E',
    scope:{
      name: '@',
      for: '=',
    },
    controller : function($scope, PerkLib) {
      $scope.PerkLib = PerkLib;
    },
    templateUrl: function($elem, $attrs) {
      return 'perk/views/' + ($attrs.stat ? ($attrs.stat + '_') : '') + 'description.html';
    }
  };
});
