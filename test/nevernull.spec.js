const nn = require('./../build/nevernull');

describe("nevernull", ()=>{

  it("should provide an api for access to raw values", ()=>{
    let mockObject = {};
    let testObject = nn(mockObject);
    expect(typeof testObject.prop1).toEqual('function');
  });

  it("should intercept all (including nested) property access and ensure properties are never null", ()=>{
    let mockObject = {};
    let testObject = nn(mockObject);
    expect(testObject.a()).toEqual(undefined);
    expect(testObject.b.c()).toEqual(undefined);
    expect(testObject.d.e.f.g.h.i.j()).toEqual(undefined);

    let undefinedObject;
    testObject = nn(undefinedObject);
    expect(testObject()).toEqual(undefinedObject);
  });

  it("should allow access to original values of properties which are defined", ()=>{
    let mockObject = {
      a:{
        b:'someValue'
      },
      c: 42,
      d: ['a', 'b'],
      e: function(){return 22;},
      f: function(){return this.c;},
      get g(){
        return this.c;
      }
    };
    let testObject = nn(mockObject);

    expect(testObject()).toEqual(mockObject);
    expect(testObject.a()).toEqual(mockObject.a);
    expect(testObject.a.b()).toEqual(mockObject.a.b);
    expect(testObject.c()).toEqual(mockObject.c);
    expect(testObject.d()).toEqual(mockObject.d);
    expect( testObject.e()() ).toEqual(mockObject.e());
    expect( testObject.f()() ).toEqual(mockObject.f());

    expect( testObject.g()).toEqual(mockObject.g);
    mockObject.c = 1;
    expect( testObject.g()).toEqual(mockObject.g);
  });

  it("should reflect changes made to underlying object", ()=>{
    let mockObject = {
      a: {
        b: 123
      }
    };

    let testObject = nn(mockObject);

    mockObject.a.b = 456;
    expect(testObject.a.b()).toEqual(mockObject.a.b);

    mockObject.a = {b: 345};
    expect(testObject.a.b()).toEqual(mockObject.a.b);
  });

  it("should change underlying object when changes are made to nn function-object", ()=>{
    let mockObject = {
      a: {
        b: 'string'
      },
      set c(value){
        this.a.b = value;
      },
      get c(){
        return this.a.b;
      }
    };

    let testObject = nn(mockObject);

    testObject.a().b = 'another string';
    expect(testObject.a.b()).toEqual(mockObject.a.b);

    testObject().a = {b:'yet another string'};
    expect(testObject.a.b()).toEqual(mockObject.a.b);
    expect(testObject.c()).toEqual(mockObject.c);

    testObject.c = 'some other string';
    expect(testObject.c()).toEqual(mockObject.c);
  });

  it("should behave as normal objects when working with detached sub properties", ()=>{
    let person = {
      name: {
        first: 'jason',
        get fullName(){
          return `${this.first} ${this.last}`;
        },
        set fullName(value){
          let [first, last] = value.split(' ');
          this.first = first;
          this.last = last;
        }
      }
    };

    let nnPerson = nn(person);
    let nnName = nnPerson.name;

    nnName().first = 'bill';
    expect(nnName()).toEqual(person.name);

    nnPerson.name.fullName = 'jason mcaffee';
    expect(nnPerson.name.first()).toEqual('jason');
    expect(nnPerson.name.last()).toEqual('mcaffee');

    //when reassigning detached properties, values are no longer expected to be equal
    let name = person.name;
    person.name = {first: 'julie'};

    expect(nnName()).toEqual(name);
    expect(person.name).not.toEqual(nnName());

    //since we overwrote name with an object that does not have getters/setters for fullName, setting full name results in:
    nnPerson.name.fullName = 'jason mcaffee';
    expect(nnPerson.name.fullName()).toEqual('jason mcaffee');
    expect(nnPerson.name.first()).toEqual('julie');
    expect(nnPerson.name.last()).toEqual(undefined);
  });

  it("should allow property values to be safely set", ()=>{
    let person = {
      name: {
        first: 'jason'
      }
    };

    let nnPerson = nn(person);

    //set values when target is defined
    nnPerson.name = {first:'julie'};
    expect(nnPerson.name.first()).toEqual('julie');
    expect(person.name.first).toEqual(nnPerson.name.first());

    nnPerson.name.first = 'jason';
    expect(nnPerson.name.first()).toEqual('jason');
    expect(person.name.first).toEqual(nnPerson.name.first());

    nnPerson.name = { first: 'edward' };
    expect(person.name).toEqual(nnPerson.name());

    //dont set values when target is undefined
    nnPerson.address.city = 'salt lake city';
    expect(person.address).toEqual(undefined);
  });

  it("should not allow for property assignments to break the nevernull api", ()=>{
    let person = {
      name: {
        first: 'jason'
      }
    };

    let nnPerson = nn(person);

    nnPerson.name.first = 'sarah';

    expect(nnPerson.name.first).not.toEqual('sarah');
    expect(typeof nnPerson.name.first).toEqual('function');
  });

});