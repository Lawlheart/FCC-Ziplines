var gulp = require('gulp'),
	babel = require('gulp-babel'),
	watch = require('gulp-watch'),
	rename = require('gulp-rename');

gulp.task('babel', () => {
	return gulp.src('js/app.jsx')
	.pipe(babel({
		presets: ['es2015', 'react']
	}))
	.pipe(rename('app.js'))
	.pipe(gulp.dest('js/'))
});

gulp.task('stream', () => {
	gulp.watch('js/app.jsx', ['babel']);
});