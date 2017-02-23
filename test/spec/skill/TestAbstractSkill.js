'use strict';

describe('Factory: AbstractSkill', function() {
  beforeEach( module( 'd20-engine' ) );
  var abstractFeat;
  var abstractSkill;
  var featLib;
  var statLib;
  var log;
  beforeEach( inject( function( $log, FeatLib, StatLib, AbstractFeat, AbstractSkill ) {
    featLib = FeatLib;
    statLib = StatLib;
    abstractFeat = AbstractFeat;
    abstractSkill = AbstractSkill;
    log = $log;
  } ) );

  it( 'Should return bonus', function() {
    var skill = new abstractSkill('ddd');
    expect( skill.bonus ).toBeDefined();
    var aaaFeat = new abstractFeat('aaa');
    aaaFeat.bonuses = ['+ddd[eee(#)]+1', 'ddd[fff(#)]+2', 'ddd[ggg(#)]-3', '+ddd[eee]+7', 'ddd[fff]+13', 'ddd[ggg]-19'];
    var cccFeat = new abstractFeat('ccc');
    cccFeat.bonuses = ['+ddd[eee(bbb)]+5', '!+ddd[fff(bbb)]+1', '!-ddd[ggg(bbb)]-2', '+ddd[eee]+7', 'ddd[fff]+13', 'ddd[ggg]-19', '!+ddd[fff]+11', '!-ddd[ggg]-17'];
    featLib.register('aaa', aaaFeat);
    featLib.register('ccc', cccFeat);
    var creature = {
      feat: {
        aaa: {
          any: 0,
          bbb: {
            any: 1
          }
        },
        ccc: {
          any: 1
        }
      }
    };
    expect(skill.bonus(creature, 'any(bbb)') ).toBe(-1);
    expect(skill.bonus(creature, 'any') ).toBe(16);
    skill.base = 10;
    expect(skill.bonus(creature, 'any(bbb)') ).toBe(9);
    expect(skill.bonus(creature, 'any') ).toBe(26);
    creature.stat = {'test': 5, 'test2': 10, 'test3': 15, 'test4': 20};
    skill.stat = 'test5';
    expect(skill.bonus(creature, 'any(bbb)') ).toBe(9);
    expect(skill.bonus(creature, 'any') ).toBe(26);
    statLib.registered.test5 = true;
    statLib.registered.test = true;
    statLib.registered.test2 = true;
    statLib.registered.test3 = true;
    statLib.registered.test4 = true;
    skill.stat = 'test5';
    expect(skill.bonus(creature, 'any(bbb)') ).toBe(4);
    expect(skill.bonus(creature, 'any') ).toBe(21);
    skill.stat = 'test';
    expect(skill.bonus(creature, 'any(bbb)') ).toBe(6);
    expect(skill.bonus(creature, 'any') ).toBe(23);
    skill.stat = 'test2';
    expect(skill.bonus(creature, 'any(bbb)') ).toBe(9);
    expect(skill.bonus(creature, 'any') ).toBe(26);
    skill.stat = 'test3';
    expect(skill.bonus(creature, 'any(bbb)') ).toBe(11);
    expect(skill.bonus(creature, 'any') ).toBe(28);
    skill.stat = 'test4';
    expect(skill.bonus(creature, 'any(bbb)') ).toBe(14);
    expect(skill.bonus(creature, 'any') ).toBe(31);
  });
});
