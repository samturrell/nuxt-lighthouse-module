const fs = require('fs');
const { formatCategories } = require('./utils');

let lastReportOffset = 1;

class ReportHistory {
    constructor({ context }) {
        this.context = context;
    }

    /**
     * Return the reoort storage directory path.
     *
     * @returns {string}
     */
    get storageDirectory() {
        return `${ this.context.nuxt.options.rootDir }/.lighthouse`;
    }

    /**
     * Return the path to the new report file.
     *
     * @returns {string}
     */
    get newReportFile() {
        return `${ this.storageDirectory }/${ (new Date()).toISOString() }.json`;
    }

    /**
     * Return the content of the last report if there is one.
     *
     * @returns {undefined|object}
     */
    get lastReport() {
        const files = fs.readdirSync(this.storageDirectory)
            .sort((a, b) => a < b ? -1 : 1);

        const lastReportFile = files[files.length - lastReportOffset];

        if (!lastReportFile) {
            return;
        }

        return JSON.parse(fs.readFileSync(`${ this.storageDirectory }/${ lastReportFile }`).toString());
    }

    /**
     * Store a report.
     *
     * @param {object} report
     *
     * @returns {ReportHistory}
     */
    store(report) {
        lastReportOffset++;

        if (!fs.existsSync(this.storageDirectory)) {
            fs.mkdirSync(this.storageDirectory);
        }

        fs.writeFileSync(this.newReportFile, JSON.stringify(report, null, 4));

        return this;
    }

    /**
     * Return the report with the addition of changes since last report.
     *
     * @param {object} report
     *
     * @returns {({score: number, title: *}|{change: (string|*)})[]}
     */
    changeSinceLastBuild(report) {
        const currentReportCategories = formatCategories(report.categories);
        const lastReportCategories = this.lastReport
            ? formatCategories(this.lastReport.categories)
            : currentReportCategories;

        return currentReportCategories.map(({ title, score, ...category }) => ({
            ...category,
            title,
            score,
            change: this.calculateChange(currentReportCategories, lastReportCategories, title),
        })).map(({ change, ...category }) => ({
            ...category,
            change: change > 0
                ? `+${ change }`
                : change,
        }));
    }

    /**
     * Calculate the change value between the current and previous report.
     *
     * @param {Array} current
     * @param {Array} last
     * @param {string} title
     *
     * @returns {number}
     */
    calculateChange(current, last, title) {
        const currentScore = current
            .find(({ title: t }) => t === title).score || 0;
        const lastScore = last
            .find(({ title: t }) => t === title).score || 0;

        return (lastScore - currentScore) * -1;
    }
}

module.exports = ReportHistory;
