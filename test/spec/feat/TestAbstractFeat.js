'use strict';

describe('Factory: AbstractFeat', function() {
  beforeEach( module( 'd20-engine' ) );
  var AbstractFeatConstructor;
  var featLib;
  var log;
  beforeEach( inject( function( $log, FeatLib, AbstractFeat ) {
    featLib = FeatLib;
    AbstractFeatConstructor = AbstractFeat;
    log = $log;
  } ) );
  function checkBonus(value, baseBonus, bonus, malus, malusLimit, bonusLimit) {
    expect(value.baseBonus ).toBeDefined();
    expect(value.baseBonus ).toBe(baseBonus);
    expect(value.bonus ).toBeDefined();
    expect(value.bonus ).toBe(bonus);
    expect(value.malus ).toBeDefined();
    expect(value.malus ).toBe(malus);
    expect(value.malusLimit ).toBeDefined();
    expect(value.malusLimit ).toBe(malusLimit);
    expect(value.bonusLimit ).toBeDefined();
    expect(value.bonusLimit ).toBe(bonusLimit);
  }
  it( 'Should return 0 bonus if the creature does not have the feat', function() {
    var feat = new AbstractFeatConstructor('test');
    featLib.register(feat.id, feat);
    feat.bonuses = [
      '+aaa[bbb(ccc)]+73', 'aaa[bbb(ccc)]+79', '-aaa[bbb(ccc)]-83', '!-aaa[bbb(ccc)]-89', '!+aaa[bbb(ccc)]+91',
      '+aaa[bbb(#)]+53', 'aaa[bbb(#)]+59', '-aaa[bbb(#)]-61', '!-aaa[bbb(#)]-67', '!+aaa[bbb(#)]+71',
      '+aaa[#]+31', 'aaa[#]+37', '-aaa[#]-41', '!-aaa[#]-43', '!+aaa[#]+47',
      '+aaa+11', 'aaa+13', '-aaa-17', '!-aaa-19', '!+aaa+23',
      '+#+1', '#+2', '-#-3', '!-#-5', '!+#+7'
    ];
    var creature = {};
    var result = feat.bonus(creature, 'aaa[bbb(ccc)]');
    checkBonus(result, 0, 0, 0, 0, 0);
    result = feat.bonus(creature, 'aaa[any(ccc)]');
    expect(result.any).toBeDefined();
    checkBonus(result.any, 0, 0, 0, 0, 0);
    result = feat.bonus(creature, 'aaa[bbb(any)]');
    expect(result.any).toBeDefined();
    checkBonus(result.any, 0, 0, 0, 0, 0);
    result = feat.bonus(creature, 'aaa[bbb]');
    checkBonus(result, 0, 0, 0, 0, 0);
    result = feat.bonus(creature, 'aaa[any]');
    expect(result.any).toBeDefined();
    checkBonus(result.any, 0, 0, 0, 0, 0);
  } );
  it( 'Should return 0 bonus if the creature have level 0 in feat', function() {
    var feat = new AbstractFeatConstructor('test');
    featLib.register(feat.id, feat);
    feat.bonuses = [
      '+aaa[bbb(ccc)]+73', 'aaa[bbb(ccc)]+79', '-aaa[bbb(ccc)]-83', '!-aaa[bbb(ccc)]-89', '!+aaa[bbb(ccc)]+91',
      '+aaa[bbb(#)]+53', 'aaa[bbb(#)]+59', '-aaa[bbb(#)]-61', '!-aaa[bbb(#)]-67', '!+aaa[bbb(#)]+71',
      '+aaa[#]+31', 'aaa[#]+37', '-aaa[#]-41', '!-aaa[#]-43', '!+aaa[#]+47',
      '+aaa+11', 'aaa+13', '-aaa-17', '!-aaa-19', '!+aaa+23',
      '+#+1', '#+2', '-#-3', '!-#-5', '!+#+7'
    ];
    var creature = { feat: {
      test: {
        any: 0,
        aaa: 0
        }
      }
    };
    var result = feat.bonus(creature, 'aaa[bbb(ccc)]');
    checkBonus(result, 0, 0, 0, 0, 0);
    result = feat.bonus(creature, 'aaa[any(ccc)]');
    expect(result.any).toBeDefined();
    checkBonus(result.any, 0, 0, 0, 0, 0);
    expect(result.aaa).toBeUndefined();
    expect(result.bbb).toBeUndefined();
    expect(result.ccc).toBeUndefined();
    result = feat.bonus(creature, 'aaa[bbb(any)]');
    expect(result.any).toBeDefined();
    checkBonus(result.any, 0, 0, 0, 0, 0);
    expect(result.aaa).toBeUndefined();
    expect(result.bbb).toBeUndefined();
    expect(result.ccc).toBeUndefined();
    result = feat.bonus(creature, 'aaa[bbb]');
    checkBonus(result, 0, 0, 0, 0, 0);
    result = feat.bonus(creature, 'aaa[any]');
    expect(result.any).toBeDefined();
    checkBonus(result.any, 0, 0, 0, 0, 0);
    expect(result.aaa).toBeUndefined();
    expect(result.bbb).toBeUndefined();
    expect(result.ccc).toBeUndefined();
  } );

  it( 'Should return the bonus if the creature have the feat', function() {
    var feat = new AbstractFeatConstructor('test');
    featLib.register(feat.id, feat);
    feat.bonuses = [
      '+aaa[bbb(ccc)]+73', 'aaa[bbb(ccc)]+79', '-aaa[bbb(ccc)]-83', '!-aaa[bbb(ccc)]-89', '!+aaa[bbb(ccc)]+91',
      '+aaa[bbb(#)]+53', 'aaa[bbb(#)]+59', '-aaa[bbb(#)]-61', '!-aaa[bbb(#)]-67', '!+aaa[bbb(#)]+71',
      '+aaa[#]+31', 'aaa[#]+37', '-aaa[#]-41', '!-aaa[#]-43', '!+aaa[#]+47',
      '+aaa+1', 'aaa+2', '-aaa-3', '!-aaa-5', '!+aaa+7',
      '+#+11', '#+13', '-#-17', '!-#-19', '!+#+23'
    ];
    var creature = { feat: {
      test: {
        any: 1,
        ddd: 1
      }
    } };
    spyOn(log, 'debug' ).and.callFake(console.debug);
    var result = feat.bonus(creature, 'aaa[bbb(ccc)]');
    checkBonus(result, 158, 79, 188, 204, 7);
    result = feat.bonus(creature, 'aaa[bbb(ddd)]');
    checkBonus(result, 85, 59, 105, 115, 7);
    result = feat.bonus(creature, 'aaa[any(ccc)]');
    expect(result.any).toBeDefined();
    checkBonus(result.any, 32, 37, 44, 48, 7);
    expect(result.bbb).toBeDefined();
    checkBonus(result.bbb, 126, 79, 144, 156, 71);
    expect(result.aaa).toBeUndefined();
    expect(result.ccc).toBeUndefined();
    expect(result.ddd).toBeUndefined();
    result = feat.bonus(creature, 'aaa[any(ddd)]');
    expect(result.any).toBeDefined();
    checkBonus(result.any, 32, 37, 44, 48, 7);
    expect(result.bbb).toBeDefined();
    checkBonus(result.bbb, 53, 59, 61, 67, 71);
    expect(result.aaa).toBeUndefined();
    expect(result.ccc).toBeUndefined();
    expect(result.ddd).toBeUndefined();
    result = feat.bonus(creature, 'aaa[bbb(any)]');
    expect(result.any).toBeDefined();
    checkBonus(result.any, 85, 59, 105, 115, 7);
    expect(result.ccc).toBeDefined();
    checkBonus(result.ccc, 73, 79, 83, 89, 91);
    expect(result.aaa).toBeUndefined();
    expect(result.bbb).toBeUndefined();
    expect(result.ddd).toBeUndefined();
    result = feat.bonus(creature, 'aaa[bbb]');
    checkBonus(result, 32, 37, 44, 48, 7);
    result = feat.bonus(creature, 'aaa[ddd]');
    checkBonus(result, 32, 37, 44, 48, 7);
    result = feat.bonus(creature, 'aaa[any]');
    expect(result.any).toBeDefined();
    checkBonus(result.any, 32, 37, 44, 48, 7);
    expect(result.aaa).toBeUndefined();
    expect(result.bbb).toBeUndefined();
    expect(result.ccc).toBeUndefined();
    expect(result.ddd).toBeUndefined();
    result = feat.bonus(creature, 'aaa');
    checkBonus(result, 12, 13, 20, 24, 7);
    result = feat.bonus(creature, 'ddd');
    checkBonus(result, 11, 13, 17, 19, 23);
  } );
  it( 'Should return the bonus if the creature have the feat and match condition', function() {
    var feat = new AbstractFeatConstructor('test');
    featLib.register(feat.id, feat);
    feat.bonuses = [
      'feat(test[ddd]>1)|+aaa[bbb(ccc)]+73', 'feat(test[ddd]>1)|aaa[bbb(ccc)]+79', 'feat(test[ddd]>1)|-aaa[bbb(ccc)]-83', 'feat(test[ddd]>1)|!-aaa[bbb(ccc)]-89', 'feat(test[ddd]>1)|!+aaa[bbb(ccc)]+91',
      'feat(test[ddd]<=1)|+aaa[bbb(#)]+53', 'feat(test[ddd]<=1)|aaa[bbb(#)]+59', 'feat(test[ddd]<=1)|-aaa[bbb(#)]-61', 'feat(test[ddd]<=1)|!-aaa[bbb(#)]-67', 'feat(test[ddd]<=1)|!+aaa[bbb(#)]+71',
      'feat(test[ddd]>1)|+aaa[#]+31', 'feat(test[ddd]>1)|aaa[#]+37', 'feat(test[ddd]>1)|-aaa[#]-41', 'feat(test[ddd]>1)|!-aaa[#]-43', 'feat(test[ddd]>1)|!+aaa[#]+47',
      'feat(test[ddd]<=1)|+aaa+1', 'feat(test[ddd]<=1)|aaa+2', 'feat(test[ddd]<=1)|-aaa-3', 'feat(test[ddd]<=1)|!-aaa-5', 'feat(test[ddd]<=1)|!+aaa+7',
      'feat(test[ddd]>1)|+#+11', 'feat(test[ddd]>1)|#+13', 'feat(test[ddd]>1)|-#-17', 'feat(test[ddd]>1)|!-#-19', 'feat(test[ddd]>1)|!+#+23'
    ];
    var creature = { feat: {
      test: {
        any: 1,
        ddd: 1
      }
    } };
    var result = feat.bonus(creature, 'aaa[bbb(ccc)]');
    checkBonus(result, 54, 59, 64, 72, 7);
    result = feat.bonus(creature, 'aaa[bbb(ddd)]');
    checkBonus(result, 54, 59, 64, 72, 7);
    result = feat.bonus(creature, 'aaa[any(ccc)]');
    expect(result.any).toBeDefined();
    checkBonus(result.any, 1, 2, 3, 5, 7);
    expect(result.bbb).toBeDefined();
    checkBonus(result.bbb, 53, 59, 61, 67, 71);
    expect(result.aaa).toBeUndefined();
    expect(result.ccc).toBeUndefined();
    expect(result.ddd).toBeUndefined();
    result = feat.bonus(creature, 'aaa[any(ddd)]');
    expect(result.any).toBeDefined();
    checkBonus(result.any, 1, 2, 3, 5, 7);
    expect(result.bbb).toBeDefined();
    checkBonus(result.bbb, 53, 59, 61, 67, 71);
    expect(result.aaa).toBeUndefined();
    expect(result.ccc).toBeUndefined();
    expect(result.ddd).toBeUndefined();
    result = feat.bonus(creature, 'aaa[bbb(any)]');
    expect(result.any).toBeDefined();
    checkBonus(result.any, 54, 59, 64, 72, 7);
    expect(result.aaa).toBeUndefined();
    expect(result.bbb).toBeUndefined();
    expect(result.ccc).toBeUndefined();
    expect(result.ddd).toBeUndefined();
    result = feat.bonus(creature, 'aaa[bbb]');
    checkBonus(result, 1, 2, 3, 5, 7);
    result = feat.bonus(creature, 'aaa[ddd]');
    checkBonus(result, 1, 2, 3, 5, 7);
    result = feat.bonus(creature, 'aaa[any]');
    expect(result.any).toBeDefined();
    checkBonus(result.any, 1, 2, 3, 5, 7);
    expect(result.aaa).toBeUndefined();
    expect(result.bbb).toBeUndefined();
    expect(result.ccc).toBeUndefined();
    expect(result.ddd).toBeUndefined();
    result = feat.bonus(creature, 'aaa');
    checkBonus(result, 1, 2, 3, 5, 7);
    result = feat.bonus(creature, 'ddd');
    checkBonus(result, 0, 0, 0, 0, Number.POSITIVE_INFINITY);
  } );
});
