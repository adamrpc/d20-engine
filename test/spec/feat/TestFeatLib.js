'use strict';

describe('Factory: FeatLib', function() {
  beforeEach( module( 'd20-engine' ) );
  var featLib;
  var abstractFeat;
  var skillLib = {};
  var log;
  beforeEach(module(function ($provide) {
    $provide.value('SkillLib', skillLib);
  }));
  beforeEach( inject( function( $log, FeatLib, AbstractFeat ) {
    featLib = FeatLib;
    abstractFeat = AbstractFeat;
    log = $log;
  } ) );
  it( 'Should checkRegistering', function() {
    expect( featLib.checkRegistering ).toBeDefined();
    spyOn(log, 'warn' ).and.callFake( console.log );
    var feat = new abstractFeat( 'test' );
    skillLib.aaaa = true;
    featLib.register( 'test', feat );
    expect( log.warn.calls.count( ) ).toBe( 0 );
    feat.bonuses.push('aaa[#]+1');
    feat.bonuses.push('aaa[#]+1;');
    feat.bonuses.push('+bbb+2;');
    feat.bonuses.push('ccc*2;');
    feat.bonuses.push('+ddd[#]+4;');
    feat.bonuses.push('uop(1bbb)|xxx;');
    feat.bonuses.push('uop(1bbb)|yyy[#];');
    feat.bonuses.push('uop(1bbb)|eee[ggg(#)];');
    feat.bonuses.push('!-hhh[#]-4;');
    feat.bonuses.push('-jjj[#]-5;');
    feat.bonuses.push('!-kkk[#];');
    feat.bonuses.push('!-lll;');
    feat.bonuses.push('!-mmm-4;');
    feat.bonuses.push('+nnn;');
    feat.bonuses.push('-ooo;');
    feat.bonuses.push('+ppp[spell(#)]+2;');
    feat.bonuses.push('+qqq[effect(#)]+2;');
    feat.bonuses.push('-rrr[spell(#)]-2;');
    feat.bonuses.push('-sss[effect(#)]-2;');
    feat.bonuses.push('ttt[spell(#)]-2;');
    feat.bonuses.push('uuu[effect(#)]-2;');
    feat.bonuses.push('vvv[spell(#)]+2;');
    feat.bonuses.push('www[effect(#)]+2;');
    feat.bonuses.push('!+yyy+4;');
    feat.bonuses.push('uop(#<5)|#+2;');
    feat.bonuses.push('uop(#<5)|+#+3;');
    feat.bonuses.push('uop(#<=5)|#+2;');
    feat.bonuses.push('uop(#<=5)|+#+3;');
    feat.bonuses.push('uop(#>=5)|#+2;');
    feat.bonuses.push('uop(#>=5)|+#+3;');
    feat.bonuses.push('uop(#>5)|#+2;');
    feat.bonuses.push('uop(#>5)|+#+3;');
    feat.bonuses.push('uop(#=5)|#+2;');
    feat.bonuses.push('uop(#=5)|+#+3;');


    feat.bonuses.push('+aaaa-2;');
    feat.bonuses.push('-aaaa+2;');
    feat.bonuses.push('!-aaaa[#;');
    feat.bonuses.push('!-aaaa[#]+2;');
    feat.bonuses.push('!-aaaa[#]+;');
    feat.bonuses.push('!-aaaa[#]-;');
    feat.bonuses.push('!+aaaa[#]-2;');
    featLib.register( 'test0', feat );
    expect( log.warn.calls.count( ) ).toBe( 31 );
    log.warn.calls.reset();
    skillLib.aaa = true;
    skillLib.bbb = true;
    skillLib.ccc = true;
    skillLib.ddd = true;
    skillLib.eee = true;
    skillLib.fff = true;
    skillLib.ggg = true;
    skillLib.hhh = true;
    skillLib.iii = true;
    skillLib.jjj = true;
    skillLib.kkk = true;
    skillLib.lll = true;
    skillLib.mmm = true;
    skillLib.nnn = true;
    skillLib.ooo = true;
    skillLib.ppp = true;
    skillLib.qqq = true;
    skillLib.rrr = true;
    skillLib.sss = true;
    skillLib.ttt = true;
    skillLib.uuu = true;
    skillLib.vvv = true;
    skillLib.www = true;
    skillLib.xxx = true;
    skillLib.yyy = true;
    featLib.register( 'test1', feat );
    expect( log.warn.calls.count( ) ).toBe( 7 );
    log.warn.calls.reset();
  } );
  it( 'Should return single bonus', function() {
    expect( featLib.getBonus ).toBeDefined();
    var aaaFeat = new abstractFeat('aaa');
    aaaFeat.bonuses = ['+ddd[eee(#)]+1', 'ddd[fff(#)]+2', 'ddd[ggg(#)]-3'];
    var cccFeat = new abstractFeat('ccc');
    cccFeat.bonuses = ['+ddd[eee(bbb)]+5', '!+ddd[fff(bbb)]+1', '!-ddd[ggg(bbb)]-2'];
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
    var result = featLib.getBonus(creature, 'ddd[eee(bbb)]');
    expect(result.base_bonus ).toBe(6);
    expect(result.bonus ).toBe(0);
    expect(result.malus ).toBe(0);
    expect(result.bonus_limit ).toBe(Number.POSITIVE_INFINITY);
    expect(result.malus_limit ).toBe(0);
    result = featLib.getBonus(creature, 'ddd[fff(bbb)]');
    expect(result.base_bonus ).toBe(0);
    expect(result.bonus ).toBe(2);
    expect(result.malus ).toBe(0);
    expect(result.bonus_limit ).toBe(1);
    expect(result.malus_limit ).toBe(0);
    result = featLib.getBonus(creature, 'ddd[ggg(bbb)]');
    expect(result.base_bonus ).toBe(0);
    expect(result.bonus ).toBe(0);
    expect(result.malus ).toBe(3);
    expect(result.bonus_limit ).toBe(Number.POSITIVE_INFINITY);
    expect(result.malus_limit ).toBe(2);
  });
  it( 'Should return multiple bonuses', function() {
    expect( featLib.getBonus ).toBeDefined();
    var aaaFeat = new abstractFeat('aaa');
    aaaFeat.bonuses = ['+ddd[eee(#)]+1', 'ddd[fff(#)]+2', 'ddd[ggg(#)]-3'];
    var cccFeat = new abstractFeat('ccc');
    cccFeat.bonuses = ['+ddd[eee(bbb)]+5', '!+ddd[fff(bbb)]+1', '!-ddd[ggg(bbb)]-2'];
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
    var result = featLib.getBonuses(creature, 'ddd[any(bbb)]');
    expect(result.eee ).toBeDefined();
    expect(result.fff ).toBeDefined();
    expect(result.ggg ).toBeDefined();
    expect(result.eee.base_bonus ).toBe(6);
    expect(result.eee.bonus ).toBe(0);
    expect(result.eee.malus ).toBe(0);
    expect(result.eee.bonus_limit ).toBe(Number.POSITIVE_INFINITY);
    expect(result.eee.malus_limit ).toBe(0);
    expect(result.fff.base_bonus ).toBe(0);
    expect(result.fff.bonus ).toBe(2);
    expect(result.fff.malus ).toBe(0);
    expect(result.fff.bonus_limit ).toBe(1);
    expect(result.fff.malus_limit ).toBe(0);
    expect(result.ggg.base_bonus ).toBe(0);
    expect(result.ggg.bonus ).toBe(0);
    expect(result.ggg.malus ).toBe(3);
    expect(result.ggg.bonus_limit ).toBe(Number.POSITIVE_INFINITY);
    expect(result.ggg.malus_limit ).toBe(2);
  });
});
