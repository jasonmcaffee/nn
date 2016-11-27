//if Proxy is not natively supported, ensure polyfill is created.
require('../vendor/reflect');

/**
 * Returns an object which allows for safe navigation of properties.
 * When raw property values are needed, simply execute the property as a function.
 *
 * e.g.
 * let nnObject = nn({ a: 1 });
 * nnObject.a() == 1
 * nnObject.non.existent.property.access() == undefined
 *
 * @param rawValue - object to be wrapped.
 * @returns {Proxy}
 */
const nn = (rawValue)=>{

  //Each property accessed on a nevernull function-object will be this function.
  //e.g. nn({}).prop1 is a function, which when executed, returns the passed in rawValue.
  let wrappedValue = ()=>{
    return rawValue;
  };

  //intercept all property access on the wrappedValue function-object
  return new Proxy(wrappedValue, handler);
};

/**
 * Proxy handler object.  Any time a property is read, get is executed first, allowing us to ensure the property value
 * is never null/undefined.
 * @type {{get: handler.get}}
 */
const handler = {

  /**
   * When a property is accessed, this function intercepts its access and instead returns a Proxy of a wrappedValue function.
   * This allows us to do lazy recursion on all nested properties.
   * @param target - object which is being asked for the property with the name of the 'name' parameter.
   * @param name - property name on the target who's value is needed.
   * @returns {Proxy} - recursive call to nevernull is returned so accessing nested properties is always safe.
   */
  get: function(target, name){
    //get the raw target so we can access the raw property value.
    let rawTarget = target();
    let rawPropertyValue = rawTarget ? rawTarget[name] : undefined;

    //for performance: if the property value is undefined, there is no need to make a recursive call.
    if(rawPropertyValue === undefined){
      return nnUndefinedProperty;
    }

    //function properties should maintain their context.
    if(typeof(rawPropertyValue) === 'function'){
      rawPropertyValue = rawPropertyValue.bind(rawTarget);
    }

    //ensure the property is never null.
    return nn(rawPropertyValue);
  },

  /**
   * Conditionally sets the target[property].
   * If the target has a value (ie is not undefined), property will be set to the value.
   * If the target is undefined, the attempt to set the property will be ignored.
   * @param target - target which contains the property we will set the value of.
   * @param property - property name on the target which should be assigned value.
   * @param value - value to assign to the target[property].
   * @param receiver - the object to which the assignment was originally directed (usually the Proxy object).
     */
  set: function(target, property, value, receiver){
    let rawTarget = target();
    if(rawTarget === undefined){ return; }
    rawTarget[property] = value;
  }
};

/**
 * Cache the undefined version for speed.
 */
const nnUndefinedProperty = nn(undefined);

module.exports = nn;
