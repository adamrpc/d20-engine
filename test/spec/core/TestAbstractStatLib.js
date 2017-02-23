'use strict';

describe('Factory: AbstractStatLib', function() {
  beforeEach( module( 'd20-engine' ) );
  var abstractLib;
  var log;
  var engine = {
    compute: function(){},
    registerLib: function(){},
    changed: function(){}
  };
  beforeEach(module(function ($provide) {
    $provide.value('Engine', engine);
  }));
  beforeEach( inject( function( AbstractStatLib, $log ) {
    abstractLib = AbstractStatLib;
    log = $log;
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

    spyOn(log, 'warn' ).and.callFake(console.log);
    lib.changeValue(creature, 'aaa+2d8');
    expect(creature.test ).toBeDefined();
    expect(creature.test.aaa ).toBeDefined();
    expect(creature.test.aaa.any ).toBeDefined();
    expect(creature.test.aaa.any ).toBe( 7 );
    expect(engine.compute.calls.count()).toBe( 1 );
    expect(engine.compute).toHaveBeenCalledWith( 0, '+', '2d8', null, null );
    engine.compute.calls.reset();
    expect(engine.changed.calls.count()).toBe( 1 );
    expect(engine.changed).toHaveBeenCalledWith( 'test', creature, 'aaa' );
    engine.changed.calls.reset();

    lib.registered.aaa = {min:0, max:10};

    lib.changeValue(creature, 'aaa+2d8');
    expect(creature.test.aaa.any ).toBe( 14 );
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
    expect(creature.test.aaa.ddd.any ).toBeDefined();
    expect(creature.test.aaa.ddd.any ).toBe( 7 );
    expect(engine.compute.calls.count()).toBe( 1 );
    expect(engine.compute).toHaveBeenCalledWith( 0, '+', '2d8', null, null );
    engine.compute.calls.reset();
    expect(engine.changed.calls.count()).toBe( 1 );
    expect(engine.changed).toHaveBeenCalledWith( 'test', creature, 'aaa[ddd]' );
    engine.changed.calls.reset();

    lib.registered.aaa = {min:0, max:10};

    lib.changeValue(creature, 'aaa[ddd]+2d8');
    expect(creature.test.aaa.ddd.any ).toBe( 14 );
    expect(engine.compute.calls.count()).toBe( 1 );
    expect(engine.compute).toHaveBeenCalledWith( 7, '+', '2d8', 0, 10 );
    engine.compute.calls.reset();
    expect(engine.changed.calls.count()).toBe( 1 );
    expect(engine.changed).toHaveBeenCalledWith( 'test', creature, 'aaa[ddd]' );
    engine.changed.calls.reset();

    lib.changeValue(creature, 'bbb[eee(fff)]+2d8');
    expect(creature.test ).toBeDefined();
    expect(creature.test.bbb ).toBeDefined();
    expect(creature.test.bbb.eee ).toBeDefined();
    expect(creature.test.bbb.eee.fff ).toBeDefined();
    expect(creature.test.bbb.eee.fff ).toBe( 7 );
    expect(engine.compute.calls.count()).toBe( 1 );
    expect(engine.compute).toHaveBeenCalledWith( 0, '+', '2d8', null, null );
    engine.compute.calls.reset();
    expect(engine.changed.calls.count()).toBe( 1 );
    expect(engine.changed).toHaveBeenCalledWith( 'test', creature, 'bbb[eee(fff)]' );
    engine.changed.calls.reset();

    lib.registered.bbb = {min:0, max:10};

    lib.changeValue(creature, 'bbb[eee(fff)]+2d8');
    expect(creature.test.bbb.eee.fff ).toBe( 14 );
    expect(engine.compute.calls.count()).toBe( 1 );
    expect(engine.compute).toHaveBeenCalledWith( 7, '+', '2d8', 0, 10 );
    engine.compute.calls.reset();
    expect(engine.changed.calls.count()).toBe( 1 );
    expect(engine.changed).toHaveBeenCalledWith( 'test', creature, 'bbb[eee(fff)]' );
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
  it('Should check a condition', function() {
    spyOn(engine, 'registerLib');
    var lib = new abstractLib('test');
    expect(engine.registerLib.calls.count()).toBe( 1 );
    expect(engine.registerLib).toHaveBeenCalledWith( 'test', lib );

    expect(lib.checkCondition).toBeDefined();

    expect(lib.checkCondition() ).toBe(true);
    var creature = {};
    expect(lib.checkCondition(creature) ).toBe(true);
    expect(lib.checkCondition(creature, 'bbb[ccc]>=1') ).toBe(false);
    expect(lib.checkCondition(creature, 'bbb[ccc]>1') ).toBe(false);
    expect(lib.checkCondition(creature, 'bbb[ccc]=1') ).toBe(false);
    expect(lib.checkCondition(creature, 'bbb[ccc]!=1') ).toBe(true);
    expect(lib.checkCondition(creature, 'bbb[ccc]=0') ).toBe(true);
    expect(lib.checkCondition(creature, 'bbb[ccc]!=0') ).toBe(false);
    expect(lib.checkCondition(creature, 'bbb[ccc]<=1') ).toBe(true);
    expect(lib.checkCondition(creature, 'bbb[ccc]<1') ).toBe(true);
    expect(lib.checkCondition(creature, 'bbb[ccc]?') ).toBe(false);
    expect(lib.checkCondition(creature, 'bbb[ccc]!') ).toBe(true);
    expect(lib.checkCondition(creature, 'bbb>=1') ).toBe(false);
    expect(lib.checkCondition(creature, 'bbb>1') ).toBe(false);
    expect(lib.checkCondition(creature, 'bbb=1') ).toBe(false);
    expect(lib.checkCondition(creature, 'bbb!=1') ).toBe(true);
    expect(lib.checkCondition(creature, 'bbb=0') ).toBe(true);
    expect(lib.checkCondition(creature, 'bbb!=0') ).toBe(false);
    expect(lib.checkCondition(creature, 'bbb<=1') ).toBe(true);
    expect(lib.checkCondition(creature, 'bbb<1') ).toBe(true);
    expect(lib.checkCondition(creature, 'bbb?') ).toBe(false);
    expect(lib.checkCondition(creature, 'bbb!') ).toBe(true);

    creature.test = {};
    creature.test.bbb = {any: 1};
    spyOn(log, 'warn' ).and.callFake(console.log);
    expect(lib.checkCondition(creature) ).toBe(true);
    expect(lib.checkCondition(creature, 'bbb[ccc]>=1') ).toBe(true);
    expect(lib.checkCondition(creature, 'bbb[ccc]>1') ).toBe(false);
    expect(lib.checkCondition(creature, 'bbb[ccc]=1') ).toBe(true);
    expect(lib.checkCondition(creature, 'bbb[ccc]!=1') ).toBe(false);
    expect(lib.checkCondition(creature, 'bbb[ccc]=0') ).toBe(false);
    expect(lib.checkCondition(creature, 'bbb[ccc]!=0') ).toBe(true);
    expect(lib.checkCondition(creature, 'bbb[ccc]<=1') ).toBe(true);
    expect(lib.checkCondition(creature, 'bbb[ccc]<1') ).toBe(false);
    expect(lib.checkCondition(creature, 'bbb[ccc]?') ).toBe(true);
    expect(lib.checkCondition(creature, 'bbb[ccc]!') ).toBe(false);
    expect(lib.checkCondition(creature, 'bbb>=1') ).toBe(true);
    expect(lib.checkCondition(creature, 'bbb>1') ).toBe(false);
    expect(lib.checkCondition(creature, 'bbb=1') ).toBe(true);
    expect(lib.checkCondition(creature, 'bbb!=1') ).toBe(false);
    expect(lib.checkCondition(creature, 'bbb=0') ).toBe(false);
    expect(lib.checkCondition(creature, 'bbb!=0') ).toBe(true);
    expect(lib.checkCondition(creature, 'bbb<=1') ).toBe(true);
    expect(lib.checkCondition(creature, 'bbb<1') ).toBe(false);
    expect(lib.checkCondition(creature, 'bbb?') ).toBe(true);
    expect(lib.checkCondition(creature, 'bbb!') ).toBe(false);

    creature.test.bbb = {any: 1};
    creature.test.bbb.ccc = {any: 2};
    expect(lib.checkCondition(creature) ).toBe(true);
    expect(lib.checkCondition(creature, 'bbb[ccc]>=2') ).toBe(true);
    expect(lib.checkCondition(creature, 'bbb[ccc]>2') ).toBe(false);
    expect(lib.checkCondition(creature, 'bbb[ccc]=2') ).toBe(true);
    expect(lib.checkCondition(creature, 'bbb[ccc]!=2') ).toBe(false);
    expect(lib.checkCondition(creature, 'bbb[ccc]=0') ).toBe(false);
    expect(lib.checkCondition(creature, 'bbb[ccc]!=0') ).toBe(true);
    expect(lib.checkCondition(creature, 'bbb[ccc]<=2') ).toBe(true);
    expect(lib.checkCondition(creature, 'bbb[ccc]<2') ).toBe(false);
    expect(lib.checkCondition(creature, 'bbb[ccc]?') ).toBe(true);
    expect(lib.checkCondition(creature, 'bbb[ccc]!') ).toBe(false);
    expect(lib.checkCondition(creature, 'bbb>=2') ).toBe(false);
    expect(lib.checkCondition(creature, 'bbb>2') ).toBe(false);
    expect(lib.checkCondition(creature, 'bbb=2') ).toBe(false);
    expect(lib.checkCondition(creature, 'bbb!=2') ).toBe(true);
    expect(lib.checkCondition(creature, 'bbb=0') ).toBe(false);
    expect(lib.checkCondition(creature, 'bbb!=0') ).toBe(true);
    expect(lib.checkCondition(creature, 'bbb<=2') ).toBe(true);
    expect(lib.checkCondition(creature, 'bbb<2') ).toBe(true);
    expect(lib.checkCondition(creature, 'bbb?') ).toBe(true);
    expect(lib.checkCondition(creature, 'bbb!') ).toBe(false);

    creature.test.bbb.ddd = {any: 2};
    expect(lib.checkCondition(creature, 'bbb[ccc]>=2') ).toBe(true);
    expect(lib.checkCondition(creature, 'bbb[ccc]>2') ).toBe(false);
    expect(lib.checkCondition(creature, 'bbb[ccc]=2') ).toBe(true);
    expect(lib.checkCondition(creature, 'bbb[ccc]!=2') ).toBe(false);
    expect(lib.checkCondition(creature, 'bbb[ccc]=0') ).toBe(false);
    expect(lib.checkCondition(creature, 'bbb[ccc]!=0') ).toBe(true);
    expect(lib.checkCondition(creature, 'bbb[ccc]<=2') ).toBe(true);
    expect(lib.checkCondition(creature, 'bbb[ccc]<2') ).toBe(false);
    expect(lib.checkCondition(creature, 'bbb[ccc]?') ).toBe(true);
    expect(lib.checkCondition(creature, 'bbb[ccc]!') ).toBe(false);
    expect(lib.checkCondition(creature, 'bbb[ddd]>=2') ).toBe(true);
    expect(lib.checkCondition(creature, 'bbb[ddd]>2') ).toBe(false);
    expect(lib.checkCondition(creature, 'bbb[ddd]=2') ).toBe(true);
    expect(lib.checkCondition(creature, 'bbb[ddd]!=2') ).toBe(false);
    expect(lib.checkCondition(creature, 'bbb[ddd]=0') ).toBe(false);
    expect(lib.checkCondition(creature, 'bbb[ddd]!=0') ).toBe(true);
    expect(lib.checkCondition(creature, 'bbb[ddd]<=2') ).toBe(true);
    expect(lib.checkCondition(creature, 'bbb[ddd]<2') ).toBe(false);
    expect(lib.checkCondition(creature, 'bbb[ddd]?') ).toBe(true);
    expect(lib.checkCondition(creature, 'bbb[ddd]!') ).toBe(false);
    expect(lib.checkCondition(creature, 'bbb>=2') ).toBe(false);
    expect(lib.checkCondition(creature, 'bbb>2') ).toBe(false);
    expect(lib.checkCondition(creature, 'bbb=2') ).toBe(false);
    expect(lib.checkCondition(creature, 'bbb!=2') ).toBe(true);
    expect(lib.checkCondition(creature, 'bbb=0') ).toBe(false);
    expect(lib.checkCondition(creature, 'bbb!=0') ).toBe(true);
    expect(lib.checkCondition(creature, 'bbb<=2') ).toBe(true);
    expect(lib.checkCondition(creature, 'bbb<2') ).toBe(true);
    expect(lib.checkCondition(creature, 'bbb?') ).toBe(true);
    expect(lib.checkCondition(creature, 'bbb!') ).toBe(false);
  });
  it('Should return property value', function() {
    spyOn(engine, 'registerLib');
    var lib = new abstractLib('test');
    expect(engine.registerLib.calls.count()).toBe( 1 );
    expect(engine.registerLib).toHaveBeenCalledWith( 'test', lib );
    expect(lib.getValue).toBeDefined();

    var creature = {};
    expect(lib.getValue(creature, 'aaa[bbb(ccc)]')).toBe( 0 );
    creature.test = {};
    expect(lib.getValue(creature, 'aaa[bbb(ccc)]')).toBe( 0 );
    creature.test.aaa = 2;
    expect(lib.getValue(creature, 'aaa[bbb(ccc)]')).toBe( 2 );
    creature.test.aaa = {};
    expect(lib.getValue(creature, 'aaa[bbb(ccc)]')).toBe( 0 );
    creature.test.aaa.bbb = 3;
    expect(lib.getValue(creature, 'aaa[bbb(ccc)]')).toBe( 3 );
    creature.test.aaa.bbb = {};
    expect(lib.getValue(creature, 'aaa[bbb(ccc)]')).toBe( 0 );
    creature.test.aaa.bbb.ccc = 5;
    expect(lib.getValue(creature, 'aaa[bbb(ccc)]')).toBe( 5 );
    creature.test.ddd = 7;
    expect(lib.getValue(creature, 'ddd')).toBe( 7 );
    creature.test.ddd = {eee: 11};
    expect(lib.getValue(creature, 'ddd[eee]')).toBe( 11 );
    creature.test.ddd = {eee: {any: 13}};
    expect(lib.getValue(creature, 'ddd[eee]')).toBe( 13 );
    creature.test.ddd = {any: 17, eee: {any: 13, fff: 5}};
    expect(lib.getValue(creature, 'ddd')).toBe( 17 );
    expect(lib.getValue(creature, 'ddd[ggg]')).toBe( 17 );
    expect(lib.getValue(creature, 'ddd[eee]')).toBe( 13 );
    expect(lib.getValue(creature, 'ddd[eee(fff)]')).toBe( 5 );
    expect(lib.getValue(creature, 'ddd[eee(hhh)]')).toBe( 13 );
  });
});
