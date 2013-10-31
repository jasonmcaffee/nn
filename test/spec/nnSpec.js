describe("nn", function () {
    'use strict';

    //setup
    var obj;
    beforeEach(function () {
        obj = {
            prop1: 'a',
            prop2: {
                prop2_1: 'b',
                func2: function (param1, param2, param3) {
                    return this.prop2_1 + param1 + param2 + param3;
                },
                prop2_2: 'b2',
                prop2_3:{
                    prop2_3_1: 'f',
                    prop2_3_2: 'g'
                }
            },
            prop3: {
                prop3_1: {
                    prop3_1_1: 'c'
                }
            },
            prop4: [
                'd',
                1,
                {
                    prop4_2: {
                        prop4_2_1: {
                            prop4_2_1_1: 'e'
                        }
                    }
                }
            ],
            undef: undefined,
            nul: null,
            func1: function () {
                return this.prop1;
            }
        };
    });

    function timed(f) {
        var start = new Date().getTime();
        f();
        var end = new Date().getTime();
        var total = end - start;
        console.info('time was: ' + total + ' ms');
        return total;
    }


    it("should be able to access property values of object literals by using chained function calls", function () {
        var prop1 = nn(obj)('prop1').val;
        expect(prop1).toEqual(obj.prop1);

        var prop2 = nn(obj)('prop2').val;
        expect(prop2).toEqual(obj.prop2);

        var prop2_1 = nn(obj)('prop2')('prop2_1').val;
        expect(prop2_1).toEqual(obj.prop2.prop2_1);

        var prop3_1_1 = nn(obj)('prop3')('prop3_1')('prop3_1_1').val;
        expect(prop3_1_1).toEqual(obj.prop3.prop3_1.prop3_1_1);

        var nul = nn(obj)('nul').val;
        expect(nul).toEqual(obj.nul);
    });

    it("should be able to access property values of object literals by using . notation selectors", function () {
        var prop2_1 = nn(obj)('prop2.prop2_1').val;
        expect(prop2_1).toEqual(obj.prop2.prop2_1);

        var prop3_1_1 = nn(obj)('prop3.prop3_1.prop3_1_1').val;
        expect(prop3_1_1).toEqual(obj.prop3.prop3_1.prop3_1_1);
    });

    it("should be able to access property values of object literals by using a mix of . notation selectors and chained function calls", function () {
        var prop3_1_1 = nn(obj)('prop3.prop3_1')('prop3_1_1').val;
        expect(prop3_1_1).toEqual(obj.prop3.prop3_1.prop3_1_1);

        prop3_1_1 = nn(obj)('prop3')('prop3_1.prop3_1_1').val;
        expect(prop3_1_1).toEqual(obj.prop3.prop3_1.prop3_1_1);
    });

    it("should be able to access property values of undefined or null properties and the val should be undefined", function () {
        var undef = nn(obj)('does')('not.exist').val;
        expect(undef).toEqual(undefined);
    });

    it("should be able to handle null or undefined query objects", function () {
        var undef = nn(null)('does')('not')('exist').val;
        expect(undef).toEqual(undefined);

        undef = nn(undefined)('does')('not')('exist').val;
        expect(undef).toEqual(undefined);
    });

    it("should be able to handle null or undefined selectors", function () {
        var undef = nn(obj)(undefined)(null)(undefined).val;
        expect(undef).toEqual(undefined);

        undef = nn(null)(undefined)(null)(undefined).val;
        expect(undef).toEqual(undefined);
    });

    it("should be able to access array items with a number selector", function () {
        var prop4_0 = nn(obj)('prop4')(0).val;
        expect(prop4_0).toEqual(obj.prop4[0]);

        var prop4_1 = nn(obj)('prop4')(1).val;
        expect(prop4_1).toEqual(obj.prop4[1]);

        var prop4_2 = nn(obj)('prop4')(2).val;
        expect(prop4_2).toEqual(obj.prop4[2]);

        var undef = nn(obj)('prop4')(999).val;
        expect(undef).toEqual(undefined);

        var undef = nn(obj)('prop4')(undefined).val;
        expect(undef).toEqual(undefined);
    });

    it("should be able to access array items with a number selector and continue to select", function () {

        var prop4_2 = nn(obj)('prop4')(2)('prop4_2').val;
        expect(prop4_2).toEqual(obj.prop4[2].prop4_2);

        var prop4_2_1 = nn(obj)('prop4')(2)('prop4_2.prop4_2_1').val;
        expect(prop4_2_1).toEqual(obj.prop4[2].prop4_2.prop4_2_1);
    });

    it("should allow functions to be executed with their original context", function () {
        var result = nn(obj)('func1').func();
        expect(result).toEqual(obj.prop1);
    });

    it("should allow functions to be executed with parameters", function () {
        var nnResult = nn(obj)('prop2.func2').func('test', 'passing', 'params');
        var nnResult2 = nn(obj)('prop2')('func2').func('test', 'passing', 'params');
        var normalResult = obj.prop2.func2('test', 'passing', 'params');
        expect(nnResult).toEqual(normalResult);
        expect(nnResult2).toEqual(normalResult);
    });

    it("should be able to execute undefined functions", function () {
        var result = nn(obj)('nonExistingFunc').func(123);
        expect(result).toEqual(undefined);
    });

    it("should build a full selector", function(){
//        var prop1 = nn(obj)('prop1', 123).val;
//        expect(prop1).toEqual(123);
//
//        //should set prop1 to new object if it does not exist. (null, or undefined);
//        var prop2_1 = nn(obj)('prop2.prop2_1', 123).val;
//        expect(prop2_1).toEqual(123);
//
//        //and chain
//        var prop1_1 = nn(obj)('prop1', {})('prop1_1', 123).val;
//
        //be careful
        var nnObj = nn(obj);
        var nnProp2 = nnObj('prop2');
        var nnProp2selector = nnProp2._selectContext.fullSelector;
        expect(nnProp2selector).toEqual('prop2');
        expect(nnProp2._selectContext.currentDepth).toEqual(1);

        var nnProp2_1selector = nnProp2('prop2_1')._selectContext.fullSelector;
        expect(nnProp2_1selector).toEqual('prop2.prop2_1');

        var nnProp2_2selector = nnProp2('prop2_2')._selectContext.fullSelector;
        expect(nnProp2_2selector).toEqual('prop2.prop2_2');

        //var nnProp2_1 = nnProp2('prop2_1')._selectContext.fullSelector;
        //expect(nnProp2_1).toEqual('prop2.prop2_1');
        //this cannot work
        //nn(null)('prop1', 123);
        //what to do when they set a property of a number? fail silently?
    });
    //this does not accurately reflect browser performance, and is relative to my machine. you can probably ignore this...
    it("should be relatively fast", function () {
        var result, iterations = 100000, normalTime, nnTime;

        function normal() {
            if (obj && obj.prop3 && obj.prop3.prop3_1) {
                result = obj.prop3.prop3_1.prop3_1_1;
            }
        }

        function usingNN() {
            result = nn(obj)('prop3.prop3_1.prop3_1_1').val;
        }

        normalTime = timed(function () {
            for (var i = 0; i < iterations; ++i) {
                normal();
            }
            expect(result).toEqual('c');
            result = null;
        });

        nnTime = timed(function () {
            for (var i = 0; i < iterations; ++i) {
                usingNN();
            }
            expect(result).toEqual('c');
            result = null;
        });
        var relativeTimeToBeat = normalTime * 50 + 50;
        expect(nnTime).toBeLessThan(relativeTimeToBeat);
    });


});