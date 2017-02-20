'use strict';

describe('Factory: RaceLib', function() {
  beforeEach( module( 'd20-engine' ) );
  var raceLib;
  var featLib = {};
  var statLib = {};
  var abstractRace;
  var log;
  beforeEach(module(function ($provide) {
    $provide.value('FeatLib', featLib);
    $provide.value('StatLib', statLib);
  }));
  beforeEach( inject( function( $log, RaceLib, AbstractRace ) {
    log = $log;
    raceLib = RaceLib;
    abstractRace = AbstractRace;
  } ) );
  it( 'Should checkRegistering', function() {
    expect( raceLib.checkRegistering ).toBeDefined();
    spyOn(log, 'warn' ).and.callFake( console.log );
    var race = new abstractRace( 'test' );
    raceLib.register( 'test', race );
    expect( log.warn.calls.count() ).toBe( 0 );
    race.feats.push( 'aaa' );
    race.feats.push( 'bbb[ccc]' );
    race.feats.push( 'bbb[ddd' );
    raceLib.register( 'test0', race );
    expect( log.warn.calls.count( ) ).toBe( 3 );
    log.warn.calls.reset();
    race.feats.length--;
    raceLib.register( 'test1', race );
    expect( log.warn.calls.count( ) ).toBe( 2 );
    log.warn.calls.reset();
    featLib.aaa = true;
    raceLib.register( 'test2', race );
    expect( log.warn.calls.count( ) ).toBe( 1 );
    log.warn.calls.reset();
    featLib.bbb = true;
    raceLib.register( 'test4', race );
    expect( log.warn.calls.count( ) ).toBe( 0 );
    race.stats.push( 'ddd+1' );
    race.stats.push( 'eee-1' );
    race.stats.push( 'any+1' );
    race.stats.push( 'test' );
    raceLib.register( 'test5', race );
    expect( log.warn.calls.count( ) ).toBe( 3 );
    log.warn.calls.reset();
    race.stats.length--;
    raceLib.register( 'test6', race );
    expect( log.warn.calls.count( ) ).toBe( 2 );
    log.warn.calls.reset();
    statLib.ddd = true;
    raceLib.register( 'test7', race );
    expect( log.warn.calls.count( ) ).toBe( 1 );
    log.warn.calls.reset();
    statLib.eee = true;
    raceLib.register( 'test8', race );
    expect( log.warn.calls.count( ) ).toBe( 0 );
  } );
});
