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

## Existential Operator / Safe Navigation Operator
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

### ES Discussions
[Existential Operator Null Propogation Operator](https://esdiscuss.org/topic/existential-operator-null-propagation-operator)
[Existential Operator](https://esdiscuss.org/topic/the-existential-operator)

## Requirements
### Node >= 6.0 
Node 7 provides native Proxy, but 6.x will use a polyfill to emulate Proxy.

## Performance
Performance is acceptable for most situations, but it should be noted that there is a performance penalty using nevernull over traditional safeguarded access.
Performance tests can be found [here](https://github.com/jasonmcaffee/nn/blob/master/test/performance/test.js)

### Node v6.0.0 Using Polyfill
### 200 Iterations
```
node ./test/performance/test.js 200
performance test of 200 iterations starting...
{
  "nanoseconds": {
    "3 layers of nesting": {
      "total nano for traditional ": 40454,
      "total nano for nevernull ": 350382
    },
    "5 layers of nesting": {
      "total nano for traditional ": 279524,
      "total nano for nevernull ": 666340
    }
  },
  "milliseconds": {
    "3 layers of nesting": {
      "total ms for traditional ": 0.040454,
      "total ms for nevernull ": 0.350382
    },
    "5 layers of nesting": {
      "total ms for traditional ": 0.279524,
      "total ms for nevernull ": 0.66634
    }
  },
  "percentage": {
    "3 layers of nesting": {
      "traditional is faster by ": "866%"
    },
    "5 layers of nesting": {
      "traditional is faster by ": "238%"
    }
  }
}
```

### Node v7.1.0 Native Proxy
#### 200 iterations
```
node ./test/performance/test.js 200
performance test of 200 iterations starting...
{
  "nanoseconds": {
    "3 layers of nesting": {
      "total nano for traditional ": 44460,
      "total nano for nevernull ": 262126
    },
    "5 layers of nesting": {
      "total nano for traditional ": 240778,
      "total nano for nevernull ": 605197
    }
  },
  "milliseconds": {
    "3 layers of nesting": {
      "total ms for traditional ": 0.04446,
      "total ms for nevernull ": 0.262126
    },
    "5 layers of nesting": {
      "total ms for traditional ": 0.240778,
      "total ms for nevernull ": 0.605197
    }
  },
  "percentage": {
    "3 layers of nesting": {
      "traditional is faster by ": "589%"
    },
    "5 layers of nesting": {
      "traditional is faster by ": "251%"
    }
  }
}
```