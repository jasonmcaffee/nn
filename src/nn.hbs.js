(function() {
    'use strict';
    var numberType = typeof 0,
        stringType = typeof "",
        emptyFunction = function () {
        }, //needed for undefined function execution
        functionType = typeof emptyFunction,
        splitter = ".";

    /**
     * TODO: try providing a select that takes n params "prop1", "prop1_1", "prop2" if performance improves because of it.
     * Recursive query select function generator.
     * @returns {function} - closure bound to the last context
     */
    function select(nnContext, previousSelectContext, selector, context) {
        var selectorType = typeof selector,
            dotSplit,
            propertyName,
            previousContext, //needed for function execution
            selectContext = {
                previousDepth:previousSelectContext.currentDepth,
                currentDepth: 1, //how far down the object tree we are. e.g. obj == 0  obj.prop1 ==  1  obj.prop1.prop1_2 == 2
                fullSelector:previousSelectContext.fullSelector + (previousSelectContext.previousDepth > 0 ? splitter + selector : selector)
            };


        //console.info('fullSelector: ' + selectContext.fullSelector + ' depth: ' + depth + ' previousDepth: ' + selectContext.previousDepth); //+' currentDepth: ' + selectContext.currentDepth);
        //determine what to do based on the selector type.
        if (selectorType === stringType) {
            dotSplit = selector.split(splitter);
        } else if (selectorType === numberType) {
            dotSplit = [selector];
        } else {
            context = null;//handle undefined selectors. e.g. nn(obj)(undefined)
        }

        //selectContext.previousDepth = selectContext.currentDepth;
        var dotSplitLength = dotSplit ? dotSplit.length : 0;
        //console.info('dotSplitLength: ' + dotSplitLength);
        //iterate over each property and traverse contexts
        for (var i = 0; i < dotSplitLength; ++i){
            propertyName = dotSplit[i];
            previousContext = context;
            context = context ? context[propertyName] : undefined; //traverse contexts
        }

        selectContext.currentDepth = dotSplitLength + selectContext.previousDepth -1;

        //closure bound to the last context
        var result = function (s) {
            return select(nnContext, selectContext, s, context);
        };
        result._selectContext = selectContext;
        result.val = context; //allow access to the last value. this is not protected (it can be null or undefined)
        //to allow functions to be executed safely, we provide the function which will call the real function if it exists,
        //passing it the arguments and the context of the real function's parent.
        result.func = function () {
            var potentialFunc = previousContext && previousContext[propertyName] ? previousContext[propertyName] : undefined;
            var isFunc = typeof potentialFunc === functionType;
            return isFunc ? potentialFunc.apply(previousContext, arguments) : undefined;
        };
        return result;
    }

    /**
     * Initialization function
     * @param {object} obj - the query object.
     * @returns {function} - closure bound to the query object.
     */
    function nn(obj) {
        var nnContext = {originalObject: obj};
        return function (sel) {
            return select(nnContext, {currentDepth:1, previousDepth:0, fullSelector:""}, sel, obj);
        }
    }

    //assign nn to the global scope.
    //{{#if commonjs}}
    module.exports = nn;
    //{{else}}
    window.nn = nn;
    //{{/if}}
})();