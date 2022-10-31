/* eslint-disable strict */
// @ts-nocheck

import postcss from 'gulp-postcss';
import gulp from 'gulp';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import htmlmin from 'gulp-htmlmin';
import uglify from 'gulp-uglify';
import pump from 'pump';
import imagemin from 'gulp-imagemin';
import imageminOptipng from 'imagemin-optipng';
import imageminSvgo from 'imagemin-svgo';
// import imageminMozjpeg from 'imagemin-mozjpeg';
import imageminGifsicle from 'imagemin-gifsicle';
import webp from 'gulp-webp';
import { deleteAsync } from 'del';
import replace from 'gulp-replace';
import rev from 'gulp-rev';
import revRewrite from 'gulp-rev-rewrite';
import revDelete from 'gulp-rev-delete-original';
import revCssUrl from 'gulp-rev-css-url';
import purgecss from '@fullhuman/postcss-purgecss';
import fs from 'fs';

function noop() {}

gulp.task( 'del', () => deleteAsync( ['./dist/', './ja'] ) );

function processCSS( source = 'src', dest = 'dist', cb = noop ) {
  const plugins = [
    autoprefixer(),
    purgecss( {
      "content": [`./${source}/**/*.html`],
    } ),
    // cssnano(),
  ];

  const pipeline = [
    gulp.src( `./${source}/style/**/*.css` ),
    postcss( plugins ),
    gulp.dest( `./${dest}/style/` ),
  ];

  pump( pipeline, cb );
}

gulp.task( 'cssmin', ( cb ) => {
  processCSS( 'public', 'dist', cb );
} );

gulp.task( 'cssmin-postprocess', ( cb ) => {
  processCSS( 'dist', 'dist', cb );
  // processCSS( 'ja', 'ja', cb );
} );

function processFonts( source = 'public', dest = 'dist', cb = noop ) {
  const pipeline = [
    gulp.src( './src/style/fonts/*.{eot,otf,ttf,woff,woff2}' ),
    gulp.dest( './dist/style/fonts/' ),
  ];

  pump( pipeline, cb );
}

gulp.task( 'fonts', ( cb ) => {
  processFonts( 'public', 'dist', cb );
} );

gulp.task( 'fonts-postprocess', ( cb ) => {
  processFonts( 'dist', 'dist', cb );
  // processFonts( 'ja', 'ja', cb );
} );

function processHTML( source = 'public', dest = 'dist', cb = noop ) {
  pump( [
    gulp.src( `./${source}/**/*.html` ),
    htmlmin( {
      "collapseWhitespace": true,
      "removeComments": true,
    } ),
    gulp.dest( `./${dest}` ),
  ], cb );
}

gulp.task( 'htmlmin', ( cb ) => {
  processHTML( 'public', 'dist', cb );
} );

gulp.task( 'htmlmin-postprocess', ( cb ) => {
  processHTML( 'dist', 'dist', cb );
  // processHTML( 'ja', 'ja', cb );
} );

function processJS( source = 'public', dest = 'dist', cb = noop ) {
  const pipeline = [
    gulp.src( `./${source}/script/**/*.js` ),
    uglify( {
      "compress": {
        "drop_console": true,
        "drop_debugger": true,
      },
    } ),
    gulp.dest( `./${dest}/script` ),
  ];

  pump( pipeline, cb );
}

gulp.task( 'jsmin', ( cb ) => {
  processJS( 'public', 'dist', cb );
} );

gulp.task( 'jsmin-postprocess', ( cb ) => {
  processJS( 'dist', 'dist', cb );
  // processJS( 'ja', 'ja', cb );
} );

function png2webp( source = 'public', dest = 'dist', cb = noop ) {
  const pngSrcs = [
    `./${source}/**/*.png`,
    `!./${source}/img/source/**/*`,
  ];

  const pipeline = [
    gulp.src( pngSrcs ),
    webp( {
      "lossless": true,
      // "nearLossless": 100
    } ),
    gulp.dest( `./${dest}/` ),
  ];

  pump( pipeline, cb );
}

function processImages( source = 'public', dest = 'dist', cb = noop ) {
  const imgSources = [
    `./${source}/**/*.{png,gif,jpg,jpeg,jxr,webp,bpg,bmp,svg}`,
    `!./${source}/img/source/**/*`,
  ];
  // var imgSources = `./${source}/img/**/*.{png,gif,jpg,jpeg,jxr,webp,bpg,bmp,svg}`;

  const pipeline = [
    gulp.src( imgSources ),
    imagemin( [
      imageminGifsicle(),
      // imageminJpegtran(),
      // imageminMozjpeg(),
      imageminOptipng(),
      imageminSvgo(),
    ], {
      "verbose": true,
    } ),
    gulp.dest( `./${dest}/` ),
  ];

  pump( pipeline, cb );
}

gulp.task( 'img', ( cb ) => {
  processImages( 'public', 'dist', cb );
} );

gulp.task( 'img-postprocess', ( cb ) => {
  processImages( 'public', 'dist' );
  png2webp( 'dist', 'dist', cb );
  // processImages( 'public', 'ja' );
  // png2webp( 'ja', 'ja', cb );
} );

gulp.task( 'img-postprocess-ja', ( cb ) => {
  processImages( 'ja', 'ja', cb );
} );

gulp.task( 'delocalize', ( cb ) => {
  pump( [
    gulp.src( './dist/**/*.html' ),
    replace( '//local.', '//' ),
    gulp.dest( './dist/' ),
  ], cb );
} );

// NOTE: '.eot's do not get subsetted by glyphhanger
gulp.task( 'font-subsets', ( cb ) => {
  pump(
    [
      gulp.src( './dist/**/*.css' ),
      replace( /(LeagueGothic-[^-]+)\.(ttf|otf|woff|woff2)/g, '$1-subset.$2' ),
      gulp.dest( './dist/' ),
    ],
    () => {
      pump(
        [
          gulp.src( './dist/**/*.css' ),
          replace( /(fonts\/skolar-sans\/)(?:web|ttf|otf)\/(SkolarSansPE)(?:Web)?(-[^-]+)\.(ttf|otf|woff|woff2)/g, '$1$2$3-subset.$4' ),
          gulp.dest( './dist/' ),
        ],
        () => {
          // Accord Alternate is pre-subsetted so we can skip NoSpoon and Productions
          // TODO: Un-pre-subset
          pump(
            [
              gulp.src( './dist/**/*.css' ),
              replace( /(?<!NoSpoon|Productions)\.woff(['"]?(?:\s+)?\))/g, '.zopfli.woff$1' ),
              gulp.dest( './dist/' ),
            ],
            cb,
          );
        },
      );
    },
  );
} );

function processAudio( source = 'public', dest = 'dist', cb ) {
  const pipeline = [
    gulp.src( `./${source}/audio/*.{mp3,wav,flac,aac,ac3}` ),
    gulp.dest( `./${dest}/audio/` ),
  ];

  pump( pipeline, cb );
}

gulp.task( 'audio', ( cb ) => {
  processAudio( 'public', 'dist', cb );
} );

gulp.task( 'audio-postprocess', ( cb ) => {
  processAudio( 'dist', 'dist', cb );
  // processAudio( 'ja', 'ja', cb );
} );

function processFavicon( source = 'public', dest = 'dist', cb = noop ) {
  const pipeline = [
    gulp.src( `./${source}/*.{ico,png}` ),
    gulp.dest( `./${dest}/` ),
  ];

  pump( pipeline, cb );
}

gulp.task( 'favicon', ( cb ) => {
  processFavicon( 'public', 'dist', cb );
} );

gulp.task( 'favicon-postprocess', ( cb ) => {
  processFavicon( 'dist', 'dist', cb );
  // processFavicon( 'ja', 'ja', cb );
} );

function revision( source = 'dist', dest = 'dist', cb = noop ) {
  // TODO: - Fonts are broken because rev-css-url does not replace inside @font-face for some reason (even though it claims to)
  pump( [
    gulp.src( `${source}/**/*.{ico,png,gif,jpg,jpeg,jxr,webp,bpg,bmp,svg,js,css,eot,ttf,otf,woff,woff2}` ),
    rev(),
    revCssUrl(),
    revDelete(),
    gulp.dest( `./${dest}/` ),
    rev.manifest(),
    gulp.dest( `./${dest}/` ),
  ], cb );
}

gulp.task( 'rev', ( cb ) => {
  revision( 'dist', 'dist', cb );
} );
// TODO: en and ja should share assets instead of having duplicates
gulp.task( 'rev-ja', ( cb ) => {
  revision( 'ja', 'ja', cb );
} );

function revisionRewrite( source = 'dist', dest = 'dist', cb = noop ) {
  pump( [
    gulp.src( `${source}/**/*.{html,css,js}` ),
    revRewrite( {
      "manifest": fs.readFileSync( `${dest}/rev-manifest.json` ),
    } ),
    gulp.dest( `${dest}` ),
  ], cb );
}

gulp.task( 'rev-rewrite', ( cb ) => {
  revisionRewrite( 'dist', 'dist', cb );
} );

gulp.task( 'rev-rewrite-ja', ( cb ) => {
  revisionRewrite( 'ja', 'ja', cb );
} );

gulp.task(
  'default',
  gulp.series(
    'del',
    gulp.parallel( 'cssmin', 'fonts', 'htmlmin', 'jsmin', 'img', 'audio', 'favicon' ),
    'delocalize',
  ),
);

gulp.task(
  'update',
  gulp.series(
    gulp.parallel( 'cssmin', 'fonts', 'htmlmin', 'jsmin', 'img', 'audio', 'favicon' ),
    'delocalize',
  ),
);

gulp.task(
  'update-noimg',
  gulp.series(
    gulp.parallel( 'cssmin', 'fonts', 'htmlmin', 'jsmin', 'audio', 'favicon' ),
    'delocalize',
  ),
);

gulp.task(
  'postprocess',
  gulp.series(
    gulp.parallel(
      'cssmin-postprocess',
      // 'fonts-postprocess',
      'htmlmin-postprocess',
      'jsmin-postprocess',
      'audio-postprocess',
      'favicon-postprocess',
    ),
    'img-postprocess',
    'delocalize',
    'font-subsets',
    'rev',
    // 'rev-ja',
    'rev-rewrite',
    // 'rev-rewrite-ja',
  ),
);
