const gulp = require('gulp');
const webpack = require('gulp-webpack');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');
const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');
const del = require('del');
const bump = require('gulp-bump');
const mkdirp = require('mkdirp');
const path = require('path');
const header = require('gulp-header');
const fs = require('fs');
const mocha = require('gulp-mocha');
const babel = require('gulp-babel');

const buildDir = './build';
const distDir = './dist';
const filename = 'color-assigner';

gulp.task('default', ['build'], function () {

});

gulp.task('build', ['babel-cjs', 'test', 'minify-umd'], function () {
});

gulp.task('dist', ['build', 'copy-files', 'copy-types'], function () {
  const packageJson = require('./dist/package.json');

  if (packageJson.version.endsWith('SNAPSHOT')) {
    return gulp.src(`${distDir}/package.json`)
      .pipe(bump({version: packageJson.version + '.' + new Date().getTime()}))
      .pipe(gulp.dest(distDir));
  }
});

gulp.task('copy-files', ['build'], function () {
  return gulp.src(['build/**/*', 'README.md', 'LICENSE.txt', 'package.json'])
    .pipe(gulp.dest(distDir));
});

gulp.task('copy-types', ['build'], function () {
  return gulp.src(['types/**/*'])
    .pipe(gulp.dest(`${distDir}/types`));
});

gulp.task('webpack-umd', function () {
  const outputPath = `${buildDir}/browser`;

  mkdirp(outputPath);

  const config = buildWebpackConfig();

  const packageJson = JSON.parse(fs.readFileSync('./package.json'));
  const headerTxt = fs.readFileSync('./copyright-header.txt');

  return gulp.src('src/index.js')
    .pipe(webpack(config))
    .pipe(header(headerTxt, {package: packageJson}))
    .pipe(gulp.dest(outputPath));
});

gulp.task('babel-cjs', function () {
  const headerTxt = fs.readFileSync('./copyright-header.txt');
  const packageJson = JSON.parse(fs.readFileSync('./package.json'));

  return gulp.src('src/*.js')
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(header(headerTxt, {package: packageJson}))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./build/lib/'));
});

gulp.task('minify-umd', ['webpack-umd'], function () {
  return gulp.src(`${buildDir}/browser/${filename}.js`)
    .pipe(sourcemaps.init())
    .pipe(uglify({
      preserveComments: 'license'
    }))
    .pipe(rename({extname: '.min.js'}))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(`${buildDir}/browser/`));
});

gulp.task('clean', function () {
  return del([buildDir, 'dist']);
});

gulp.task('test', ['babel-cjs'], function () {
  return gulp.src(['test/*.js'], {read: false})
    .pipe(mocha({
      reporter: 'spec',
      globals: {
        should: require('should')
      }
    }));
});

function buildWebpackConfig() {
  return {
    output: {
      library: 'ColorAssigner',
      libraryTarget: 'umd',
      umdNamedDefine: true,
      filename: `${filename}.js`
    },
    module: {
      loaders: [
        {test: /(\.js)$/, loader: 'babel', exclude: /(node_modules)/},
        {test: /(\.js)$/, loader: 'eslint-loader', exclude: /node_modules/}
      ]
    },
    resolve: {root: path.resolve('./src/js'), extensions: ['', '.js']},
    plugins: []
  };
}
