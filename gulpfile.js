var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
// var jade = require('gulp-jade');
// var sass = require('gulp-sass');
// var plumber = require('gulp-plumber');
// var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var mainBowerFiles = require('main-bower-files');
var browserSync = require('browser-sync').create();
var minimist = require('minimist')
var gulpSequence = require('gulp-sequence')

$.sass.compiler = require('node-sass');

var envOptions = {
  string: 'env',
  default: {
    env: 'develop'
  }
}
var options = minimist(process.argv.slice(2), envOptions);
console.log(options) //輸入 gulp jade 可以看到值 env develop
//如果要更動值 gulp jade --env production 就可以option

gulp.task('clean', function () {
  return gulp.src(['./.tmp', './public'], {
      read: false
    })
    .pipe($.clean());
});

gulp.task('copyHTML', function () {
  return gulp.src('./source/**/*.html')
    .pipe(gulp.dest('./public/'))
});
//jade------
// gulp.task('jade', function () {
//   // var YOUR_LOCALS = {};

//   gulp.src('./source/**/*.jade')
//     .pipe($.plumber())
//     .pipe($.jade({
//       // locals: YOUR_LOCALS
//       pretty: true // 轉出時沒有壓縮html
//     }))
//     .pipe(gulp.dest('./public/'))
//     .pipe(browserSync.stream());
// });
//scss
gulp.task('sass', function () {
  var plugins = [
    autoprefixer({
      browsers: ['last 2 version', '>5%', 'ie 6'] //針對目標瀏覽器
    }),
  ];

  return gulp.src('./source/scss/**/*.scss')
    .pipe($.plumber())
    .pipe($.sourcemaps.init())
    .pipe($.sass({
      outputStyle: 'nested',
      includePaths :['./node_modules/bootstrap/scss']
    }).on('error', $.sass.logError))
    //編譯完成 css
    .pipe($.postcss(plugins))
    //輸出前壓縮(clean-css)
    .pipe($.if(options.env === 'production', $.cleanCss()))
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest('./public/css'))
    .pipe(browserSync.stream());
});

//babel
gulp.task('babel', () =>
  gulp.src('./source/js/**/*.js')
  .pipe($.sourcemaps.init())
  .pipe($.babel({
    presets: ['@babel/env']
  }))
  .pipe($.concat('all.js'))
  .pipe($.if(options.env === 'production', $.uglify({
    compress: {
      drop_console: true
    }
  }))) //壓縮
  .pipe($.sourcemaps.write('.'))
  .pipe(gulp.dest('./public/js'))
  .pipe(browserSync.stream())
);

//bower 前端套件版本管理
gulp.task('bower', function () {
  //用require的部分
  return gulp.src(mainBowerFiles())
    .pipe(gulp.dest('./.tmp/vendors')) //放到暫存資料夾
});
//因為要等到 bower 執行完再執行 vendors 使用 []
gulp.task('vendors', ['bower'], function () {
  //用require的部分
  return gulp.src('./.tmp/vendors/**/*.js')
    .pipe($.concat('vendors.js'))
    .pipe($.if(options.env === 'production', $.uglify())) //壓縮
    .pipe(gulp.dest('./public/js/'))
});

// Static server
gulp.task('browser-sync', function () {
  browserSync.init({
    server: {
      baseDir: "./public", //釋出的檔案
      reloadDebounce: 2000
    }
  });
});
//壓縮圖片  imagemin

gulp.task('imagemin', () =>
  gulp.src('./source/images/*')
  .pipe($.if(options.env === 'production', $.imagemin())) //壓縮
  .pipe(gulp.dest('./public/images'))
);

//watch可以監聽
gulp.task('watch', function () {
  gulp.watch('./source/**/*.jade', ['jade']);
  gulp.watch('./source/scss/**/*.scss', ['sass']);
  gulp.watch('./source/js/**/*.js', ['babel']);

});

gulp.task('deploy', function () {
  return gulp.src('./public/**/*')
    .pipe($.ghPages());
});

//釋出用
//$.gulpSequence 會出錯改用require
gulp.task('build', gulpSequence('clean', 'jade', 'sass', 'babel', 'vendors'))

//整合 default 用gulp可以全呼叫 'browser-sync', 'watch' 開發用的
gulp.task('default', ['copyHTML', 'sass', 'babel', 'vendors', 'browser-sync', 'imagemin', 'watch']);