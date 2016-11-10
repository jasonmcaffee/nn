# nevernull
Provides the ability to safely navigate an object tree, regardless if the object, its properties, or nested properties exist.

## Examples

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
```

## Requirements
### Node 7.0
I plan on providing a browser and legacy node version soon, but for now node 7 is required.
