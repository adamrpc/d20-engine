'use strict';

angular.module( 'd20-engine' ).factory( 'FeatLib', function( $log, SkillLib, AbstractStatLib ) {
  var FeatLib = angular.copy(AbstractStatLib);
  FeatLib.prototype = Object.create(AbstractStatLib.prototype);
  FeatLib.prototype._mergeBonuses = function(data, bonus) {
    if( _.has(bonus, 'base_bonus') && _.has(bonus, 'bonus') && _.has(bonus, 'malus') && _.has(bonus, 'bonus_limit') && _.has(bonus, 'malus_limit')) {
      data.base_bonus += bonus.base_bonus;
      data.bonus = Math.max( bonus.bonus, data.bonus );
      data.malus += bonus.malus;
      data.bonus_limit = Math.min( data.bonus_limit, bonus.bonus_limit );
      data.malus_limit += bonus.malus_limit;
    }else{
      $log.warn('Bonus does not contains requested fields, ignoring.', bonus);
    }
  };
  FeatLib.prototype.getBonus = function( creature, skill ) {
    var that = this;
    var data = {
      base_bonus: 0,
      bonus: 0,
      malus: 0,
      malus_limit: 0,
      bonus_limit: Number.POSITIVE_INFINITY
    };
    _.forOwn(creature[this.id], function(value, key) {
      if(value) {
        var bonus = that[ key ].bonus( creature, skill );
        that._mergeBonuses( data, bonus.any ? bonus.any : bonus );
      }
    });
    return data;
  };
  FeatLib.prototype.getBonuses = function( creature, skill ) {
    var that = this;
    var data = {};
    _.forOwn(creature[this.id], function(value, key) {
      if(value) {
        var bonus = that[ key ].bonus( creature, skill );
        _.forOwn( bonus, function( bonusValue, bonusKey ) {
          if( !_.has( data, bonusKey ) ) {
            data[ bonusKey ] = {
              base_bonus: 0,
              bonus: 0,
              malus: 0,
              malus_limit: 0,
              bonus_limit: Number.POSITIVE_INFINITY
            };
          }
          that._mergeBonuses( data[ bonusKey ], bonusValue );

        } );
      }
    });
    return data;
  };
  FeatLib.prototype.checkRegistering = function(name, value) {
    _.forEach(value.bonuses, function(bonus) {
      _.forEach(bonus.split(';'), function(b) {
        if(b === ''){
          return;
        }
        b += ';';
        var matches = b.match(/^((.*?)\((.*?)\)\|)?(!?([+-]|)([a-zA-Z_]+?|#)(\[(#|[a-zA-Z_]+?|([a-zA-Z_]+\()(#|[a-zA-Z_]+?)\))])?(\5[+\-*]?[0-9]+)?;)+$/);
        if(!matches) {
          $log.warn('Bad bonus formatting (' + b +') while loading feat (' + name + '), loading anyway. (' + bonus + ')');
        } else {
          if(matches[6] !== 'any' && matches[6] !== '#' && !SkillLib[matches[6]]) {
            $log.warn('Unkown skill (' + matches[6] + ') while loading feat (' + name + '), loading anyway. (' + b + ')');
          }
        }
      });
    });
  };
  return new FeatLib('feat');
});
