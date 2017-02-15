'use strict';

describe('Factory: RaceLib', function() {
  beforeEach( module( 'd20-engine' ) );
  var raceLib;
  var giftLib = {};
  var statLib = {};
  var abstractRace;
  beforeEach(module(function ($provide) {
    $provide.value('GiftLib', giftLib);
    $provide.value('StatLib', statLib);
  }));
  beforeEach( inject( function( RaceLib, AbstractRace ) {
    raceLib = RaceLib;
    abstractRace = AbstractRace;
  } ) );
  it( 'Should checkRegistering', function() {
    expect( raceLib.checkRegistering ).toBeDefined();
    var race = new abstractRace( 'test' );
    expect( raceLib.register( 'test', race ).length ).toBe( 0 );
    race.gifts.push( 'aaa' );
    race.gifts.push( 'bbb[ccc]' );
    race.gifts.push( 'bbb[ddd' );
    expect( raceLib.register( 'test0', race ).length ).toBe( 3 );
    race.gifts.length--;
    expect( raceLib.register( 'test1', race ).length ).toBe( 2 );
    giftLib.aaa = true;
    expect( raceLib.register( 'test2', race ).length ).toBe( 1 );
    giftLib.bbb = true;
    expect( raceLib.register( 'test4', race ).length ).toBe( 0 );
    race.stats.push( 'ddd+1' );
    race.stats.push( 'eee-1' );
    race.stats.push( 'any+1' );
    race.stats.push( 'test' );
    expect( raceLib.register( 'test5', race ).length ).toBe( 3 );
    race.stats.length--;
    expect( raceLib.register( 'test6', race ).length ).toBe( 2 );
    statLib.ddd = true;
    expect( raceLib.register( 'test7', race ).length ).toBe( 1 );
    statLib.eee = true;
    expect( raceLib.register( 'test8', race ).length ).toBe( 0 );
  } );
});
