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
		prop3_1:{
			prop3_1_1: 'c'
		}
	},
	undef: undefined,
	nul: null
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
### Search

