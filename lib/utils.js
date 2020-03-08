const POOR_THRESHOLD = 0;
const AVERAGE_THRESHOLD = 50;
const GOOD_THRESHOLD = 90;

const thresholds = {
    POOR_THRESHOLD,
    AVERAGE_THRESHOLD,
    GOOD_THRESHOLD,
};

/**
 * Get the textual score representation.
 *
 * @param {number} score
 *
 * @returns {string}
 */
const getScoreConst = (score) => {
    if (score < thresholds.AVERAGE_THRESHOLD) {
        return 'poor';
    }

    if (score < thresholds.GOOD_THRESHOLD) {
        return 'average';
    }

    return 'good';
};

/**
 * Format the categories data for the notifiers.
 *
 * @param {object} categories
 *
 * @returns {{score: number, title}[]}
 */
const formatCategories = (categories) => {
    return Object.values(categories)
        .map(({ id, title, score }) => ({
            id,
            title,
            score: score * 100,
        }));
};

module.exports = {
    thresholds,
    getScoreConst,
    formatCategories,
};
