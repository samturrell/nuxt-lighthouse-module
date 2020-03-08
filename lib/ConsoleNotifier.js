const chalkTable = require('chalk-table');
const chalk = require('chalk');
const logger = require('./logger');
const { getScoreConst } = require('./utils');

const colourFuncs = {
    poor: chalk.red,
    average: chalk.yellow,
    good: chalk.green,
};

class ConsoleNotifier {
    constructor({ categories }) {
        this.categories = categories;
    }

    /**
     * Get the value to display in the table for the provided
     * score, with appropriate colour value via chalk.
     *
     * @param {number} score
     *
     * @returns {*}
     */
    formatScoreValue(score) {
        return colourFuncs[getScoreConst(score)](`${ score }/100`);
    }

    /**
     * Format the "change" value. Set it's colour based on the colourFunc mapping.
     *
     * @param {number|string} val
     *
     * @returns {string}
     */
    formatChangeValue(val) {
        const parsedVal = parseFloat(val);
        let func = colourFuncs.average;

        if (parsedVal < 0) {
            func = colourFuncs.poor;
        }

        if (parsedVal > 0) {
            func = colourFuncs.good;
        }

        return func(val);
    }

    /**
     * Format the categories data for the table.
     *
     * @returns {{score: *, title: *}[]}
     */
    get categoriesForTable() {
        return this.categories
            .map(({ score, change, ...category  }) => ({
                ...category,
                score: this.formatScoreValue(score),
                change: this.formatChangeValue(change),
            }));
    }

    /**
     * Log to the console.
     */
    notify() {
        const table = chalkTable({
            leftPad: 2,
            columns: [
                { field: 'title', name: 'Category' },
                { field: 'score', name: 'Score' },
                { field: 'change', name: 'Change' },
            ],
        }, this.categoriesForTable);

        logger.log(`\n${ table }\n`);
    }
}

module.exports = ConsoleNotifier;
