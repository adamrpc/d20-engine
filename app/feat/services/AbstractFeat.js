'use strict';

angular.module( 'd20-engine' ).factory( 'AbstractFeat', function( $log, Engine ) {
  var i = 0;
  function AbstractFeat( name ){
    this.min = 0;
    this.max = 1;
    this.conditions = [];
    this.name = 'Feat-' + i;
    this.id = name;
    this.description = '';
    this.bonuses = [];
    this.hidden = false;
    i++;
  }
  AbstractFeat.prototype.changed = function(libName, creature, changes) {
    $log.debug('Change detected on ' + libName, this, creature, changes);
  };
  AbstractFeat.prototype._checkBonus = function(type, creature, skill1, skill2, skill3) {
    $log.debug('############ Begin _checkBonus #####################');
    var multipleBonuses = skill1 === 'any' || skill2 === 'any' || skill3 === 'any';
    var result = {};
    if(!multipleBonuses) {
      result.baseBonus = 0;
      result.bonus = 0;
      result.malus = 0;
      result.malusLimit = 0;
      result.bonusLimit = Number.POSITIVE_INFINITY;
    }else{
      result.any = {
        baseBonus: 0,
        bonus: 0,
        malus: 0,
        malusLimit: 0,
        bonusLimit: Number.POSITIVE_INFINITY
      };
    }
    var regex = new RegExp('^(!?)([+-]|)(([a-zA-Z_]+?|#)(\\[((#)|([a-zA-Z_]+?)|([a-zA-Z_]+)\\((#|[a-zA-Z_]+?)\\))])?)((\\2[+\\-*]?)([0-9]+))?;?$'.replace('#', Engine.quote(type)));
    _.forEach(this.bonuses, function(bonus) {
      bonus = bonus.replace('#', Engine.quote(type));
      var parts = bonus.split('|');
      if((parts.length > 1 && Engine.checkCondition(creature, parts[0])) || parts.length === 1) {
        var bonusMatch = (parts.length > 1 ? parts[1] : parts[0]).match( regex );
        if( bonusMatch ) {
          var toCheck = null;
          var bonusSkill1 = bonusMatch[ 4 ];
          var bonusSkill2 = bonusMatch[ 7 ] ? bonusMatch[ 7 ] : (bonusMatch[ 8 ] ? bonusMatch[ 8 ] : bonusMatch[ 9 ]);
          var bonusSkill3 = bonusMatch[ 10 ];
          $log.debug(bonusSkill1, bonusSkill2, bonusSkill3, skill1, skill2, skill3);
          if( bonusSkill1 === skill1 && bonusSkill2 !== skill1 && (!skill3 || !bonusSkill3 || bonusSkill2 !== skill3) && bonusSkill3 !== skill1 && (!skill2 || bonusSkill3 !== skill2)) {
            $log.debug('IN 1', bonusSkill1, bonusSkill2, bonusSkill3, skill1, skill2, skill3);
            if( skill2 === 'any' && bonusSkill3 === skill3) {
              toCheck = bonusSkill2 ? bonusSkill2 : 'any';
            } else if( bonusSkill2 === skill2 &&  bonusSkill3 !== skill2) {
              if(!skill3 || skill3 === 'any') {
                toCheck = bonusSkill3 ? bonusSkill3 : 'any';
              } else if(bonusSkill3 === skill3) {
                toCheck = 'any';
              }
            } else if( !bonusSkill3 && skill3 && bonusSkill2 === skill3 ) {
              toCheck = 'any';
            } else if( !bonusSkill3 &&  !bonusSkill2 ) {
              toCheck = 'any';
            }
          }
          if( toCheck && (multipleBonuses || toCheck === 'any') ) {
            if( multipleBonuses && !_.has( result, toCheck ) ) {
              result[ toCheck ] = {
                baseBonus: 0,
                bonus: 0,
                malus: 0,
                malusLimit: 0,
                bonusLimit: Number.POSITIVE_INFINITY
              };
            }
            var data = multipleBonuses ? result[ toCheck ] : result;
            if( bonusMatch[ 1 ] === '!' ) {
              if( bonusMatch[ 2 ] === '+' ) {
                if(bonusMatch[ 13 ]) {
                  data.bonusLimit = Math.min( data.bonusLimit, parseInt( bonusMatch[ 13 ] ) );
                } else {
                  data.bonusLimit = 0;
                }
              } else if( bonusMatch[ 2 ] === '-' ) {
                if(bonusMatch[ 13 ]) {
                  data.malusLimit += parseInt( bonusMatch[ 13 ] );
                } else {
                  data.malusLimit = Number.POSITIVE_INFINITY;
                }
              }
            } else {
              if( bonusMatch[ 2 ] === '+' ) {
                data.baseBonus += parseInt(bonusMatch[ 13 ]);
              } else if( bonusMatch[ 12 ] === '+' ) {
                data.bonus = Math.max( data.bonus, parseInt(bonusMatch[ 13 ]) );
              } else if( bonusMatch[ 12 ] === '-' ) {
                data.malus += parseInt(bonusMatch[ 13 ]);
              }
            }
          }
        }
      }
    });
    $log.debug('############ End _checkBonus #####################');
    return result;
  };
  AbstractFeat.prototype.bonus = function(creature, skill) {
    var matches = skill.match(/^([a-zA-Z_]+?|#)(\[((#|[a-zA-Z_]+?)|([a-zA-Z_]+)\((#|[a-zA-Z_]+?)\))])?$/);
    var result = {
      baseBonus: 0,
      bonus: 0,
      malus: 0,
      malusLimit: 0,
      bonusLimit: 0
    };
    if(!matches) {
      $log.warn('Bad skill formatting (' + skill +') while computing bonus (' + this.id + '), returning 0.');
      return result;
    }
    var skill1 = matches[1];
    var skill2 = matches[4] ? matches[4] : matches[5];
    var skill3 = matches[6];
    var multipleBonuses = skill1 === 'any' || skill2 === 'any' || skill3 === 'any';
    if(multipleBonuses) {
      result = {
        any: {
          baseBonus: 0,
          bonus: 0,
          malus: 0,
          malusLimit: 0,
          bonusLimit: 0
        }
      };
    }
    if(skill3 && Engine.getValue('feat', creature, this.id + '[' + skill3 + ']') > 0) {
      return this._checkBonus(skill3, creature, skill1, skill2, skill3 );
    }
    if(skill2 && Engine.getValue('feat', creature, this.id + '[' + skill2 + ']') > 0) {
      return this._checkBonus(skill2, creature, skill1, skill2, skill3 );
    }
    if(skill1 && skill1 !== 'any' && Engine.getValue('feat', creature, this.id + '[' + skill1 + ']') > 0) {
      return this._checkBonus(skill1, creature, skill1, skill2, skill3 );
    }
    if(Engine.getValue('feat', creature, this.id) > 0) {
      return this._checkBonus('any', creature, skill1, skill2, skill3 );
    }
    return result;
  };
  return AbstractFeat;
});
