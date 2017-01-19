'use strict';

describe('Factory: Engine', function() {
  beforeEach(module('d20-engine'));
  var engine;
  beforeEach(inject(function(Engine) {
    engine = Engine;
  }));
  it('Should define Engine', function() {
    expect(engine).toBeDefined();
  });
  it('Should define Engine.roll', function() {
    expect(engine.roll).toBeDefined();
  });
  it('Should return 0 if bad parameters', function() {
    expect(engine.roll()).toBe( 0 );
    expect(engine.roll( 'd' )).toBe( 0 );
    expect(engine.roll( '1d2d3' )).toBe( 0 );
    expect(engine.roll( 'ad2' )).toBe( 0 );
    expect(engine.roll( '1da' )).toBe( 0 );
  });
  it('Should return parameter if no dice', function() {
    expect(engine.roll( 5 )).toBe( 5 );
    expect(engine.roll( '7' )).toBe( 7 );
    expect(engine.roll( 0.7 )).toBe( 0.7 );
    expect(engine.roll( '0.5' )).toBe( 0.5 );
  });
  it('Should return a random roll of dices', function() {
    spyOn(Math, 'random').and.callFake(function(min, max) {
      return max - 1;
    });
    expect(engine.roll( '1d12' )).toBe( 12 );
    expect(Math.random.calls.count()).toBe( 1 );
    expect(Math.random).toHaveBeenCalledWith( 1, 13 );
    Math.random.calls.reset();

    expect(engine.roll( '2d8' )).toBe( 16 );
    expect(Math.random.calls.count()).toBe( 2 );
    expect(Math.random).toHaveBeenCalledWith( 1, 9 );
    Math.random.calls.reset();

    expect(engine.roll( '4d8', 3 )).toBe( 24 );
    expect(Math.random.calls.count()).toBe( 4 );
    expect(Math.random).toHaveBeenCalledWith( 1, 9 );
    Math.random.calls.reset();

    expect(engine.roll( '4d8,3d8,2d8,1d8', 3 )).toEqual( [24, 24, 16, 8] );
    expect(Math.random.calls.count()).toBe( 10 );
    expect(Math.random).toHaveBeenCalledWith( 1, 9 );
    Math.random.calls.reset();

    expect(engine.roll( '4d8,3d8,2d8,1d8')).toEqual( [32, 24, 16, 8] );
    expect(Math.random.calls.count()).toBe( 10 );
    expect(Math.random).toHaveBeenCalledWith( 1, 9 );
    Math.random.calls.reset();
  });
  it('Should define Engine.compute', function() {
    expect(engine.compute).toBeDefined();
  });
  it('Should return currentValue if bad parameters', function() {
    expect(engine.compute( 5 )).toBe( 5 );
    expect(engine.compute( 7, 'd' )).toBe( 7 );
    expect(engine.compute( 11, 'd', '2d12', 0, 100 )).toBe( 11 );
    expect(engine.compute( 13, '/', 'd', 0, 100 )).toBe( 13 );
    expect(engine.compute( 17, '/', '1d2d3', 0, 100 )).toBe( 17 );
    expect(engine.compute( 19, '/', 'ad2', 0, 100 )).toBe( 19 );
    expect(engine.compute( 23, '/', '1da', 0, 100 )).toBe( 23 );
  });
  it('Should return updated value', function() {
    spyOn(Math, 'random').and.callFake(function(min, max) {
      return max - 1;
    });
    expect(engine.compute( 5, '+', '2d12' )).toBe( 29 );
    expect(engine.compute( 7, '-', '2d4' )).toBe( -1 );
    expect(engine.compute( 11, '*', '1d6' )).toBe( 66 );
    expect(engine.compute( 12, '/', '1d4' )).toBe( 3 );
    expect(engine.compute( 17, '=', '1d8' )).toBe( 8 );

    expect(engine.compute( 5, '+', '100', 0, 50 )).toBe( 50 );
    expect(engine.compute( 5, '+', '100', 0, 75 )).toBe( 75 );
    expect(engine.compute( 5, '-', '100', 1, 50 )).toBe( 1 );
    expect(engine.compute( 5, '-', '100', 0, 50 )).toBe( 0 );
    expect(engine.compute( 11, '*', '6', 0, 50 )).toBe( 50 );
    expect(engine.compute( 11, '*', '6', 0, 60 )).toBe( 60 );
    expect(engine.compute( 120, '/', '4', 50, 150 )).toBe( 50 );
    expect(engine.compute( 120, '/', '0.5', 50, 150 )).toBe( 150 );
  });
  it('Should define Engine.registerLib', function() {
    expect(engine.registerLib).toBeDefined();
  });
  it('Should provides registered libs', function() {
    engine.registerLib('test', {a:5});
    expect(engine.test).toBeDefined();
    expect(engine.test.a).toBeDefined();
    expect(engine.test.a).toBe( 5 );
  });
  it('Should define Engine.change', function() {
    expect(engine.change).toBeDefined();
  });
  it('Should call change method of requested lib', function() {
    var testLib = {change: function(){}};
    spyOn(testLib, 'change');
    engine.registerLib('test', testLib);
    engine.change('aaa', 5, 7);
    expect(testLib.change.calls.count()).toBe( 0 );
    engine.change('test', 5, 7);
    expect(testLib.change.calls.count()).toBe( 1 );
    expect(testLib.change).toHaveBeenCalledWith( 5, 7 );
  });
  it('Should define Engine.changed', function() {
    expect(engine.changed).toBeDefined();
  });
  it('Should call changed method of requested lib', function() {
    var testLib = {changed: function(){}};
    var testLib2 = {changed: function(){}};
    spyOn(testLib, 'changed');
    spyOn(testLib2, 'changed');
    engine.registerLib('test', testLib);
    engine.registerLib('test2', testLib2);
    engine.changed('aaa', 5, 7);
    expect(testLib.changed.calls.count()).toBe( 0 );
    expect(testLib2.changed.calls.count()).toBe( 0 );
    engine.changed('test', 5, 7);
    expect(testLib.changed.calls.count()).toBe( 1 );
    expect(testLib.changed).toHaveBeenCalledWith( 'test', 5, 7 );
    expect(testLib2.changed.calls.count()).toBe( 1 );
    expect(testLib2.changed).toHaveBeenCalledWith( 'test', 5, 7 );
  });
});
