'use strict';

angular.module( 'd20-engine' ).factory( 'FeatLib', function( $log, PerkLib, AbstractStatLib ) {
  var FeatLib = angular.copy(AbstractStatLib);
  FeatLib.prototype = Object.create(AbstractStatLib.prototype);
  FeatLib.prototype.checkRegistering = function(name, value) {
    _.forEach(value.bonuses, function(bonus) {
      _.forEach(bonus.split(';'), function(b) {
        if(b === ''){
          return;
        }
        b += ';';
        var matches = b.match(/^((limit\([0-9]+[smhj]\)|skill\(([a-zA-Z_]+?|#)\)\.(lvl)(<|<=|>=|>|=|!=)[0-9]+)\|)?(!?([+-]|)([a-zA-Z_]+?|#)(\[(#|[a-zA-Z_]+?|(spell\(|effect\()(#|[a-zA-Z_]+?)\))])?(\7[+\-*]?[0-9]+|=(level|stat\[[a-zA-Z_]+?]))?;|(spell\(|effect\()(#|[a-zA-Z_]+?)\);)+$/);
        if(!matches) {
          $log.warn('Bad bonus formatting (' + b +') while loading feat (' + name + '), loading anyway. (' + bonus + ')');
        } else {
          var perk = matches[8] ? matches[8] : matches[16];
          if(perk !== 'any' && perk !== '#' && !PerkLib[perk]) {
            $log.warn('Unkown skill (' + perk + ') while loading feat (' + name + '), loading anyway. (' + b + ')');
          }
        }
      });
    });
  };
  return new FeatLib('feat');
});
