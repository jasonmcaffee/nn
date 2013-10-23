describe("nn", function() {
	'use strict';

	//setup
	var obj;
	beforeEach(function() {
		obj = {
			prop1: 'a', 
			prop2: {
				prop2_1: 'b'
			},
			prop3: {
				prop3_1:{
					prop3_1_1: 'c'
				}
			},
			undef: undefined,
			nul: null,
			notSupportedYet: function(){
				return this.prop1;
			}
		};
	});


	it("should be able to access property values of object literals by using chained function calls", function() {
		var prop1 = nn(obj)('prop1').val;
		expect(prop1).toEqual(obj.prop1); 

		var prop2 = nn(obj)('prop2').val;
		expect(prop2).toEqual(obj.prop2);

		var prop2_1 = nn(obj)('prop2')('prop2_1').val;
		expect(prop2_1).toEqual(obj.prop2.prop2_1);

		var prop3_1_1 = nn(obj)('prop3')('prop3_1')('prop3_1_1').val;
		expect(prop3_1_1).toEqual(obj.prop3.prop3_1.prop3_1_1);

	});

	it("should be able to access property values of object literals by using . notation selectors", function() {
		var prop2_1 = nn(obj)('prop2.prop2_1').val;
		expect(prop2_1).toEqual(obj.prop2.prop2_1);

		var prop3_1_1 = nn(obj)('prop3.prop3_1.prop3_1_1').val;
		expect(prop3_1_1).toEqual(obj.prop3.prop3_1.prop3_1_1);
	});

	it("should be able to access property values of object literals by using a mix of . notation selectors and chained function calls", function() {
		var prop3_1_1 = nn(obj)('prop3.prop3_1')('prop3_1_1').val;
		expect(prop3_1_1).toEqual(obj.prop3.prop3_1.prop3_1_1);

		prop3_1_1 = nn(obj)('prop3')('prop3_1.prop3_1_1').val;
		expect(prop3_1_1).toEqual(obj.prop3.prop3_1.prop3_1_1);
	});

	it("should be able to access property values of undefined or null properties and the val should be undefined", function() {
		var undef = nn(obj)('does')('not.exist').val;
		expect(undef).toEqual(undefined);
	});

	it("should be able to handle null or undefined query objects", function(){
		var undef = nn(null)('does')('not')('exist').val;
		expect(undef).toEqual(undefined);

		undef = nn(undefined)('does')('not')('exist').val;
		expect(undef).toEqual(undefined);
	});

	it("should be able to handle null or undefined selectors", function(){
		var undef = nn(null)(undefined)(null)(undefined).val;
		expect(undef).toEqual(undefined);
	});


});