const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

const root = path.join(__dirname, '..');
const markdownPath = path.join(root, 'docs', 'Project-Documentation.md');
const outputPath = path.join(root, 'docs', 'Project-Documentation.pdf');

const content = fs.readFileSync(markdownPath, 'utf8').split(/\r?\n/);

const doc = new PDFDocument({
  size: 'A4',
  margin: 50,
  info: {
    Title: 'Lost and Found System Documentation',
    Author: 'Campus Lost and Found Team',
  },
});

doc.pipe(fs.createWriteStream(outputPath));

doc.font('Helvetica-Bold').fontSize(18).text('Lost and Found System Documentation', {
  align: 'center',
});

doc.moveDown(1);

content.forEach((line) => {
  if (line.startsWith('# ')) {
    doc.moveDown(0.7);
    doc.font('Helvetica-Bold').fontSize(15).text(line.replace('# ', ''));
    doc.moveDown(0.2);
    return;
  }

  if (line.startsWith('## ')) {
    doc.moveDown(0.6);
    doc.font('Helvetica-Bold').fontSize(12).text(line.replace('## ', ''));
    doc.moveDown(0.2);
    return;
  }

  if (line.startsWith('- ')) {
    doc.font('Helvetica').fontSize(10.5).text(`- ${line.slice(2)}`, {
      indent: 12,
    });
    return;
  }

  if (/^\d+\./.test(line.trim())) {
    doc.moveDown(0.25);
    doc.font('Helvetica-Bold').fontSize(10.5).text(line.trim());
    return;
  }

  if (!line.trim()) {
    doc.moveDown(0.35);
    return;
  }

  doc.font('Helvetica').fontSize(10.5).text(line, {
    align: 'left',
    lineGap: 1.5,
  });
});

doc.end();

console.log(`PDF generated at: ${outputPath}`);
