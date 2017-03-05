/*jslint node: true */
"use strict";

module.exports = function(grunt) {

	// Load Grunt tasks declared in the package.json file
	require('matchdep').filterDev(['grunt-*', '!grunt-cli']).forEach(grunt.loadNpmTasks);
	var path = require('path');
	var DEV_PORT = 5555;

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		watch: {
			files: ['./'],
		},

		express: {
			all: {
				options: {
					port: DEV_PORT,
					hostname: 'localhost',
					livereload: true,
					bases: [
						path.resolve(__dirname)
					], 
				}
			}
		},

		open: {
			dev: {
				path: 'http://localhost:' + DEV_PORT
			}
		}
	});

	grunt.registerTask('dev', ['express', 'open', 'watch'])
};