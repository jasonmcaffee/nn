/**
 * Never Null version {{version}}
 *
 * {{! NOTE: this file is a template, and requires compilation before use. Check the dist folder for the compiled version. }}
 *
 * The MIT License (MIT)
 *
 * Copyright (c) 2014 Jason McAffee
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
(function(){
    'use strict';

    //Performance Considerations
    //  inline work is slightly faster than a function call
    //http://jsperf.com/inline-work-vs-call-function
    //  if statements are faster than ternary  (not the case for fullSelector construction)
    //http://jsperf.com/ternary-vs-switch/8
    //  closures pretty fast
    //http://jsperf.com/closure-vs-bind-vs-instance
    //  triple equal is the same as double equal, unless comparing different types
    //http://jsperf.com/triple-equals-vs-double-equals/9
    //  named functions are slightly faster than faster than unnamed functions
    //http://jsperf.com/named-vs-anonymous-functions/2

    var numberType = typeof 0,
        stringType = typeof "",
        emptyFunction = function () {
        }, //needed for undefined function execution
        functionType = typeof emptyFunction,
        splitter = ".", openArray = '[', closeArray = ']';

    /**
     * Sets the context of the previousSelectContext
     * @param previousSelectContext
     * @param selector
     * @param newValue
     */
    function set(previousSelectContext, selector, newValue){
        if(previousSelectContext && previousSelectContext.context){
            previousSelectContext.context[selector] = newValue;
        }
    }
    /**
     * TODO: try providing a select that takes n params "prop1", "prop1_1", "prop2" if performance improves because of it.
     * Recursive query select function generator.
     * @returns {function} - closure bound to the last context
     */
    function select(previousSelectContext, selector, context, newValue) {
        var selectorType = typeof selector,
            shouldSet = newValue,
            dotSplit,
            propertyName,
            previousContext; //needed for function execution

        //determine what to do based on the selector type.
        if (selectorType === stringType) {
            dotSplit = selector.split(splitter);
        } else if (selectorType === numberType) {
            dotSplit = [selector];
        } else {
            context = null;//handle undefined selectors. e.g. nn(obj)(undefined)
        }

        //create a context which can be bound to the next select depth.
        var selectContext = {
            previousDepth:previousSelectContext.currentDepth, //the context of the previous select function (the parent object)
            currentDepth: 1, //how far down the object tree we are. e.g. obj == 0  obj.prop1 ==  1  obj.prop1.prop1_2 == 2

            //fullSelector represents a string of selectors that have come before this function was called. e.g. nn(obj)('prop1') == 'prop1'   nn(obj)('prop1')('prop1_1') == 'prop1.prop1_1'
            fullSelector:previousSelectContext.fullSelector +
                (previousSelectContext.previousDepth > -1 ?
                    selectorType === numberType ?
                        openArray + selector + closeArray :
                        splitter + selector :
                    selector)
        };

        var dotSplitLength = dotSplit ? dotSplit.length : 0;

        //iterate over each property and traverse contexts
        for (var i = 0; i < dotSplitLength; ++i){
            propertyName = dotSplit[i];
            previousContext = context;

            //attempt to set before traversing
            if(shouldSet){
                set(previousSelectContext, selector, newValue);
            }
            if(context){
                context = context[propertyName];
            }
        }
        //set the context (in case it was created/updated during set) allows us to chain nn(obj)('newProp', {})('prop1', 123); results in obj.newProp.prop1 == 123
        selectContext.context = context;

        //update depth
        selectContext.currentDepth = dotSplitLength + selectContext.previousDepth;
        //console.info('fullSelector: ' + selectContext.fullSelector + ' prev depth: ' + selectContext.previousDepth + ' current depth: ' + selectContext.currentDepth);

        //closure bound to the last context
        function result(s, newValue) {
            return select(selectContext, s, context, newValue);
        };
        result._selectContext = selectContext;//exposing for unit testing.
        result.val = context; //allow access to the last value. this is not protected (it can be null or undefined)

        //to allow functions to be executed safely, we provide the function which will call the real function if it exists,
        //passing it the arguments and the context of the real function's parent.
        result.func = function () {
            var potentialFunc = previousContext && previousContext[propertyName] ? previousContext[propertyName] : undefined;
            var isFunc = typeof potentialFunc === functionType;
            return isFunc ? potentialFunc.apply(previousContext, arguments) : undefined;
        };


        //allow iteration over arrays. if the context is not an array, make each an empty function (big performance improvement 200,000 ops per second)
        if(Object.prototype.toString.call(context) != '[object Array]'){
            result.each = emptyFunction;
        }else{
            result.each = function(callback){
                if(!context || !context.length){ //arrays and strings only ??   todo: better array checking. Object.prototype.toString(arr) == 'object array'
                    return;// result;// allow chaining to continue?    NOTE: referencing result in this function impacts performance. (loss of 100,000 ops per second)
                }
                for(var j =0; j < context.length; ++j){
                    callback(j, context[j], nn(context[j]));
                }
            };
        }

        //TODO: num() str() arr() obj() to safely get the value
        //get the result as a string if it is a string.
        //@param defaultValue (optional) - any value you wish to be the default value if the value is not a string.
        //        result.str = function(defaultValue){
        //            //use args.length to let undefined be a default value if they want.
        //            return typeof context === stringType ? context : arguments.length > 0 ? defaultValue : "";
        //        };
        //        result.num = function(defaultValue){
        //
        //        }
        //TODO: delete() ????
        //TODO: .propName ????
        //TODO: parent() ? or up()?

        return result;
    }

    /**
     * Initialization function
     * @param {object} obj - the query object.
     * @returns {function} - closure bound to the query object.
     */
    function nn(obj) {
        //create the context now as opposed to inside the returned closure. big perf increase.
        var previousSelectContext = {currentDepth:0, previousDepth:-1, fullSelector:"", context:obj};
        return function (sel, newValue) {
            return select( previousSelectContext, sel, obj, newValue);
        }
    }

    //assign nn to the global scope.
    //{{#if commonjs}}
    module.exports = nn;
    //{{else}}
    window.nn = nn;
    //{{/if}}
})();


//not as fast as ternary
//var formattedSelector;
//if(previousSelectContext.previousDepth > -1){
//    if(selectorType === numberType){
//        formattedSelector = openArray + selector + closeArray;
//    }else{
//        formattedSelector = splitter + selector;
//    }
//}else{
//    formattedSelector = selector;
//}
//selectContext.fullSelector = previousSelectContext.fullSelector + formattedSelector;