# nevernull
NeverNull provides the ability to safely navigate an object tree, regardless if the object, its properties, or nested properties exist.

The browser version of nevernull can be found [here](https://github.com/jasonmcaffee/nevernull-browser)

## Examples
To easily try out nevernull, you can fork the codio project & box [here](https://codio.com/jasonmcaffee/nn/tree/README.md)

### Avoid "Uncaught TypeError: Cannot read property x of undefined"
The function-object returned from nn guarantees safe navigation of its object tree.
This allows us to avoid boilerplate value checking.
```
const emptyObject = {};
const nnEmptyObject = nn(emptyObject);

//this will not throw any errors.
nnEmptyObject.property.that.doesnt.exist;
```

### Easily Gain Access to Property Values
All properties accessed on a never null function-object are functions.
Executing the function property gives you the underlying value of proxied object, should the value exist.
```
let person = {
    name: {
        first: 'jason'
    }
};

let nnPerson = nn(person);

nnPerson.name();            // == { first: 'jason'}
nnPerson.name.first();      // == 'jason'
nnPerson.name.last();       // == undefined
nnPerson.employer.name();   // == undefined

nn(person).address.city()   // == undefined
```

### Easily Set Property Values
Property values can be set in several ways.

#### Assign Property to Raw Target
To assign a property named 'first' to the 'name' target, we can simply access and assign to the raw 'name' object.
```
nnPerson.name().first = 'jason';
```
But what if name is undefined? We'd end up with an error.

#### Safely Assign Property Values
To avoid the above error, nevernull allows us to avoid boiler plate checking and assign value to the target only if the target is not undefined.
```
nnPerson.name.first = 'jason';
//since the address object is undefined, setting properties on it will have no effect, and no error will be thrown.
nnPerson.address.city = 'salt lake city';

nnPerson.name.first();      // == 'jason'
nnPerson.address.city();    // == undefined 

```

[See the test spec for more examples](https://github.com/jasonmcaffee/nn/blob/master/test/nevernull.spec.js)

## Install
### Node
```
npm install nevernull
```

```
const nn = require('nevernull');
```

## Existential Operator / Safe Navigation Operator / Optional Chaining
Nevernull provides you with the same functionality the Existential Operator provides in various other languages (Ruby, Groovy, Dart, CoffeeScript, etc)

e.g.
```
person?.name?.first; //safe navigation operator in groovy

nn(person).name.first(); //nevernull usage in js
```

### Further Reading
[Wikipedia - Save Navigation Operator](https://en.wikipedia.org/wiki/Safe_navigation_operator)

[Groovy's Safe Navigation Operator](http://docs.groovy-lang.org/latest/html/documentation/index.html#_safe_navigation_operator)

[CoffeeScript's Existential Operator](http://coffeescript.org/#operators)

[Ruby's Safe Navigation Operator](https://github.com/ruby/ruby/blob/v2_3_0/NEWS)

### tc39 Proposals
The proposal for the Existential Operator is currently in Stage 0 draft status.

[Stage 0 Draft - Optional Chaining - Spec Text](https://claudepache.github.io/es-optional-chaining/)

[Stage 0 Draft - Optional Chaining - Github](https://github.com/claudepache/es-optional-chaining)

[Existential Operator Strawman](http://wiki.ecmascript.org/doku.php?id=strawman:existential_operator)

### ES Discussions
[Optional Chaining aka Existential Operator Null Propagation](https://esdiscuss.org/topic/optional-chaining-aka-existential-operator-null-propagation)

[Existential Operator Null Propogation Operator](https://esdiscuss.org/topic/existential-operator-null-propagation-operator)

[Existential Operator](https://esdiscuss.org/topic/the-existential-operator)

## Requirements
### Node >= 6.0 
Node 7 provides native Proxy, but 6.x will use a polyfill to emulate Proxy.

## Performance
Performance is acceptable for most situations, but it should be noted that there can be a performance penalty using nevernull over traditional safeguarded access.

Detailed performance reports can be found here:

[Node v7.1.0 Using Native Proxy](https://github.com/jasonmcaffee/nn/blob/master/perftest-results/Node-v7.1.0.md)

[Node v6.0.0 Using Proxy Polyfill](https://github.com/jasonmcaffee/nn/blob/master/perftest-results/Node-v7.1.0.md)

Performance tests that generate the reports can be found [here](https://github.com/jasonmcaffee/nn/blob/master/test/performance/test.js)

## Release Notes
### 1.0.0
Old API has been deprecated and is no longer supported.  String selectors no longer are needed.

e.g.
```
//deprecated syntax
nn(person)('name.first');
nn(person)('name')('first');
```
Old API can be viewed and/or forked [here](https://github.com/jasonmcaffee/nn/tree/94408b7732ee4b2169198db830dba079423878aa)

### 1.2.0
Thanks to [inlineblock](https://github.com/inlineblock) for their pull request to optimize performance by returning a cached nn(undefined) when the property value is undefined.

### 1.3.0
API now provides the ability to safely set property values.  If the target is undefined, set has no effect, and no error is thrown.