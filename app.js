const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");
const cheerio = require("cheerio");

// TO DELETE THE DIRECTORY OUTPUT AND PDF BEFORE COMPILING
const outputPath = path.join(__dirname, "output");
const pdfPath = updateFilePath(
  path.join(
    __dirname,
    "pdf",
    path.relative(__dirname, path.join(__dirname, "dist"))
  )
);

if (fs.existsSync(outputPath)) {
  fs.rmSync(outputPath, { recursive: true });
}

if (fs.existsSync(pdfPath)) {
  fs.rmSync(pdfPath, {
    recursive: true,
  });
}

// PATH FOR DIST FOLDER
const distDir = path.join(__dirname, "dist");

// TO READ THE FILE CONTENT
function getFileContent(file, filePath) {
  const absolutePath = path.resolve(path.dirname(filePath), file);

  if (!fs.existsSync(absolutePath)) {
    console.error(`No css file is found for this path ${absolutePath}`);
    return;
  }

  return fs.readFileSync(absolutePath, "utf8");
}

// Remove dist from the file path
function updateFilePath(path) {
  const pathArr = path.split("/");

  pathArr.splice(pathArr.indexOf("dist"), 1);

  return pathArr.join("/");
}

// PDF CONVERSION
async function convertHtmlToPuppeter(outputFilePath, pdfDir, file) {
  const pdfFilePath = path.join(
    pdfDir,
    path.basename(file, path.extname(file)) + ".pdf"
  );

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(`file://${outputFilePath}`, {
    waitUntil: "networkidle0",
  });
  await page.pdf({
    path: pdfFilePath,
    format: "a4",
    scale: 1.3,
    printBackground: true,
    margin: {
      left: 30,
      top: 30,
      bottom: 0,
      right: 30,
    },
    displayHeaderFooter: true,
  });

  await browser.close();

  console.log(`PDF saved: ${pdfFilePath}`);
}

async function addExternalCssToInternalHtml(rootDir) {
  const outputDir = path.join(__dirname, "output");
  const pdfDir = updateFilePath(
    path.join(__dirname, "pdf", path.relative(__dirname, rootDir))
  );

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }
  if (!fs.existsSync(pdfDir)) {
    fs.mkdirSync(pdfDir, { recursive: true });
  }

  fs.readdir(rootDir, (err, files) => {
    if (err) {
      console.error(`Failed to read directory: ${rootDir}`, err);
      return;
    }

    files.forEach((file) => {
      const filePath = path.join(rootDir, file);

      if (fs.lstatSync(filePath).isDirectory()) {
        addExternalCssToInternalHtml(filePath);
      } else {
        if (path.extname(filePath) === ".html") {
          console.log("--Compiling:", filePath);

          let cssContent = "";
          let NEW_LINE = `\n`;

          const htmlContent = fs.readFileSync(filePath, "utf-8");

          const $ = cheerio.load(htmlContent);

          const links = $("link[href]");

          const srcAttributes = links
            .map(function () {
              return $(this).attr("href");
            })
            .get();

          srcAttributes.forEach((file) => {
            if (file.endsWith(".css")) {
              const css = getFileContent(file, filePath);

              if (css) {
                cssContent += NEW_LINE + css;
              }
            }
          });

          const styleTag = `<style>\n${cssContent}\n</style>`;

          const updatedHtmlContent = htmlContent.replace(
            /<\/head>/i,
            `${styleTag}\n</head>`
          );

          let outputFilePath = path.join(
            outputDir,
            path.relative(__dirname, filePath)
          );

          outputFilePath = updateFilePath(outputFilePath);

          if (!fs.existsSync(path.dirname(outputFilePath))) {
            fs.mkdirSync(path.dirname(outputFilePath), { recursive: true });
          }

          fs.writeFileSync(outputFilePath, updatedHtmlContent, "utf-8");

          console.log(`File saved: ${outputFilePath}`);

          convertHtmlToPuppeter(outputFilePath, pdfDir, file);
        }
      }
    });
  });
}

addExternalCssToInternalHtml(distDir);
