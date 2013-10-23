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
	}
};

//safe navigation
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

var nnObj = nn(obj);
nnObj('prop1').val;

```
#TODO

##API Enhancements

### Mutator
nn(obj)('prop1', 1234);

### Mutation Observer
nn(obj, {
	change:{
		'prop1':function(newProp1Value){

		}
	}
});

### Search

