#nn
Allows safe navigation through properties of an object in a manner that is similar to bracket notation.
i.e. Avoid "TypeError: Cannot read property '{propertyName}' of undefined".

##Usage
```javasript
//example object we wish to query
var obj = {
	prop1: 'a', 
	prop2: {
		prop2_1: 'b'
	},
	prop3: {
		prop3_1: {
			prop3_1_1: 'c'
		}
	},
	prop4: ['a', 'b', 'c'],
	undef: undefined,
	nul: null,
	notSupportedYet: function(){
		return this.prop1;
	}
};

//usage options
var prop1 = nn(obj)('prop1').val; // 'a'

var prop2_1 = nn(obj)('prop2')('prop2_1').val; // 'b'
//or
var prop2_1 = nn(obj)('prop2.prop2_1').val; // 'b'

var prop3_1_1 = nn(obj)('prop3')('prop3_1')('prop3_1_1').val; // 'c'
//or
var prop3_1_1 = nn(obj)('prop3.prop3_1.prop3_1_1').val; // 'c'
//or
var prop3_1_1 = nn(obj)('prop3')('prop3_1.prop3_1_1').val; // 'c'
//or
var prop3_1_1 = nn(obj)('prop3.prop3_1')('prop3_1_1').val; // 'c'

//safe navigation
var safe = nn(obj)('nul')('no')('issues')('at.all').val;
var undef = nn(obj)('undef').val;

//cached querying
var nnObj = nn(obj);

var prop1 = nnObj('prop1').val; // 'a'

var nnProp1 = nnObj('prop2');
var prop2_1 = nnProp1('prop2_1').val; // 'b'

```

###Fiddle
http://jsfiddle.net/jasonmcaffee/rdgmM/43/

##Performance
http://jsperf.com/never-null

```javascript
function timed(f){
   var start = new Date().getTime();
   f();
   var end = new Date().getTime();
   console.log('time: ' + (end - start));
}

function loop(n, f){
   for(var i = 0; i < n; ++i){
      f();
   }
}

loop(100, function(){
    timed(function(){
   		for(var i = 0; i < 1000000; ++i){
      		nn(obj)('prop1');
   		}
	});
});

//result (chrome Version 30.0.1599.101 on Mac OS X version 10.7.5 2.3GHz Intel Core i7   8GB 1333 MHz DDR3)
/*
time: 1017
time: 1005
time: 1017
time: 1024
time: 1016
time: 1004
time: 1013
time: 1004
time: 1007
time: 1029
time: 1018
time: 1006
time: 1036
time: 1030
time: 1022
time: 1036
time: 1003
time: 1039
time: 1041
time: 1030
time: 900
time: 898
time: 900
time: 902
time: 908
time: 900
time: 898
time: 902
time: 887
time: 884
time: 888
time: 896
time: 890
time: 892
time: 887
time: 888
time: 889
time: 889
time: 891
time: 890
time: 898
time: 894
time: 891
time: 886
time: 889
time: 887
time: 889
time: 892
time: 889
time: 889
time: 890
time: 892
time: 895
time: 887
time: 887
time: 893
time: 888
time: 891
time: 890
time: 887
time: 888
time: 892
time: 889
time: 887
time: 892
time: 894
time: 895
time: 890
time: 887
time: 889
time: 886
time: 889
time: 889
time: 892
time: 886
*/

```

#TODO

##API Enhancements

### Mutator
```javasript
nn(obj)('prop1', 1234);
```

### Mutation Observer
```javasript
nn(obj, {
	change:{
		'prop1':function(newProp1Value){

		}
	}
});
```

### Array Accessor
nn(obj)('prop4')(0).val; //should be 'a'

### Search

