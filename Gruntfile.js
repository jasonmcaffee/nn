module.exports = function(grunt){
	grunt.initConfig({
	  jasmine: {
		src: 'src/**/*.js',
		options: {
			specs: 'test/spec/*Spec.js',
			helpers: 'test/spec/*Helper.js'
		}
	  },
	  watch : {
		scripts: {
			files: ['src/**/*.js'],
			tasks: ['test']
		},
		specs: {
			files: ['test/spec/**/*.js'],
			tasks: ['test']
		}
      }
	});

	grunt.loadNpmTasks('grunt-contrib-jasmine');
	grunt.loadNpmTasks('grunt-contrib-watch');
	
	grunt.registerTask('test', ['jasmine']);
	grunt.registerTask('default', ['test']);
};