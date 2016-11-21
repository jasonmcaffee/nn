# nevernull
NeverNull provides the ability to safely navigate an object tree, regardless if the object, its properties, or nested properties exist.

The browser version of nevernull can be found [here](https://github.com/jasonmcaffee/nevernull-browser)

## Examples
To easily try out nevernull, you can fork the codio project & box [here](https://codio.com/jasonmcaffee/nn/tree/README.md)

### No Uncaught ReferenceError or Uncaught TypeError Errors
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
Performance is acceptable for most situations, but it should be noted that there is a performance penalty using nevernull over traditional safeguarded access.

Performance tests can be found [here](https://github.com/jasonmcaffee/nn/blob/master/test/performance/test.js)

### Node v7.1.0 Native Proxy

#### 200 Iterations Result

##### Access Property Nested 3 Layers Deep
Time and compare traditional safeguarded access to nevernull safeguarded access.

e.g.
```
//traditional
if(example && example.a5 && example.a5.b){
    result = example.a5.b.c;
}

//nevernull
result = nn(example).a5.b.c();
```

Results Table
|Safeguard Type | nanoseconds | milliseconds| KB memory used |
|:------------: | :-----------: | :-----------: | -----------: |
| traditional | 237693 | 0.237693 | 120.21875 |
| nevernull   | 465031 | 0.465031 | 191.25 |


Comparison Table
|NeverNull is N Times Slower | NeverNull uses N Times More Memory |
|:------- | :--------- |
| 1.96 | 1.59 |

##### Access Property Nested 5 Layers Deep
Time and compare traditional safeguarded access to nevernull safeguarded access.

e.g.
```
//traditional
if(example && example.a5 && example.a5.b && example.a5.b.c && example.a5.b.c.d){
    result = example.a5.b.c.d.e;
}

//nevernull
result = nn(example).a5.b.c.d.e();
```

Results Table
|Safeguard Type | nanoseconds | milliseconds| KB memory used |
|:------------: | :-----------: | :-----------: | -----------: |
| traditional | 51889 | 0.051889 | 51.25 |
| nevernull   | 298921 | 0.298921 | 249.7265625 |

Comparison Table
|NeverNull is N Times Slower | NeverNull uses N Times More Memory |
|:------- | :--------- |
| 5.76 | 4.87 |




#### Node v6.0.0 Using Polyfill

#### 200 Iterations Result

##### Access Property Nested 3 Layers Deep
Time and compare traditional safeguarded access to nevernull safeguarded access.

e.g.
```
//traditional
if(example && example.a5 && example.a5.b){
    result = example.a5.b.c;
}

//nevernull
result = nn(example).a5.b.c();
```


|Access of Property Nested 3 Layers Deep ||||
Safeguard Type | nanoseconds | milliseconds| KB memory used |
:------------: | :-----------: | :-----------: | -----------: |
| traditional | 289770 | 0.28977 | 126.640625 |
| nevernull   | 482955 | 0.482955 | 193.3515625 |
[Performance Test Results Table]

|Comparison||
NeverNull is N Times Slower | NeverNull uses N Times More Memory |
:------- | :--------- |
| 1.67 | 1.53 |

##### Access Property Nested 5 Layers Deep
Time and compare traditional safeguarded access to nevernull safeguarded access.

e.g.
```
//traditional
if(example && example.a5 && example.a5.b && example.a5.b.c && example.a5.b.c.d){
    result = example.a5.b.c.d.e;
}

//nevernull
result = nn(example).a5.b.c.d.e();
```

|Access of Property Nested 5 Layers Deep ||||
Safeguard Type | nanoseconds | milliseconds| KB memory used |
:------------: | :-----------: | :-----------: | -----------: |
| traditional | 54594 | 0.054594 | 50.9921875 |
| nevernull   | 373449 | 0.373449 | 249.5 |
[Performance Test Results Table]

|Comparison||
NeverNull is N Times Slower | NeverNull uses N Times More Memory |
:------- | :--------- |
| 6.84 | 4.89 |

#### 2000 Iterations Result

##### Access Property Nested 3 Layers Deep
Time and compare traditional safeguarded access to nevernull safeguarded access.

e.g.
```
//traditional
if(example && example.a5 && example.a5.b){
    result = example.a5.b.c;
}

//nevernull
result = nn(example).a5.b.c();
```


|Access of Property Nested 3 Layers Deep ||||
Safeguard Type | nanoseconds | milliseconds| KB memory used |
:------------: | :-----------: | :-----------: | -----------: |
| traditional | 445351 | 0.445351 | 618.2734375 |
| nevernull   | 2645427 | 2.645427 | 1782.421875 |
[Performance Test Results Table]

|Comparison||
NeverNull is N Times Slower | NeverNull uses N Times More Memory |
:------- | :--------- |
| 5.94 | 2.88 |

##### Access Property Nested 5 Layers Deep
Time and compare traditional safeguarded access to nevernull safeguarded access.

e.g.
```
//traditional
if(example && example.a5 && example.a5.b && example.a5.b.c && example.a5.b.c.d){
    result = example.a5.b.c.d.e;
}

//nevernull
result = nn(example).a5.b.c.d.e();
```

|Access of Property Nested 5 Layers Deep ||||
Safeguard Type | nanoseconds | milliseconds| KB memory used |
:------------: | :-----------: | :-----------: | -----------: |
| traditional | 236784 | 0.236784 | 461.0859375 |
| nevernull   | 3367299 | 3.367299 | 417.9140625 |
[Performance Test Results Table]

|Comparison||
NeverNull is N Times Slower | NeverNull uses N Times More Memory |
:------- | :--------- |
| 14.22 | 0.91 |



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