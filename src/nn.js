(function(){
	function select(selector, context){
        var dotSplit = selector.split('.'),
        	propertyName;
        for(var i = 0; i < dotSplit.length; ++i){
            propertyName = dotSplit[i];
            context = context ? context[propertyName] : null;
        }
        var result = function(s){ return select(s,context); };
        result.val = context;
        return result;
    }

    /**
    * Initialization function
    * @return closure function bound to the query object.
    */
	function nn(obj){
		return function(sel){ return select2(sel, obj);}
	}
	window.nn = nn;
})();