const axios = require('axios');
const consola = require('consola');
const { formatCategories, getScoreConst } = require('./utils');

const slackEmojis = {
    poor: ':red_circle:',
    average: ':large_orange_diamond:',
    good: ':green_heart:',
};

class SlackNotifier {
    constructor({ webhookUrl, categories, url }) {
        this.webhookUrl = webhookUrl;
        this.url = url;
        this.categories = formatCategories(categories);
    }

    /**
     * Fire off the slack webhook.
     *
     * @returns {Promise}
     */
    notify() {
        return axios.post(this.webhookUrl, this.buildPayload).catch(({ response }) => {
            consola.error(`Webhook provided returned an error. [${ response.message }]`);
        });
    }

    /**
     * Return the JSON payload for the webhook.
     *
     * @returns {{blocks: [{text: {text: string, type: string}, type: string}, {type: string, fields}, {text: {text: string, type: string}, type: string}]}}
     */
    get buildPayload() {
        return {
            'blocks': [
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
                ...this.categories.map(({ title, score }) => ({
                    type: 'mrkdwn',
                    text: `*${ title }:*\n${ slackEmojis[getScoreConst(score)] } ${ score }/100`,
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
}

module.exports = SlackNotifier;
