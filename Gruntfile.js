module.exports = function (grunt) {

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks('grunt-jscs');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-maven-tasks');
    grunt.loadNpmTasks('grunt-html2js');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-protractor-runner');
    grunt.loadNpmTasks('grunt-bootlint');
    grunt.loadNpmTasks('grunt-ng-annotate');
    grunt.loadNpmTasks('grunt-bump');

    // Project configuration.
    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        clean: {
            options: {
                force: true
            },
            dist: ['dist']
        },

        ngAnnotate: {
            add: {
                options: {
                    singleQuotes: true
                },
                files: {
                    'dist/angular-bootstrap-multiselect.js': 'dist/angular-bootstrap-multiselect.js'
                }
            }
        },

        bootlint: {
            options: {
                stoponerror: true,
                relaxerror: ['E001', 'W001', 'W002', 'W003', 'W005']
            },
            files: ['src/**/*.html']
        },

        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            sources: {
                src: ['src/**/*.js']
            }
        },

        jscs: {
            options: {
                config: '.jscsrc'
            },
            src: {
                src: '<%= jshint.sources.src %>'
            }
        },

        html2js: {
            options: {
                base: 'src',
                module: 'btorfs.multiselect.templates'
            },
            main: {
                src: ['src/**/*.html'],
                dest: 'dist/angular-bootstrap-multiselect-templates.js'
            }
        },

        concat: {
            options: {},
            files: {
                src: ['src/**/*.js', 'dist/angular-bootstrap-multiselect-templates.js'],
                dest: 'dist/angular-bootstrap-multiselect.js'
            }
        },

        uglify: {
            files: {
                src: 'dist/angular-bootstrap-multiselect.js',
                dest: 'dist/angular-bootstrap-multiselect.min.js'
            }
        },

        karma: {
            ci: {
                configFile: 'test/unit/karma.conf.js',
                reporters: ["dots"]
            },
            dev: {
                configFile: 'test/unit/karma.conf.js'
            }
        },

        watch: {
            karma: {
                files: ['src/**/*', 'test/unit/**/*'],
                tasks: ['build', 'karma:dev']
            }
        },

        connect: {
            e2e: {
                options: {
                    port: 9000,
                    base: '.'
                }
            }
        },

        protractor: {
            options: {
                keepAlive: false,
                configFile: "test/e2e/protractor.conf.js",
                args: {
                    baseUrl: 'http://localhost:9000'
                }
            },
            run: {}
        },

        bump: {
            options: {
                files: ['package.json'],
                commitFiles: ['package.json'],
                tagName: '%VERSION%',
                pushTo: 'origin'
            }
        }

    });

    // Quality checks
    grunt.registerTask('check', ['bootlint', 'jshint', 'jscs']);

    // Build files
    grunt.registerTask('build', ['html2js', 'concat', 'ngAnnotate', 'uglify']);

    // Continuous integration task
    grunt.registerTask('ci', ['clean', 'check', 'build', 'karma:ci']);

    // Run UI tests
    grunt.registerTask('e2e', ['connect', 'protractor']);

    // Continously build and execute unit tests after every file change, during development
    grunt.registerTask('dev', ['build', 'watch']);

    // Default task: does everything including UI tests
    grunt.registerTask('default', ['clean', 'check', 'build', 'karma:ci', 'e2e']);
};
