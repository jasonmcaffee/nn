module.exports = function(grunt){
    var buildVersion = "0.0.2",
        minFileName = "nn-" + buildVersion + ".min.js",
        distFilePath = 'dist/' + minFileName,
        uglifyConfig = {};
    uglifyConfig[distFilePath] = ['src/nn.js'];

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
      },
      uglify:{
          options:{
            report: 'gzip'
          },
          nn:{files:uglifyConfig}
      }
	});

	grunt.loadNpmTasks('grunt-contrib-jasmine');
	grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');
	
	grunt.registerTask('test', ['jasmine']);
	grunt.registerTask('default', ['test', 'uglify']);
};