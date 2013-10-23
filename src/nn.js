(function(){
	'use strict';
	/**
	* Recursive query select function generator.
	* @returns {function} - closure bound to the last context
	*/
	function select(selector, context){
		//split properties into an array
        var dotSplit = selector.split('.'),
        	propertyName;
        //iterate over each property and traverse contexts.
        for(var i = 0; i < dotSplit.length; ++i){
            propertyName = dotSplit[i];
            context = context ? context[propertyName] : undefined; //traverse contexts
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