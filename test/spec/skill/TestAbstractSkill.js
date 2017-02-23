'use strict';

describe('Factory: AbstractSkill', function() {
  beforeEach( module( 'd20-engine' ) );
  var abstractFeat;
  var abstractSkill;
  var featLib;
  var log;
  beforeEach( inject( function( $log, FeatLib, AbstractFeat, AbstractSkill ) {
    featLib = FeatLib;
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
  });
});
