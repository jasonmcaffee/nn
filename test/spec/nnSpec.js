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
			nul: null
		};
	});


	it("should be able to access property values using chained function calls", function() {
		var prop1 = nn(obj)('prop1').val;
		expect(prop1).toEqual(obj.prop1); 

		var prop2 = nn(obj)('prop2').val;
		expect(prop2).toEqual(obj.prop2);

		var prop2_1 = nn(obj)('prop2')('prop2_1').val;
		expect(prop2_1).toEqual(obj.prop2.prop2_1);

	});
});