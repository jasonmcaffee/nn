# nevernull
Provides the ability to safely navigate an object tree, regardless if the object, its properties, or nested properties exist.

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

[See the test spec for more examples](https://github.com/jasonmcaffee/nn/blob/master/src/nevernull.spec.js)

## Install
### Node
```
npm install nevernull
```

```
const nn = require('nevernull');
```

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
      "total nano for traditional ": 40831,
      "total nano for nevernull ": 321534
    },
    "5 layers of nesting": {
      "total nano for traditional ": 270199,
      "total nano for nevernull ": 577976
    }
  },
  "milliseconds": {
    "3 layers of nesting": {
      "total ms for traditional ": 0.040831,
      "total ms for nevernull ": 0.321534
    },
    "5 layers of nesting": {
      "total ms for traditional ": 0.270199,
      "total ms for nevernull ": 0.577976
    }
  },
  "percentage": {
    "3 layers of nesting": {
      "traditional is faster by ": "787%"
    },
    "5 layers of nesting": {
      "traditional is faster by ": "213%"
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
      "total nano for traditional ": 47446,
      "total nano for nevernull ": 276217
    },
    "5 layers of nesting": {
      "total nano for traditional ": 191837,
      "total nano for nevernull ": 423137
    }
  },
  "milliseconds": {
    "3 layers of nesting": {
      "total ms for traditional ": 0.047446,
      "total ms for nevernull ": 0.276217
    },
    "5 layers of nesting": {
      "total ms for traditional ": 0.191837,
      "total ms for nevernull ": 0.423137
    }
  },
  "percentage": {
    "3 layers of nesting": {
      "traditional is faster by ": "582%"
    },
    "5 layers of nesting": {
      "traditional is faster by ": "220%"
    }
  }
}
```