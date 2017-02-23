'use strict';

describe('Factory: AbstractLib', function() {
  beforeEach( module( 'd20-engine' ) );
  var AbstractLibConstructor;
  var engine = {
    registerLib: function(){},
    checkCondition: function(){}
  };
  beforeEach(module(function ($provide) {
    $provide.value('Engine', engine);
  }));
  beforeEach( inject( function( AbstractLib ) {
    AbstractLibConstructor = AbstractLib;
  } ) );
  it('Should check each condition', function() {
    spyOn(engine, 'registerLib');
    var lib = new AbstractLibConstructor('test');
    expect(engine.registerLib.calls.count()).toBe( 1 );
    expect(engine.registerLib).toHaveBeenCalledWith( 'test', lib );

    expect(lib.checkConditions).toBeDefined();

    spyOn(engine, 'checkCondition').and.callFake(function() { return true; });
    expect(lib.checkConditions() ).toBe(true);
    expect(engine.checkCondition.calls.count()).toBe(0);

    var creature = {};
    expect(lib.checkConditions(creature) ).toBe(true);
    expect(engine.checkCondition.calls.count()).toBe(0);

    var stat = {};
    expect(lib.checkConditions(creature, stat) ).toBe(true);
    expect(engine.checkCondition.calls.count()).toBe(0);

    stat.conditions = ['aaa(bbb[ccc]>=1)', 'aaa(bbb?)'];
    expect(lib.checkConditions(creature, stat) ).toBe(true);
    expect(engine.checkCondition.calls.count()).toBe(2);
    expect(engine.checkCondition).toHaveBeenCalledWith( creature, 'aaa(bbb[ccc]>=1)' );
    expect(engine.checkCondition).toHaveBeenCalledWith( creature, 'aaa(bbb?)' );
    engine.checkCondition.calls.reset();

    lib.register('test', {});
    expect(lib.checkConditions(creature, 'test') ).toBe(true);
    expect(engine.checkCondition.calls.count()).toBe(0);

    lib.register('test2', stat);
    expect(lib.checkConditions(creature, 'test2') ).toBe(true);
    expect(engine.checkCondition.calls.count()).toBe(2);
    expect(engine.checkCondition).toHaveBeenCalledWith( creature, 'aaa(bbb[ccc]>=1)' );
    expect(engine.checkCondition).toHaveBeenCalledWith( creature, 'aaa(bbb?)' );
    engine.checkCondition.calls.reset();
  });
});
