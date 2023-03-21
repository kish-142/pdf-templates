const gulp = require("gulp");
const pug = require("gulp-pug");
// const htmlmin = require("gulp-htmlmin");
const plumber = require("gulp-plumber");
const changed = require("gulp-changed");
const rename = require("gulp-rename");
const { dest } = require("gulp");

const htmlFiles = "./src/**/*.html";
const pugFiles = "./src/**/*.pug";
const cssFiles = "./src/**/*.css";
const distFolder = "./dist";

gulp.task("compile-html", () => {
  return (
    gulp
      .src(htmlFiles)
      .pipe(plumber())
      .pipe(changed(distFolder, { extension: ".html" }))
      .pipe(rename({ extname: ".html" }))
      // .pipe(htmlmin({ collapseWhitespace: true }))
      .pipe(dest(distFolder))
  );
});

gulp.task("compile-pug", () => {
  return (
    gulp
      .src(pugFiles)
      .pipe(plumber())
      .pipe(changed(distFolder, { extension: ".html" }))
      .pipe(pug())
      // .pipe(htmlmin({ collapseWhitespace: true }))
      .pipe(rename({ extname: ".html" }))
      .pipe(dest(distFolder))
  );
});

gulp.task("css", () => {
  return gulp.src([cssFiles, "!.src/styles.css"]).pipe(dest(distFolder));
});

gulp.task("clean", async function () {
  const { deleteAsync } = await import("del");

  return await deleteAsync(["dist/**/*", "!dist/styles.css"], { force: true });
});

gulp.task("watch", () => {
  gulp.watch(
    "./src/**/*.{html,pug,css}",
    gulp.series("clean", gulp.parallel("compile-html", "compile-pug", "css"))
  );
});

gulp.task(
  "compile",
  gulp.series("clean", gulp.parallel("compile-html", "compile-pug", "css"))
);
