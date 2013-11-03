describe("nn", function () {
    'use strict';

    //setup
    var obj, demoOneObj;
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

        demoOneObj = {
            people: [
                //person 1
                {
                    name:  {
                        first: 'jason',
                        last: 'mcaffee'
                    }
                },
                null,
                undefined,
                {},
                "",
                123,
                {
                    name:{
                        first: 'nolast'
                    }
                },
                function(){}
            ]
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

    it("should demonstrate normal safe navigation compared to nn safe navigation", function(){
        //normal usage
        var normalUsageResult = [], fullName;
        if(demoOneObj && demoOneObj.people){
            for(var i = 0; i < demoOneObj.people.length; ++i){
                var person = demoOneObj.people[i];
                if(person && person.name){ //true story: i missed a check here for person and blew up when i started adding more test cases.
                    fullName = person.name.first + " " + person.name.last;
                    normalUsageResult.push(fullName);
                }
            }
        }

        validateResult(normalUsageResult);

        //nn usage
        var nnUsageResult1 = [], fullName;
        nn(demoOneObj)('people').each(function(x, person, nnPerson){
            if(nnPerson('name').val){
                fullName = nnPerson('name.first').val + " " + nnPerson('name.last').val;
                nnUsageResult1.push(fullName);
            }
        });

        validateResult(nnUsageResult1);

        //nn usage 2
        var nnUsageResult2 = [], fullName;
        for(var x = 0; x < nn(demoOneObj)('people.length').val; ++x){
            var nnPerson = nn(demoOneObj)('people')(x);
            if(nnPerson('name').val){
                fullName = nnPerson('name.first').val + " " + nnPerson('name.last').val;
                nnUsageResult2.push(fullName);
            }
        }

        validateResult(nnUsageResult2);

        //nn usage with caching
        var nnUsageResult3 = [], fullName;
        var people = nn(demoOneObj)('people');
        for(var x = 0; x < people('length').val; ++x){
            var nnPerson = people(x);
            var nnPersonName = nnPerson('name');
            if(nnPersonName.val){
                fullName = nnPersonName('first').val + " " + nnPersonName('last').val;
                nnUsageResult3.push(fullName);
            }
        }

        validateResult(nnUsageResult3);

        function validateResult(result){
            expect(result.length).toEqual(2);
            expect(result[0]).toEqual("jason mcaffee");
            expect(result[1]).toEqual("nolast undefined");
        }
    });

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

        expect(nn(obj)('prop4')('length').val).toEqual(3);
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

//Tools ================================================================================================================
    it("should provide an each function to simplify iterating over arrays", function(){
        var resultCount = 0;
        nn(obj)('prop4').each(function(i, item, nnItem){
            expect(resultCount++).toEqual(i);
            expect(obj.prop4[i]).toEqual(item);

        });
        expect(resultCount).toEqual(3);
    });
//Setting ==============================================================================================================
    //precursor to being able to set. not sure if fullSelector will be public. for now, consider it internal and do not use it.
    it("should build a full selector and know depth in chain", function(){
        //be careful
        var nnObj = nn(obj);
        var nnProp2 = nnObj('prop2');
        var nnProp2selector = nnProp2._selectContext.fullSelector;
        expect(nnProp2selector).toEqual('prop2');
        expect(nnProp2._selectContext.currentDepth).toEqual(1);

        var nnProp2_1 = nnProp2('prop2_1');
        var nnProp2_1selector = nnProp2('prop2_1')._selectContext.fullSelector;
        expect(nnProp2_1selector).toEqual('prop2.prop2_1');
        expect(nnProp2_1._selectContext.currentDepth).toEqual(2);

        var nnProp2_2= nnProp2('prop2_2');
        var nnProp2_2selector = nnProp2('prop2_2')._selectContext.fullSelector;
        expect(nnProp2_2selector).toEqual('prop2.prop2_2');
        expect(nnProp2_2._selectContext.currentDepth).toEqual(2);

        expect(nnObj('prop2')('prop2_1')._selectContext.fullSelector).toEqual('prop2.prop2_1');
        expect(nnObj('prop2.prop2_2')._selectContext.fullSelector).toEqual('prop2.prop2_2');

        var nnProp4 = nnObj('prop4');
        var nnProp4selector = nnProp4._selectContext.fullSelector;
        expect(nnProp4selector).toEqual('prop4');

        var nnProp4index2 = nnObj('prop4')(2);
        var nnProp4index2selector = nnProp4index2._selectContext.fullSelector;
        expect(nnProp4index2selector).toEqual('prop4[2]');

        expect(nnObj('prop4')(2)('prop4_2')('prop4_2_1.prop4_2_1_1')._selectContext.fullSelector).toEqual('prop4[2].prop4_2.prop4_2_1.prop4_2_1_1');
        expect(nnObj('prop4')(2)('prop4_2.prop4_2_1')('prop4_2_1_1')._selectContext.fullSelector).toEqual('prop4[2].prop4_2.prop4_2_1.prop4_2_1_1');
        expect(nnObj('prop4')(2)('prop4_2')('prop4_2_1.prop4_2_1_1')._selectContext.currentDepth).toEqual(5);
        expect(nnObj('prop4')(2)('prop4_2.prop4_2_1.prop4_2_1_1')._selectContext.currentDepth).toEqual(5);

        //test nulls
        expect(nn(null)('1234')._selectContext.fullSelector).toEqual('1234');
        expect(nn(undefined)('1234')._selectContext.fullSelector).toEqual('1234');
        expect(nn(undefined)('1234')(null)._selectContext.fullSelector).toEqual('1234.null');

        expect(nn(obj)(undefined)._selectContext.fullSelector).toEqual('undefined');
        expect(nn(obj)(undefined)(null)._selectContext.fullSelector).toEqual('undefined.null');
        expect(nn(obj)(undefined)(null)('prop1')._selectContext.fullSelector).toEqual('undefined.null.prop1');

        //this cannot work
        //nn(null)('prop1', 123);
        //what to do when they set a property of a number? fail silently? e.g. 2.someProp
    });

    it('should allow object properties to be set', function(){
        var nnObj = nn(obj);
        expect(nnObj('prop1', 123).val).toEqual(123);

        //objects
        expect(nnObj('newProp1', {}).val).toEqual({});
        expect(nnObj('newProp1', {})('newProp1_1', 123).val).toEqual(123);
        expect(obj.newProp1.newProp1_1).toEqual(123);

        var result = nnObj('newProp3',{ prop3_1:'a'})('prop3_2', 'b');
        expect(result.val).toEqual('b');
        expect(obj.newProp3.prop3_1).toEqual('a');
        expect(obj.newProp3.prop3_2).toEqual('b');

    });

    it('should allow array properties to be set', function(){
        var nnObj = nn(obj);

        //arrays
        expect(nnObj('newArr1', ['replaced', 'the', 'deuce'])(0, 'what').val).toEqual('what');
        expect(obj.newArr1[0]).toEqual('what');
        expect(obj.newArr1[1]).toEqual('the');
        expect(obj.newArr1[2]).toEqual('deuce');
    });

    it('should allow handle invalid setting', function(){
        var nnObj = nn(obj);

        //numbers - bad sets (eg. trying to give a number a property.  '123.someProp')
        expect(nnObj('aNumber', 1)('numbersCantHaveProperties', 'what').val).toEqual(undefined);
        expect(obj.aNumber).toEqual(1);
    });

//Speed Benchmark (just a rough guideline. doesnt always pass.) ========================================================
    //this does not accurately reflect browser performance, and is relative to my machine. you can probably ignore this...
//    it("should be relatively fast", function () {
//        var result, iterations = 100000, normalTime, nnTime;
//
//        function normal() {
//            if (obj && obj.prop3 && obj.prop3.prop3_1) {
//                result = obj.prop3.prop3_1.prop3_1_1;
//            }
//        }
//
//        function usingNN() {
//            result = nn(obj)('prop3.prop3_1.prop3_1_1').val;
//        }
//
//        normalTime = timed(function () {
//            for (var i = 0; i < iterations; ++i) {
//                normal();
//            }
//            expect(result).toEqual('c');
//            result = null;
//        });
//
//        nnTime = timed(function () {
//            for (var i = 0; i < iterations; ++i) {
//                usingNN();
//            }
//            expect(result).toEqual('c');
//            result = null;
//        });
//        var setLogicTimeIncrease = 5;
//        var relativeTimeToBeat = normalTime * 50 + 50 + setLogicTimeIncrease;
//        expect(nnTime).toBeLessThan(relativeTimeToBeat);
//    });


});