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
		var undef = nn(obj)(undefined)(null)(undefined).val;
		expect(undef).toEqual(undefined);

		undef = nn(null)(undefined)(null)(undefined).val;
		expect(undef).toEqual(undefined);
	});

	it("should be able to access array items with a number selector", function(){
		var prop4_0 = nn(obj)('prop4')(0).val;
		expect(prop4_0).toEqual(obj.prop4[0]);

		var prop4_1 = nn(obj)('prop4')(1).val;
		expect(prop4_1).toEqual(obj.prop4[1]);

		var prop4_2 = nn(obj)('prop4')(2).val;
		expect(prop4_2).toEqual(obj.prop4[2]);
		
	});

	it("should be able to access array items with a number selector and continue to select", function(){

		var prop4_2 = nn(obj)('prop4')(2)('prop4_2').val;
		expect(prop4_2).toEqual(obj.prop4[2].prop4_2);

		var prop4_2_1 = nn(obj)('prop4')(2)('prop4_2.prop4_2_1').val;
		expect(prop4_2_1).toEqual(obj.prop4[2].prop4_2.prop4_2_1);
	});


});