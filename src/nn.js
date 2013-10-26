(function(){
	'use strict';
	var numberType = typeof 0,
		stringType = typeof "",
        functionType = typeof function(){},
		splitter = ".";

	/**
	* Recursive query select function generator.
	* @returns {function} - closure bound to the last context
	*/
	function select(selector, context){
        var selectorType = typeof selector,
        	dotSplit,
        	propertyName,
            previousContext, //needed for function execution
            argumentsLength = arguments.length;

        //determine what to do based on the selector type.
        if(selectorType === stringType){
        	dotSplit = selector.split(splitter); 
        }else if(selectorType === numberType){
        	dotSplit = [selector];
        }else{
        	context = null;//fix issue with nn(obj)(undefined)
        }

        //iterate over each property and traverse contexts.
        for(var i = 0; dotSplit && i < dotSplit.length; ++i){
            propertyName = dotSplit[i];
            previousContext = context;
            context = context ? context[propertyName] : undefined; //traverse contexts
        }

        //allow functions to have correct context
        if(typeof context === functionType){
            context = function(){
                return previousContext[propertyName]();
            }
        }
        //closure bound to the last context
        var result = function(s){ return select(s, context); };
        result.val = context; //allow the last context to be accessed at any time.
        return result;
    }

    /**
    * Initialization function
    * @param {object} obj - the query object. 
    * @returns {function} - closure bound to the query object.
    */
	function nn(obj){
		return function(sel){ return select(sel, obj); }
	}

	//assign nn to the global scrope.
	window.nn = nn;
})();