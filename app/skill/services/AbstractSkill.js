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
        baseBonus: 0,
        bonus: 0,
        malus: 0,
        bonusLimit: Number.POSITIVE_INFINITY,
        malusLimit: 0
      };
      _.forOwn(FeatLib.getBonuses(creature, this.id + '[' + target + ']'), function(value, key) {
        if(!variant || !variant.includes(key)) {
          $log.debug(key, value);
          data.baseBonus += value.baseBonus;
          data.bonus += value.bonus;
          data.malus += value.malus;
          data.bonusLimit = Math.min(data.bonusLimit, value.bonusLimit);
          data.malusLimit += value.malusLimit;
        }
      });
      $log.debug(data);
      result = result + data.baseBonus + Math.min(data.bonus, data.bonusLimit) - Math.max(0, data.malus - data.malusLimit);
    }else{
      var bonus = FeatLib.getBonus(creature, this.id + '[' + target + ']');
      result = result + bonus.baseBonus + Math.min(bonus.bonus, bonus.bonusLimit) - Math.max(0, bonus.malus - bonus.malusLimit);
    }
    $log.debug('############### Exiting skill bonus computing ##################', result);
    return result;
  };
  AbstractSkill.prototype.changed = function(libName, creature, changes) {
    $log.debug('Change detected on ' + libName, this, creature, changes);
  };
  return AbstractSkill;
});
