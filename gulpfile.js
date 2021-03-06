const gulp = require('gulp');
const babel = require('babelify');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const browserSync = require('browser-sync');
const reload = browserSync.reload;
const notify = require('gulp-notify');
const sass = require('gulp-sass');
const plumber = require('gulp-plumber');
const pug = require('gulp-pug');

const sourceRoot = './Public_src/';
const publicRoot = './Public/';

gulp.task('copyFonts', () => {
	return gulp.src(sourceRoot + 'fonts/**/**')
		.pipe(gulp.dest(publicRoot + 'fonts'))
});

gulp.task('copyImages', () => {
	return gulp.src(sourceRoot + 'images/**/**')
		.pipe(gulp.dest(publicRoot + 'images'))
});

gulp.task('copyJSLibs', () => {
	return gulp.src([sourceRoot + 'js/**.js', '!' + sourceRoot + 'js/main.js'])
		.pipe(gulp.dest(publicRoot + 'js'))
});

gulp.task('html', () => {
	return gulp.src(sourceRoot + '/views/**.pug')
		.pipe(plumber())
		.pipe(pug())
		.pipe(gulp.dest(publicRoot))
});

gulp.task('styles', () => {
	return gulp.src([
		sourceRoot + 'scss/bootstrap/bootstrap.scss',
		sourceRoot + 'scss/bootstrap/animate.scss',
		sourceRoot + 'scss/style.scss'
	])
	.pipe(sass().on('error', sass.logError))
	.pipe(gulp.dest(publicRoot + 'css'))
});

gulp.task('js', () => {
	return browserify(sourceRoot + 'js/main.js', {debug: true})
		.transform('babelify', {
			sourceMaps: true,
			presets: ['env','react']
		})
		.bundle()
		.on('error',notify.onError({
			message: "Error: <%= error.message %>",
			title: 'Error in JS 💀'
		}))
		.pipe(source('main.js'))
		.pipe(buffer())
		.pipe(gulp.dest(publicRoot + 'js'))
		.pipe(reload({stream:true}));
});

gulp.task('bs', () => {
	return browserSync.init({
		server: {
			baseDir: publicRoot
		}
	});
});

gulp.task('default', ['bs', 'build'], () => {
	gulp.watch(sourceRoot + 'views/**.pug',['html']);
	gulp.watch(sourceRoot + 'js/**/*.js',['js']);
	gulp.watch(sourceRoot + 'scss/**/*.scss',['styles']);

	gulp.watch(publicRoot + 'css/style.css',reload);
	gulp.watch(publicRoot + '*.html',reload);
});

gulp.task('build', ['html', 'js', 'styles', 'copyFonts', 'copyImages', 'copyJSLibs']);