#nn
nevernull allows safe navigation through properties of an object in a manner that is similar to bracket notation.

If any of the queried properties of the object are null or undefined, no exception will be thrown.

i.e. You can avoid exceptions like "TypeError: Cannot read property '{propertyName}' of undefined".

## Installation

### Browser
Minified 0.0.3 - https://raw.github.com/jasonmcaffee/nn/master/dist/nn-0.0.3.min.js

### NPM
#### Install
```
npm install nevernull
```

#### Node
```javascript
var nn = require('nevernull');

nn(obj)('prop1').val; // 'a'
```
##Usage
Take a look at the spec for all usages:
https://github.com/jasonmcaffee/nn/blob/master/test/spec/nnSpec.js

Example Object:
```javasript
//example object we wish to query
var obj = {
    prop1: 'a',
    prop2: {
        prop2_1: 'b',
        func2:function(param1, param2, param3){
            return this.prop2_1 + param1 + param2 + param3;
        }
    },
    prop3: {
        prop3_1:{
            prop3_1_1: 'c'
        }
    },
    prop4:[
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
    func1: function(){
        return this.prop1;
    }
};
```
### Query using dot notation format
nevernull allows you to pass in a query in the dot notation format.
```javascript
var prop1 = nn(obj)('prop1').val; // 'a'

var prop3_1_1 = nn(obj)('prop3.prop3_1.prop3_1_1').val; // 'c'

var undef = nn(obj)('does.not.exist').val; // undefined

var undef = nn(undefined)(undefined).val; // undefined
```

### Query using chained selectors
nevernull returns a new function so you can chain queries together:
```javascript
var prop3_1_1 = nn(obj)('prop3')('prop3_1')('prop3_1_1').val; // 'c'
//or
var prop3_1_1 = nn(obj)('prop3')('prop3_1.prop3_1_1').val; // 'c'
//or
var prop3_1_1 = nn(obj)('prop3.prop3_1')('prop3_1_1').val; // 'c'

var undef = nn(undefined)(undefined)(null)(undefined).val; // undefined
```

### Safely invoke functions
By calling .func(), you can safely invoke the function property of an object.
```javascript
var nnResult =  nn(obj)('prop2.func2').func('test', 'passing', 'params');  // 'btestpassingparams'
var nnResult2 = nn(obj)('prop2')('func2').func('test', 'passing', 'params'); // 'btestpassingparams'
var undef = nn(obj)(undefined).func('test', 'passing', 'params'); // undefined
```
### Safely query arrays
```javascript
var prop4_2_1 = nn(obj)('prop4')(2)('prop4_2.prop4_2_1').val; // {prop4_2_1_1: 'e'}

var undef = nn(obj)('prop4')(999).val; // undefined

var undef = nn(obj)('prop4')(undefined).val;
```
### Cached object querying
```javascript
var nnObj = nn(obj);

var prop1 = nnObj('prop1').val; // 'a'

var nnProp1 = nnObj('prop2');
var prop2_1 = nnProp1('prop2_1').val; // 'b'
```

###Fiddle
http://jsfiddle.net/jasonmcaffee/rdgmM/43/

###Compatability
nevernull should work in all browsers.

It has been tested on:

IE 8, 9, 10

Chrome

Firefox


##Performance
http://jsperf.com/never-null/5

##Size
Original: 2505 bytes.
Minified: 429 bytes.
Gzipped:  131 bytes.

##Future API Enhancements

### nn Core

#### Query arrays using single string selector
```javascript
nn(obj)('prop4[0]').val; // 'd'
```
#### Mutator
All setting of props.
```javasript
nn(obj)('prop1', 1234);
```

#### Whenable
Allow callback functions to execute for when the property exists
```javascript
nn(obj)('prop1').exists(function(propValue, obj){...});
```

### nn Observer
#### Mutation Observer
```javasript
nn(obj, {'set prop1': function(newVal, oldVal, obj){...}});
```

### nn Search (to be separate include from nn Core
#### Select all values
```javascript
var arrayOfAllProp1_1Values = nn(obj)('* prop1_1');
```

