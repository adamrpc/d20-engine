'use strict';

describe('Factory: GiftLib', function() {
  beforeEach( module( 'd20-engine' ) );
  var giftLib;
  var abstractGift;
  var log;
  var perkLib = {};
  beforeEach(module(function ($provide) {
    $provide.value('PerkLib', perkLib);
  }));
  beforeEach( inject( function( GiftLib, AbstractGift, $log ) {
    giftLib = GiftLib;
    abstractGift = AbstractGift;
    log = $log;
  } ) );
  it( 'Should checkRegistering', function() {
    expect( giftLib.checkRegistering ).toBeDefined();
    var gift = new abstractGift( 'test' );
    spyOn( log, 'warn' ).and.callFake(console.log);
    perkLib.aaaa = true;
    giftLib.register( 'test', gift );
    expect( log.warn.calls.count() ).toBe( 0 );
    gift.bonuses.push('aaa[#]+1;');
    gift.bonuses.push('+bbb+2;');
    gift.bonuses.push('ccc*2;');
    gift.bonuses.push('+ddd[#]+4;');
    gift.bonuses.push('limit(1j)|eee[#]=level;fff[#]=stat[ggg];spell(#);');
    gift.bonuses.push('!-hhh[#]-4;');
    gift.bonuses.push('-jjj[#]-5;');
    gift.bonuses.push('!-kkk[#];');
    gift.bonuses.push('!-lll;');
    gift.bonuses.push('!-mmm-4;');
    gift.bonuses.push('+nnn;');
    gift.bonuses.push('-ooo;');
    gift.bonuses.push('+ppp[spell(#)]+2;');
    gift.bonuses.push('+qqq[effect(#)]+2;');
    gift.bonuses.push('-rrr[spell(#)]-2;');
    gift.bonuses.push('-sss[effect(#)]-2;');
    gift.bonuses.push('ttt[spell(#)]-2;');
    gift.bonuses.push('uuu[effect(#)]-2;');
    gift.bonuses.push('vvv[spell(#)]+2;');
    gift.bonuses.push('www[effect(#)]+2;');
    gift.bonuses.push('!+yyy+4;');
    gift.bonuses.push('limit(1j)|xxx;');
    gift.bonuses.push('limit(1j)|yyy[#];');
    gift.bonuses.push('skill(#).lvl<5|#+2;');
    gift.bonuses.push('skill(#).lvl<5|+#+3;');
    gift.bonuses.push('skill(#).lvl<=5|#+2;');
    gift.bonuses.push('skill(#).lvl<=5|+#+3;');
    gift.bonuses.push('skill(#).lvl>=5|#+2;');
    gift.bonuses.push('skill(#).lvl>=5|+#+3;');
    gift.bonuses.push('skill(#).lvl>5|#+2;');
    gift.bonuses.push('skill(#).lvl>5|+#+3;');
    gift.bonuses.push('skill(#).lvl=5|#+2;');
    gift.bonuses.push('skill(#).lvl=5|+#+3;');


    gift.bonuses.push('+aaaa-2;');
    gift.bonuses.push('-aaaa+2;');
    gift.bonuses.push('!-aaaa[#;');
    gift.bonuses.push('!-aaaa[#]+2;');
    gift.bonuses.push('!-aaaa[#]+;');
    gift.bonuses.push('!-aaaa[#]-;');
    gift.bonuses.push('!+aaaa[#]-2;');
    gift.bonuses.push('limit(1j)|aaaa[#]=level;aaaa[#]=stat[bbbb];ccc(#);');
    gift.bonuses.push('limit(1j)|aaaa[#]=level;aaaa[#]=ddd[bbbb];spell(#);');
    gift.bonuses.push('limit(1j)|aaaa[#]=eee;aaaa[#]=stat[bbbb];spell(#);');
    gift.bonuses.push('fff(1j)|aaaa[#]=level;aaaa[#]=stat[bbbb];spell(#);');
    gift.bonuses.push('+aaaa[fff(#)]+2;');
    gift.bonuses.push('ggg(#).lvl<5|#+2;');
    gift.bonuses.push('skill(#).hhh<5|#+2;');
    gift.bonuses.push('iii(1j)|aaaa;');
    gift.bonuses.push('limit(jjj)|aaaa;');
    giftLib.register( 'test0', gift );
    expect( log.warn.calls.count() ).toBe( 40 );
    log.warn.calls.reset();
    perkLib.aaa = true;
    perkLib.bbb = true;
    perkLib.ccc = true;
    perkLib.ddd = true;
    perkLib.eee = true;
    perkLib.fff = true;
    perkLib.ggg = true;
    perkLib.hhh = true;
    perkLib.iii = true;
    perkLib.jjj = true;
    perkLib.kkk = true;
    perkLib.lll = true;
    perkLib.mmm = true;
    perkLib.nnn = true;
    perkLib.ooo = true;
    perkLib.ppp = true;
    perkLib.qqq = true;
    perkLib.rrr = true;
    perkLib.sss = true;
    perkLib.ttt = true;
    perkLib.uuu = true;
    perkLib.vvv = true;
    perkLib.www = true;
    perkLib.xxx = true;
    perkLib.yyy = true;
    giftLib.register( 'test1', gift );
    expect( log.warn.calls.count() ).toBe( 16 );
  } );
});
