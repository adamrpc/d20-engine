'use strict';

describe('Factory: AbstractSkill', function() {
  beforeEach( module( 'd20-engine' ) );
  var AbstractFeatConstructor;
  var AbstractSkillConstructor;
  var featLib;
  var statLib;
  var log;
  beforeEach( inject( function( $log, FeatLib, StatLib, AbstractFeat, AbstractSkill ) {
    featLib = FeatLib;
    statLib = StatLib;
    AbstractFeatConstructor = AbstractFeat;
    AbstractSkillConstructor = AbstractSkill;
    log = $log;
  } ) );

  it( 'Should return bonus', function() {
    var skill = new AbstractSkillConstructor('ddd');
    expect( skill.bonus ).toBeDefined();
    var aaaFeat = new AbstractFeatConstructor('aaa');
    aaaFeat.bonuses = ['+ddd[eee(#)]+1', 'ddd[fff(#)]+2', 'ddd[ggg(#)]-3', '+ddd[eee]+7', 'ddd[fff]+13', 'ddd[ggg]-19'];
    var cccFeat = new AbstractFeatConstructor('ccc');
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
    spyOn(log, 'debug' ).and.callFake(console.debug);
    expect(skill.bonus(creature, 'any(bbb)') ).toBe(6);
    expect(skill.bonus(creature, 'any') ).toBe(5);
    skill.base = 10;
    expect(skill.bonus(creature, 'any(bbb)') ).toBe(16);
    expect(skill.bonus(creature, 'any') ).toBe(15);
    creature.stat = {'test': 5, 'test2': 10, 'test3': 15, 'test4': 20};
    skill.stat = 'test5';
    expect(skill.bonus(creature, 'any(bbb)') ).toBe(16);
    expect(skill.bonus(creature, 'any') ).toBe(15);
    statLib.registered.test5 = true;
    statLib.registered.test = true;
    statLib.registered.test2 = true;
    statLib.registered.test3 = true;
    statLib.registered.test4 = true;
    skill.stat = 'test5';
    expect(skill.bonus(creature, 'any(bbb)') ).toBe(11);
    expect(skill.bonus(creature, 'any') ).toBe(10);
    skill.stat = 'test';
    expect(skill.bonus(creature, 'any(bbb)') ).toBe(13);
    expect(skill.bonus(creature, 'any') ).toBe(12);
    skill.stat = 'test2';
    expect(skill.bonus(creature, 'any(bbb)') ).toBe(16);
    expect(skill.bonus(creature, 'any') ).toBe(15);
    skill.stat = 'test3';
    expect(skill.bonus(creature, 'any(bbb)') ).toBe(18);
    expect(skill.bonus(creature, 'any') ).toBe(17);
    skill.stat = 'test4';
    expect(skill.bonus(creature, 'any(bbb)') ).toBe(21);
    expect(skill.bonus(creature, 'any') ).toBe(20);
  });
});
