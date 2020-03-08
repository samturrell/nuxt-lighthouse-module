const fs = require('fs');
const logger = require('./logger');

class HTMLOutput {
    constructor({ report, context }) {
        this.staticPath = context.nuxt.resolver.resolvePath('~static');
        this.outputDirectory = '__lighthouse';
        this.outputPath = `${ this.staticPath }/${ this.outputDirectory }`;
        this.report = report;
    }

    /**
     * Generate the HTML output file.
     */
    generate() {
        if (!fs.existsSync(this.outputPath)) {
            fs.mkdirSync(this.outputPath);
        }

        fs.writeFile(`${ this.outputPath }/index.html`, this.report, (err) => {
            if (err) {
                return logger.error(err);
            }
        });
    }
}

module.exports = HTMLOutput;
