'use strict';

describe('Factory: StatusLib', function() {
  beforeEach( module( 'd20-engine' ) );
  var statusLib;
  var engine = {
    compute: function(){},
    registerLib: function(){},
    changed: function(){}
  };
  beforeEach(module(function ($provide) {
    $provide.value('Engine', engine);
  }));
  beforeEach( inject( function( StatusLib ) {
    statusLib = StatusLib;
  } ) );
  it('Should changeValue', function() {

    expect(statusLib.changeValue).toBeDefined();

    var creature = {};
    expect(statusLib.changeValue()).toBe( null );
    expect(statusLib.changeValue(creature)).toBe( null );
    expect(statusLib.changeValue(creature, 2)).toBe( null );
    expect(statusLib.changeValue(creature, '')).toBe( null );
    expect(statusLib.changeValue(creature, '+')).toBe( null );
    expect(statusLib.changeValue(creature, '-')).toBe( null );
    expect(statusLib.changeValue(creature, '*')).toBe( null );
    expect(statusLib.changeValue(creature, '/')).toBe( null );
    expect(statusLib.changeValue(creature, '=')).toBe( null );
    expect(statusLib.changeValue(creature, 'aaa')).toBe( null );
    expect(statusLib.changeValue(creature, 'aaa+')).toBe( null );
    expect(statusLib.changeValue(creature, 'aaa-')).toBe( null );
    expect(statusLib.changeValue(creature, 'aaa*')).toBe( null );
    expect(statusLib.changeValue(creature, 'aaa/')).toBe( null );
    expect(statusLib.changeValue(creature, 'aaa=')).toBe( null );
    expect(statusLib.changeValue(creature, 'aaa+bbb+ccc+ddd')).toBe( null );
    expect(statusLib.changeValue(creature, 'aaa-bbb+ccc+ddd')).toBe( null );
    expect(statusLib.changeValue(creature, 'aaa*bbb+ccc+ddd')).toBe( null );
    expect(statusLib.changeValue(creature, 'aaa/bbb+ccc+ddd')).toBe( null );
    expect(statusLib.changeValue(creature, 'aaa=bbb+ccc+ddd')).toBe( null );
    expect(statusLib.changeValue(creature, '+aaa+bbb+ccc')).toBe( null );

    spyOn(engine, 'compute').and.callFake(function( currentValue ) {
      return currentValue + 7;
    });
    spyOn(engine, 'changed');

    statusLib.changeValue(creature, 'aaa+2d8+1d6');
    expect(creature.status).toBeDefined();
    expect(creature.status.aaa ).toBeDefined();
    expect(creature.status.aaa.value ).toBeDefined();
    expect(creature.status.aaa.time ).toBeDefined();
    expect(creature.status.aaa.value ).toBe( 7 );
    expect(creature.status.aaa.time ).toBe( 7 );
    expect(engine.compute.calls.count()).toBe( 2 );
    expect(engine.compute).toHaveBeenCalledWith( 0, '+', '2d8', null, null );
    expect(engine.compute).toHaveBeenCalledWith( 0, '+', '1d6', null, null );
    engine.compute.calls.reset();
    expect(engine.changed.calls.count()).toBe( 1 );
    expect(engine.changed).toHaveBeenCalledWith( 'status', creature, 'aaa' );
    engine.changed.calls.reset();

    statusLib.registered.aaa = {min:0, max:10, minTime: 3, maxTime: 15};

    statusLib.changeValue(creature, 'aaa+2d8-1d4');
    expect(creature.status.aaa.value ).toBe( 14 );
    expect(creature.status.aaa.time ).toBe( 14 );
    expect(engine.compute.calls.count()).toBe( 2 );
    expect(engine.compute).toHaveBeenCalledWith( 7, '+', '2d8', 0, 10 );
    expect(engine.compute).toHaveBeenCalledWith( 7, '-', '1d4', 3, 15 );
    engine.compute.calls.reset();
    expect(engine.changed.calls.count()).toBe( 1 );
    expect(engine.changed).toHaveBeenCalledWith( 'status', creature, 'aaa' );
    engine.changed.calls.reset();
  });
  it('Should changeValue with subType', function() {

    expect(statusLib.changeValue).toBeDefined();

    var creature = {};
    expect(statusLib.changeValue()).toBe( null );
    expect(statusLib.changeValue(creature)).toBe( null );
    expect(statusLib.changeValue(creature, 2)).toBe( null );
    expect(statusLib.changeValue(creature, '')).toBe( null );
    expect(statusLib.changeValue(creature, '+')).toBe( null );
    expect(statusLib.changeValue(creature, '-')).toBe( null );
    expect(statusLib.changeValue(creature, '*')).toBe( null );
    expect(statusLib.changeValue(creature, '/')).toBe( null );
    expect(statusLib.changeValue(creature, '=')).toBe( null );
    expect(statusLib.changeValue(creature, 'aaa[eee]')).toBe( null );
    expect(statusLib.changeValue(creature, 'aaa[eee]+')).toBe( null );
    expect(statusLib.changeValue(creature, 'aaa[eee]-')).toBe( null );
    expect(statusLib.changeValue(creature, 'aaa[eee]*')).toBe( null );
    expect(statusLib.changeValue(creature, 'aaa[eee]/')).toBe( null );
    expect(statusLib.changeValue(creature, 'aaa[eee]=')).toBe( null );
    expect(statusLib.changeValue(creature, 'aaa[eee]+bbb[eee]+ccc[eee]+ddd[eee]')).toBe( null );
    expect(statusLib.changeValue(creature, 'aaa[eee]-bbb[eee]+ccc[eee]+ddd[eee]')).toBe( null );
    expect(statusLib.changeValue(creature, 'aaa[eee]*bbb[eee]+ccc[eee]+ddd[eee]')).toBe( null );
    expect(statusLib.changeValue(creature, 'aaa[eee]/bbb[eee]+ccc[eee]+ddd[eee]')).toBe( null );
    expect(statusLib.changeValue(creature, 'aaa[eee]=bbb[eee]+ccc[eee]+ddd[eee]')).toBe( null );
    expect(statusLib.changeValue(creature, '+aaa[eee]+bbb[eee]+ccc[eee]')).toBe( null );

    spyOn(engine, 'compute').and.callFake(function( currentValue ) {
      return currentValue + 7;
    });
    spyOn(engine, 'changed');

    statusLib.changeValue(creature, 'aaa[eee]+2d8+1d6');
    expect(creature.status).toBeDefined();
    expect(creature.status.aaa ).toBeDefined();
    expect(creature.status.aaa.eee ).toBeDefined();
    expect(creature.status.aaa.eee.value ).toBeDefined();
    expect(creature.status.aaa.eee.time ).toBeDefined();
    expect(creature.status.aaa.eee.value ).toBe( 7 );
    expect(creature.status.aaa.eee.time ).toBe( 7 );
    expect(engine.compute.calls.count()).toBe( 2 );
    expect(engine.compute).toHaveBeenCalledWith( 0, '+', '2d8', null, null );
    expect(engine.compute).toHaveBeenCalledWith( 0, '+', '1d6', null, null );
    engine.compute.calls.reset();
    expect(engine.changed.calls.count()).toBe( 1 );
    expect(engine.changed).toHaveBeenCalledWith( 'status', creature, 'aaa[eee]' );
    engine.changed.calls.reset();

    statusLib.registered.aaa = {min:0, max:10, minTime: 3, maxTime: 15};

    statusLib.changeValue(creature, 'aaa[eee]+2d8-1d4');
    expect(creature.status.aaa.eee.value ).toBe( 14 );
    expect(creature.status.aaa.eee.time ).toBe( 14 );
    expect(engine.compute.calls.count()).toBe( 2 );
    expect(engine.compute).toHaveBeenCalledWith( 7, '+', '2d8', 0, 10 );
    expect(engine.compute).toHaveBeenCalledWith( 7, '-', '1d4', 3, 15 );
    engine.compute.calls.reset();
    expect(engine.changed.calls.count()).toBe( 1 );
    expect(engine.changed).toHaveBeenCalledWith( 'status', creature, 'aaa[eee]' );
    engine.changed.calls.reset();
  });
});
