# PDF Templates

Generate PDF templates either from `html` or `pug` files using <strong>[Puppeteer](https://pptr.dev)</strong> NodeJS library and [TailwindCSS](https://tailwindcss.com) for utility classes.

# PDF Templates

Generate PDF templates either from `html` or `pug` files using <strong>[Puppeteer](https://pptr.dev)</strong> NodeJS library and [TailwindCSS](https://tailwindcss.com) for utility classes.

## Installation

To use the PDF Template, you can clone and run the following command:

```bash
npm install
```

This will install all the necessary dependencies for the project.

## Usage
Create the files in `html` or `pug` under `src` directory

To compile the project, you can run the following command:

```bash
npm run dev
```

This will compile the file and watch for any changes made .

In the `src` directory, you will find the general CSS styles that should be linked to every HTML file created.

To merge the HTML and CSS files into a single file and generate a PDF, run the following command:

```bash
node app.js
```

This command will generate a PDF file in the `pdf` directory and move the merged file to the `output` directory.

## Customization

The project includes a `template.html` file that provides the header and footer design for the PDF file. To start with a new PDF template, you can copy and paste the code from the `template.html` file.

After copying the code, you need to update the title tag and link to the general CSS file.
