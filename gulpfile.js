import gulp from 'gulp';
import browserSync from 'browser-sync';
import gulpSass from 'gulp-sass';
import * as dartSass from 'sass';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import cleanCSS from 'gulp-clean-css';
import rename from 'gulp-rename';
import htmlmin from 'gulp-htmlmin';
import imagemin from 'gulp-imagemin';
import imageminMozjpeg from 'imagemin-mozjpeg';
import imageminPngquant from 'imagemin-pngquant';
import webp from 'gulp-webp';
import imageminWebp from 'imagemin-webp';
import imageminSvgo from 'imagemin-svgo';
import replace from 'gulp-replace';
import svgSprite from 'gulp-svg-sprite';
import * as esbuild from 'esbuild';

const path = {
    source: {
        folder: './source',
        css: {
            src: './source/css/style.css',
            folder: './source/css',
        },
        scss: {
            src: './source/scss/style.scss',
            watcher: './source/scss/**/*.scss'
        },
        image: {
            rasterImage: {
                src: './source/image/**/*.{png,jpg,jpeg,webp}',
                folder: './source/image'
            },
            vectorImage: {
                src: './source/image/**/*.svg',
                watcher: './source/image/**/*.svg',
                folder: './source/image/sprite'
            }
        },
        js: {
            src: './source/js/main.js',
            watcher: './source/js/**/*.js',
            folder: './source/js',
        },
        html: {
            src: './source/*.html',
            watcher: './source/*.html',
        },
        fonts: {
            src: './source/fonts/**/*.{woff,woff2}',
            folder: './source/fonts',
        }
    },
    build: {
        folder: './dist',
        css: {
            folder: './dist/css',
            src: './dist/css/style.min.css',
        },
        js: {
            folder: './dist/js',
            src: './dist/js/main.min.js'
        },
        image: {
            rasterImage: {
                src: './dist/image/*.{jpg,jpeg,png}',
                folder: './dist/image'
            },
            vectorImage: {
                folder: './dist/image/sprite',
                src: './dist/image/sprite/*.svg',
            }
        },
        fonts: {
            folder: './dist/fonts'
        },
        html: {
            src: './dist/*.html',
        }
    },
}

// Конвертация scss в css
const sass = gulpSass(dartSass);

const scss = () => {
    return gulp.src(path.source.scss.src, {sourcemaps: true}) // Ищет файл и создает карту кода
        .pipe(sass()) // Преобразует scss в css
        .pipe(replace('../../', '../'))
        .pipe(postcss([autoprefixer()])) // Добавляет префексы для поддержки разных браузеров
        .pipe(gulp.dest(path.source.css.folder, {sourcemaps: '.'})) // Складывает файлы в указанную папку и карту кода туда же
        .pipe(browserSync.stream()); // Обновляет страницу на случай, если он уже включен
};

// // Минифицирует css для build версии
const minifyCss = () => {
    return gulp.src(path.source.css.src) // Ищет файл
        .pipe(cleanCSS()) // Минифицирует файлы css
        .pipe(rename({extname: '.min.css'})) // Переименует получившийся файл
        .pipe(gulp.dest(path.build.css.folder)) // Складывает файлы в указанную папку
}

// JS
const jsDev = async () => {
    await esbuild.build({
        entryPoints: [path.source.js.src],
        bundle: true,
        outfile: path.source.js.src,
        sourcemap: true,
        allowOverwrite: true,
        format: 'iife',
    })
}

const jsBuild = async () => {
    await esbuild.build({
        entryPoints: [path.source.js.src],
        bundle: true,
        outfile: path.build.js.src,
        sourcemap: true,
        allowOverwrite: true,
        format: 'iife',
        minify: true,
    })
}

// Минифицирует html для build версии
const minifyHTML = () => {
    return gulp.src(path.source.html.src) // Ищет файл
        .pipe(htmlmin({collapseWhitespace: true})) // Минифицирует html
        .pipe(gulp.dest(path.build.folder))// Складывает файлы в указанную папку
}

// Копирование шрифтов и перенос в build
const copyFonts = () => {
    return gulp.src(path.source.fonts.src, {encoding: false})
        .pipe(gulp.dest(path.build.fonts.folder))
}

// Копирование шрифтов и перенос в build
const copyFavicon = () => {
    return gulp.src(path.source.folder + '/favicon.ico', {encoding: false})
        .pipe(gulp.dest(path.build.folder))
}


// Редактирование путей в html
const renamePathHtml = () => {
    return gulp.src(path.build.html.src)
        .pipe(replace('style.css', 'style.min.css'))
        .pipe(replace('.svg', ''))
        .pipe(replace('image/sprite/', 'image/sprite/sprite.svg#'))
        .pipe(replace('./js/main.js', './js/main.min.js'))
        .pipe(gulp.dest(path.build.folder))
}

// Редактирование путей в css
const renamePathCss = () => {
    return gulp.src(path.build.css.src)
        .pipe(replace('.svg', ''))
        .pipe(replace('../image/sprite/', '../image/sprite/sprite.svg#'))
        // .pipe(replace('./js/modules/main.js', './main.min.js'))
        .pipe(gulp.dest(path.build.css.folder))
}

// Sprite
const sprite = () => {
    return gulp.src(path.source.image.vectorImage.src) // Ищет файлы
        .pipe(imagemin([imageminSvgo()]))
        .pipe(svgSprite({
            mode: {
                stack: {
                    sprite: 'sprite.svg',
                    dest: '.'
                }
            },
            shape: {
                id: {
                    separator: ''
                },
            }
        }))
        .pipe(gulp.dest(path.build.image.vectorImage.folder)) // Кладет спрайт в корень папки
}

// Оптимизация изображений
const optimizingRasterImages = () => {
    return gulp.src(path.source.image.rasterImage.src, {encoding: false}) // Ищет изображения
        .pipe(imagemin([imageminMozjpeg({quality: 75}), imageminPngquant()])) // Оптимизирует png, jpg и webp
        .pipe(gulp.dest(path.build.image.rasterImage.folder)); // Кладет обратно в source версию
}

const createWebpImages = () => {
    return gulp.src(path.build.image.rasterImage.src) // Ищет изображения
        .pipe(webp()) // Создает webp изображения
        .pipe(imagemin([imageminWebp()])) // Оптимизирует png, jpg и webp
        .pipe(gulp.dest(path.build.image.rasterImage.folder)); // Кладет обратно в source версию
}

// Запуск сервера
const start = () => {
    browserSync.init({
        server: {
            baseDir: path.source.folder,
        }
    })
}

const startBuild = () => {
    browserSync.init({
        server: {
            baseDir: path.build.folder,
        }
    })
}

// Наблюдатели
const watch = () => {
    gulp.watch(path.source.html.watcher).on('change', browserSync.reload);
    gulp.watch(path.source.js.watcher).on('change', jsDev, browserSync.reload);
    gulp.watch(path.source.scss.watcher, scss);
}

const dev = gulp.series(scss, jsDev, gulp.parallel(watch, start));
const build = gulp.series(scss, minifyHTML, minifyCss, jsBuild, optimizingRasterImages, createWebpImages, sprite, renamePathHtml, renamePathCss, copyFonts, copyFavicon);

export default dev;
export {build, startBuild}

// 6. Так же создать функцию переименовывания файлов для build версии (css, js, webp)
// 7. Создать функцию для очистки файлов перед запуском build версии
