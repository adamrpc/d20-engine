'use strict';

angular.module( 'd20-engine' ).factory( 'AbstractSkill', function( $log, FeatLib, StatLib ) {
  var i = 0;
  function AbstractSkill( name ){
    this.min = 0;
    this.max = null;
    this.name = 'Skill-' + i;
    this.id = name;
    this.stat = null;
    this.base = 0;
    this.hidden = false;
    i++;
    this.description = '';
  }
  AbstractSkill.prototype.bonus = function(creature, target, variant) {
    $log.debug('############### Entering skill bonus computing ##################', creature, target, variant);
    var result = this.base + (this.stat && StatLib.registered[this.stat] ? StatLib.getBonus(creature, this.stat) : 0);
    var matches = target.match(/^(([a-zA-Z_]+?)|([a-zA-Z_]+?)\(([a-zA-Z_]+?)\))$/);
    if(!matches) {
      $log.warn('Bonus target not well formatted, returning base.', target);
      return this.base;
    }
    if(matches[2] === 'any' || matches[3] === 'any' || matches[4] === 'any') {
      var data = {
        base_bonus: 0,
        bonus: 0,
        malus: 0,
        bonus_limit: Number.POSITIVE_INFINITY,
        malus_limit: 0
      };
      _.forOwn(FeatLib.getBonuses(creature, this.id + '[' + target + ']'), function(value, key) {
        if(!variant || !variant.includes(key)) {
          $log.debug(key, value);
          data.base_bonus += value.base_bonus;
          data.bonus += value.bonus;
          data.malus += value.malus;
          data.bonus_limit = Math.min(data.bonus_limit, value.bonus_limit);
          data.malus_limit += value.malus_limit;
        }
      });
      $log.debug(data);
      result = result + data.base_bonus + Math.min(data.bonus, data.bonus_limit) - Math.max(0, data.malus - data.malus_limit);
    }else{
      var bonus = FeatLib.getBonus(creature, this.id + '[' + target + ']');
      result = result + bonus.base_bonus + Math.min(bonus.bonus, bonus.bonus_limit) - Math.max(0, bonus.malus - bonus.malus_limit);
    }
    $log.debug('############### Exiting skill bonus computing ##################', result);
    return result;
  };
  AbstractSkill.prototype.changed = function(libName, creature, changes) {
    $log.debug('Change detected on ' + libName, this, creature, changes);
  };
  return AbstractSkill;
});
