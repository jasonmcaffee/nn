const nn = require('./nevernull');

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
      d: false,
      e: function(){return 22;},
      f: function(){return this.c;}
    };
    let testObject = nn(mockObject);

    expect(testObject()).toEqual(mockObject);
    expect(testObject.a()).toEqual(mockObject.a);
    expect(testObject.a.b()).toEqual(mockObject.a.b);
    expect(testObject.c()).toEqual(mockObject.c);
    expect(testObject.d()).toEqual(mockObject.d);
    expect( testObject.e()() ).toEqual(mockObject.e());
    expect( testObject.f()() ).toEqual(mockObject.f());
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
      }
    };

    let testObject = nn(mockObject);

    testObject.a().b = 'another string';
    expect(testObject.a.b()).toEqual(mockObject.a.b);

    testObject().a = {b:'yet another string'};
    expect(testObject.a.b()).toEqual(mockObject.a.b);
  });



});