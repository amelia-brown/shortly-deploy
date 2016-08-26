module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: ['public/client/**/*.js'],
        dest: 'public/dist/built.js'
      }
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'nyan'
        },
        src: ['test/**/*.js']
      }
    },

    nodemon: {
      dev: {
        script: 'server.js'
      }
    },

    uglify: {
      target: {
        files: {
          'public/dist/built.min.js': ['public/dist/built.js'],
        }

      }
    },

    eslint: {
      target: [
        'public/client/**/*.js'
        // Add list of files to lint here
      ]
    },

    cssmin: {
      options: {
        keepSpecialComments: 0
      },
      dist: {
        files: {
          'public/dist/style.min.css': 'public/style.css'
        }
      }
    },

    watch: {
      scripts: {
        files: [
          'public/client/**/*.js',
          'public/lib/**/*.js',
        ],
        tasks: [
          'concat',
          'uglify'
        ]
      },
      css: {
        files: 'public/*.css',
        tasks: ['cssmin']
      }
    },

    shell: {
      prodServer: {
        command: 'git add . && git commit && git push live master'
      },
      localPush: {
        command: 'git add . && git commit && git push origin master'
      }
    },
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-nodemon');

  grunt.registerTask('server-dev', function (target) {
    grunt.task.run([ 'nodemon', 'watch' ]);
  });

  ////////////////////////////////////////////////////
  // Main grunt tasks
  ////////////////////////////////////////////////////

  grunt.registerTask('test', [
    'mochaTest'
  ]);

  grunt.registerTask('build', [
   // 'test',
  //  'eslint',
    'concat',
    'uglify',
    //'watch'
  ]);


  grunt.registerTask('upload', function(n) {
    if (grunt.option('prod')) {
      grunt.task.run(['test', 'shell:prodServer' ]);
      // add your production server task here
    } else {
      grunt.task.run([ 'server-dev', 'watch' ]);
    }
  });

  grunt.registerTask('pushToMaster', [
    'shell:localPush'
  ]);

  grunt.registerTask('deploy', [
    // add your deploy tasks here
    'build',
    'upload'
  ]);


};
