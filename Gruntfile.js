module.exports = function (grunt) {
    //modules
    var handlebars = require('handlebars');

    var buildVersion = "0.0.3",
        minFileName = "nn-" + buildVersion + ".min.js",
        nnCoreTemplateSrcFilePath = 'src/nn.hbs.js',
        nnCoreDistFilePath = 'dist/' + minFileName,
        uglifyConfig = {};
    //uglify from the dist to the dist.
    uglifyConfig[nnCoreDistFilePath] = [nnCoreDistFilePath];

    grunt.initConfig({
        nn:{
            core:{
                templateSrcFilePath: nnCoreTemplateSrcFilePath,
                distFilePath: nnCoreDistFilePath,
                templateData:{
                    test: true
                }
            }
        },
        jasmine: {
            nnCore:{
                src: nnCoreDistFilePath,
                options: {
                    specs: 'test/spec/*Spec.js',
                    helpers: 'test/spec/*Helper.js'
                }
            }
        },
        watch: {
            scripts: {
                files: ['src/**/*.js'],
                tasks: ['build-nn-core']
            },
            specs: {
                files: ['test/spec/**/*.js'],
                tasks: ['test']
            }
        },
        uglify: {
            options: {
                report: 'gzip'
            },
            nnCore: {files: uglifyConfig}
        }
    });

    /**
     * Compiles js templates in src (e.g. nn.hbs.js).
     */
    grunt.registerTask('compile-nn-core-templates',
        'the src js is a template so we can pick and choose what to include in the dist file', function(){
        var config = grunt.config('nn');

        //build core nn.js
        var coreConfig = config.core;
        var nnCoreTemplate = grunt.file.read(coreConfig.templateSrcFilePath);
        var nnCoreTemplateFunction = handlebars.compile(nnCoreTemplate);
        var nnCoreJs = nnCoreTemplateFunction(coreConfig.templateData);
        grunt.file.write(coreConfig.distFilePath, nnCoreJs);
    });

    grunt.registerTask('compile-nn-templates', ['compile-nn-core-templates']);

    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('test', ['jasmine']);
    grunt.registerTask('build-nn-core', ['compile-nn-core-templates', 'jasmine:nnCore']);
    grunt.registerTask('build-nn-core-and-minify', ['build-nn-core', 'uglify:nnCore']);

    grunt.registerTask('default', ['compile-nn-templates', 'test', 'uglify']);
};