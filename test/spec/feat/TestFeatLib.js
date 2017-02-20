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
    feat.bonuses.push('limit(1j)|eee[#]=level;fff[#]=stat[ggg];spell(#);');
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
    feat.bonuses.push('limit(1j)|xxx;');
    feat.bonuses.push('limit(1j)|yyy[#];');
    feat.bonuses.push('skill(#).lvl<5|#+2;');
    feat.bonuses.push('skill(#).lvl<5|+#+3;');
    feat.bonuses.push('skill(#).lvl<=5|#+2;');
    feat.bonuses.push('skill(#).lvl<=5|+#+3;');
    feat.bonuses.push('skill(#).lvl>=5|#+2;');
    feat.bonuses.push('skill(#).lvl>=5|+#+3;');
    feat.bonuses.push('skill(#).lvl>5|#+2;');
    feat.bonuses.push('skill(#).lvl>5|+#+3;');
    feat.bonuses.push('skill(#).lvl=5|#+2;');
    feat.bonuses.push('skill(#).lvl=5|+#+3;');


    feat.bonuses.push('+aaaa-2;');
    feat.bonuses.push('-aaaa+2;');
    feat.bonuses.push('!-aaaa[#;');
    feat.bonuses.push('!-aaaa[#]+2;');
    feat.bonuses.push('!-aaaa[#]+;');
    feat.bonuses.push('!-aaaa[#]-;');
    feat.bonuses.push('!+aaaa[#]-2;');
    feat.bonuses.push('limit(1j)|aaaa[#]=level;aaaa[#]=ddd[bbbb];spell(#);');
    feat.bonuses.push('limit(1j)|aaaa[#]=eee;aaaa[#]=stat[bbbb];spell(#);');
    feat.bonuses.push('fff(1j)|aaaa[#]=level;aaaa[#]=stat[bbbb];spell(#);');
    feat.bonuses.push('ggg(#).lvl<5|#+2;');
    feat.bonuses.push('skill(#).hhh<5|#+2;');
    feat.bonuses.push('iii(1j)|aaaa;');
    feat.bonuses.push('limit(jjj)|aaaa;');
    featLib.register( 'test0', feat );
    expect( log.warn.calls.count( ) ).toBe( 39 );
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
    expect( log.warn.calls.count( ) ).toBe( 14 );
    log.warn.calls.reset();
  } );
});
