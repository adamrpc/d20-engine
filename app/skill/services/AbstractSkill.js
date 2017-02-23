'use strict';

angular.module( 'd20-engine' ).factory( 'AbstractSkill', function( $log, FeatLib ) {
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
    var result = 0;
    var matches = target.match(/^(([a-zA-Z_]+?)|([a-zA-Z_]+?)\(([a-zA-Z_]+?)\))$/);
    if(!matches) {
      $log.warn('Bonus target not well formatted, returning 0.', target);
      return 0;
    }
    if(matches[2] === 'any' || matches[3] === 'any' || matches[4] === 'any') {
      _.forOwn(FeatLib.getBonuses(creature, this.id + '[' + target + ']'), function(value, key) {
        if(!variant || !variant.includes(key)) {
          $log.debug(key, value);
          result = result + value.base_bonus + Math.min(value.bonus, value.bonus_limit) - Math.max(0, value.malus - value.malus_limit);
        }
      });
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
