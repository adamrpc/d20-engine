'use strict';

describe('Factory: AbstractLib', function() {
  beforeEach( module( 'd20-engine' ) );
  var abstractLib;
  var engine = {
    compute: function(){},
    registerLib: function(){},
    changed: function(){}
  };
  beforeEach(module(function ($provide) {
    $provide.value('Engine', engine);
  }));
  beforeEach( inject( function( AbstractStatLib ) {
    abstractLib = AbstractStatLib;
  } ) );
  it('Should changeValue', function() {
    spyOn(engine, 'registerLib');
    var lib = new abstractLib('test');
    expect(engine.registerLib.calls.count()).toBe( 1 );
    expect(engine.registerLib).toHaveBeenCalledWith( 'test', lib );

    expect(lib.changeValue).toBeDefined();

    var creature = {};
    expect(lib.changeValue()).toBe( null );
    expect(lib.changeValue(creature)).toBe( null );
    expect(lib.changeValue(creature, 2)).toBe( null );
    expect(lib.changeValue(creature, '')).toBe( null );
    expect(lib.changeValue(creature, '+')).toBe( null );
    expect(lib.changeValue(creature, '-')).toBe( null );
    expect(lib.changeValue(creature, '*')).toBe( null );
    expect(lib.changeValue(creature, '/')).toBe( null );
    expect(lib.changeValue(creature, '=')).toBe( null );
    expect(lib.changeValue(creature, 'aaa')).toBe( null );
    expect(lib.changeValue(creature, 'aaa+')).toBe( null );
    expect(lib.changeValue(creature, 'aaa-')).toBe( null );
    expect(lib.changeValue(creature, 'aaa*')).toBe( null );
    expect(lib.changeValue(creature, 'aaa/')).toBe( null );
    expect(lib.changeValue(creature, 'aaa=')).toBe( null );
    expect(lib.changeValue(creature, 'aaa+bbb+ccc')).toBe( null );
    expect(lib.changeValue(creature, 'aaa-bbb+ccc')).toBe( null );
    expect(lib.changeValue(creature, 'aaa*bbb+ccc')).toBe( null );
    expect(lib.changeValue(creature, 'aaa/bbb+ccc')).toBe( null );
    expect(lib.changeValue(creature, 'aaa=bbb+ccc')).toBe( null );
    expect(lib.changeValue(creature, '+aaa+bbb')).toBe( null );

    spyOn(engine, 'compute').and.callFake(function( currentValue ) {
      return currentValue + 7;
    });
    spyOn(engine, 'changed');

    lib.changeValue(creature, 'aaa+2d8');
    expect(creature.test ).toBeDefined();
    expect(creature.test.aaa ).toBeDefined();
    expect(creature.test.aaa ).toBe( 7 );
    expect(engine.compute.calls.count()).toBe( 1 );
    expect(engine.compute).toHaveBeenCalledWith( 0, '+', '2d8', null, null );
    engine.compute.calls.reset();
    expect(engine.changed.calls.count()).toBe( 1 );
    expect(engine.changed).toHaveBeenCalledWith( 'test', creature, 'aaa' );
    engine.changed.calls.reset();

    lib.registered.aaa = {min:0, max:10};

    lib.changeValue(creature, 'aaa+2d8');
    expect(creature.test.aaa ).toBe( 14 );
    expect(engine.compute.calls.count()).toBe( 1 );
    expect(engine.compute).toHaveBeenCalledWith( 7, '+', '2d8', 0, 10 );
    engine.compute.calls.reset();
    expect(engine.changed.calls.count()).toBe( 1 );
    expect(engine.changed).toHaveBeenCalledWith( 'test', creature, 'aaa' );
    engine.changed.calls.reset();
  });
  it('Should changeValue with subType', function() {
    spyOn(engine, 'registerLib');
    var lib = new abstractLib('test');
    expect(engine.registerLib.calls.count()).toBe( 1 );
    expect(engine.registerLib).toHaveBeenCalledWith( 'test', lib );

    expect(lib.changeValue).toBeDefined();

    var creature = {};
    expect(lib.changeValue()).toBe( null );
    expect(lib.changeValue(creature)).toBe( null );
    expect(lib.changeValue(creature, 2)).toBe( null );
    expect(lib.changeValue(creature, '')).toBe( null );
    expect(lib.changeValue(creature, '+')).toBe( null );
    expect(lib.changeValue(creature, '-')).toBe( null );
    expect(lib.changeValue(creature, '*')).toBe( null );
    expect(lib.changeValue(creature, '/')).toBe( null );
    expect(lib.changeValue(creature, '=')).toBe( null );
    expect(lib.changeValue(creature, 'aaa[ddd]')).toBe( null );
    expect(lib.changeValue(creature, 'aaa[ddd]+')).toBe( null );
    expect(lib.changeValue(creature, 'aaa[ddd]-')).toBe( null );
    expect(lib.changeValue(creature, 'aaa[ddd]*')).toBe( null );
    expect(lib.changeValue(creature, 'aaa[ddd]/')).toBe( null );
    expect(lib.changeValue(creature, 'aaa[ddd]=')).toBe( null );
    expect(lib.changeValue(creature, 'aaa[ddd]+bbb[ddd]+ccc[ddd]')).toBe( null );
    expect(lib.changeValue(creature, 'aaa[ddd]-bbb[ddd]+ccc[ddd]')).toBe( null );
    expect(lib.changeValue(creature, 'aaa[ddd]*bbb[ddd]+ccc[ddd]')).toBe( null );
    expect(lib.changeValue(creature, 'aaa[ddd]/bbb[ddd]+ccc[ddd]')).toBe( null );
    expect(lib.changeValue(creature, 'aaa[ddd]=bbb[ddd]+ccc[ddd]')).toBe( null );
    expect(lib.changeValue(creature, '+aaa+bbb[ddd]')).toBe( null );

    spyOn(engine, 'compute').and.callFake(function( currentValue ) {
      return currentValue + 7;
    });
    spyOn(engine, 'changed');

    lib.changeValue(creature, 'aaa[ddd]+2d8');
    expect(creature.test ).toBeDefined();
    expect(creature.test.aaa ).toBeDefined();
    expect(creature.test.aaa.ddd ).toBeDefined();
    expect(creature.test.aaa.ddd ).toBe( 7 );
    expect(engine.compute.calls.count()).toBe( 1 );
    expect(engine.compute).toHaveBeenCalledWith( 0, '+', '2d8', null, null );
    engine.compute.calls.reset();
    expect(engine.changed.calls.count()).toBe( 1 );
    expect(engine.changed).toHaveBeenCalledWith( 'test', creature, 'aaa[ddd]' );
    engine.changed.calls.reset();

    lib.registered.aaa = {min:0, max:10};

    lib.changeValue(creature, 'aaa[ddd]+2d8');
    expect(creature.test.aaa.ddd ).toBe( 14 );
    expect(engine.compute.calls.count()).toBe( 1 );
    expect(engine.compute).toHaveBeenCalledWith( 7, '+', '2d8', 0, 10 );
    engine.compute.calls.reset();
    expect(engine.changed.calls.count()).toBe( 1 );
    expect(engine.changed).toHaveBeenCalledWith( 'test', creature, 'aaa[ddd]' );
    engine.changed.calls.reset();
  });
  it('Should register', function() {
    spyOn(engine, 'registerLib');
    var lib = new abstractLib('test');
    expect(engine.registerLib.calls.count()).toBe( 1 );
    expect(engine.registerLib).toHaveBeenCalledWith( 'test', lib );

    expect(lib.register).toBeDefined();
    var test = {min:0, max:10};
    lib.register('aaa', test);
    expect(lib.registered.aaa).toBe( test );
    expect(lib.aaa).toBe( test );
  });
  it('Should call changed', function() {
    spyOn(engine, 'registerLib');
    var lib = new abstractLib('test');
    expect(engine.registerLib.calls.count()).toBe( 1 );
    expect(engine.registerLib).toHaveBeenCalledWith( 'test', lib );

    expect(lib.changed).toBeDefined();
    var test = {min:0, max:10, changed: function(){}};
    var test2 = {min:0, max:10, changed: function(){}};
    spyOn(test, 'changed');
    spyOn(test2, 'changed');
    lib.register('aaa', test);
    lib.register('bbb', test2);
    var creature = {aaa: 1};
    lib.changed('ccc', creature, 'test');
    expect(test.changed.calls.count()).toBe( 1 );
    expect(test.changed).toHaveBeenCalledWith( 'ccc', creature, 'test' );
    expect(test2.changed.calls.count()).toBe( 1 );
    expect(test2.changed).toHaveBeenCalledWith( 'ccc', creature, 'test' );
  });
  it('Should prepareChange', function() {
    spyOn(engine, 'registerLib');
    var lib = new abstractLib('test');
    expect(engine.registerLib.calls.count()).toBe( 1 );
    expect(engine.registerLib).toHaveBeenCalledWith( 'test', lib );

    expect(lib.prepareChange).toBeDefined();

    var creature = {};
    lib.prepareChange(creature, 'aaa', 5);
    expect(creature.test).toBeDefined();
    expect(creature.test.aaa).toBe( 5 );
    lib.prepareChange(creature, 'aaa', 7);
    expect(creature.test.aaa).toBe( 5 );
    lib.prepareChange(creature, 'bbb', 7);
    expect(creature.test.bbb).toBe( 7 );
  });
  it('Should change', function() {
    spyOn(engine, 'registerLib');
    var lib = new abstractLib('test');
    expect(engine.registerLib.calls.count()).toBe( 1 );
    expect(engine.registerLib).toHaveBeenCalledWith( 'test', lib );

    expect(lib.change).toBeDefined();

    spyOn(abstractLib.prototype, 'changeValue');
    lib.change();

    expect(lib.changeValue.calls.count()).toBe(0);
    var creature = {};
    lib.change( creature );
    expect(lib.changeValue.calls.count()).toBe(0);
    lib.change( creature, 2 );
    expect(lib.changeValue.calls.count()).toBe(0);
    lib.change( creature, true );
    expect(lib.changeValue.calls.count()).toBe(0);
    lib.change( creature, 'aaa+2d6' );
    expect(lib.changeValue.calls.count()).toBe(1);
    expect(lib.changeValue).toHaveBeenCalledWith( creature, 'aaa+2d6' );
    lib.changeValue.calls.reset();
    lib.change( creature, 'aaa+2d6,bbb-5d20' );
    expect(lib.changeValue.calls.count()).toBe(2);
    expect(lib.changeValue).toHaveBeenCalledWith( creature, 'aaa+2d6' );
    expect(lib.changeValue).toHaveBeenCalledWith( creature, 'bbb-5d20' );
    lib.changeValue.calls.reset();
  });
});
