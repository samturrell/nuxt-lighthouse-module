const chalkTable = require('chalk-table');
const chalk = require('chalk');
const consola = require('consola');
const { formatCategories, getScoreConst } = require('./utils');

const colourFuncs = {
    poor: chalk.red,
    average: chalk.yellow,
    good: chalk.green,
};

class ConsoleNotifier {
    constructor({ url, categories }) {
        this.url = url;
        this.categories = formatCategories(categories);
    }

    /**
     * Get the value to display in the table for the provided
     * score, with appropriate colour value via chalk.
     *
     * @param {number} score
     *
     * @returns {*}
     */
    getColourValue(score) {
        return colourFuncs[getScoreConst(score)](`${ score }/100`);
    }

    /**
     * Format the categories data for the table.
     *
     * @returns {{score: *, title: *}[]}
     */
    get categoriesForTable() {
        return this.categories
            .map(({ title, score }) => ({
                title,
                score: this.getColourValue(score),
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
            ],
        }, this.categoriesForTable);

        consola.log(`${ table }\n`);
    }
}

module.exports = ConsoleNotifier;
