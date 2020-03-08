const axios = require('axios');
const logger = require('./logger');
const { getScoreConst } = require('./utils');

const slackEmojis = {
    poor: ':red_circle:',
    average: ':large_orange_diamond:',
    good: ':green_heart:',
};

class SlackNotifier {
    constructor({ webhookUrl, categories, url, options }) {
        this.webhookUrl = webhookUrl;
        this.url = url;
        this.options = options;
        this.categories = categories;
    }

    /**
     * Fire off the slack webhook.
     *
     * @returns {Promise}
     */
    notify() {
        return axios.post(this.webhookUrl, this.buildPayload).catch(({ response }) => {
            logger.error(`Webhook provided returned an error. [${ response.message }]`);
        });
    }

    /**
     * Return the JSON payload for the webhook.
     *
     * @returns {{blocks: [{text: {text: string, type: string}, type: string}, {type: string, fields}, {text: {text: string, type: string}, type: string}]}}
     */
    get buildPayload() {
        return {
            blocks: [
                this.introSection,
                this.categoriesSection,
                this.linkSection,
            ],
        };
    }

    /**
     * Return the intro section of the payload.
     *
     * @returns {{text: {text: string, type: string}, type: string}}
     */
    get introSection() {
        return {
            type: 'section',
            text: {
                type: 'mrkdwn',
                text: 'A new Lighthouse report has been generated based on the most recent deploy.',
            },
        };
    }

    /**
     * Return the categories section of the payload.
     *
     * @returns {object}
     */
    get categoriesSection() {
        return {
            type: 'section',
            fields: [
                {
                    type: 'mrkdwn',
                    text: `*URL Tested:*\n${ this.url }`,
                },
                ...this.categories.map((category) => ({
                    type: 'mrkdwn',
                    text: this.generateCategoryBlockText(category),
                })),
            ],
        };
    }

    /**
     * Return the link section of the payload.
     *
     * @returns {{text: {text: string, type: string}, type: string}}
     */
    get linkSection() {
        return {
            type: 'section',
            text: {
                type: 'mrkdwn',
                text: `*<${ process.env.APP_URL }/__lighthouse|Click to view the full report>*`,
            },
        };
    }

    /**
     * Return the markdown value for the a category.
     *
     * @param {string|number} change
     * @param {string} id
     * @param {number} score
     * @param {string} title
     *
     * @returns {string}
     */
    generateCategoryBlockText({ id, title, score, change }) {
        let text = `*${ title }:*`;

        if (this.options.htmlOutput) {
            text = `<${ process.env.APP_URL }/__lighthouse#${ id }|${ text }>`;
        }

        text += `\n${ slackEmojis[getScoreConst(score)] } ${ score }/100`;

        if (change) {
            text += ' '.repeat(20);
            text += `(${ change })`;
        }

        return text;
    }
}

module.exports = SlackNotifier;
