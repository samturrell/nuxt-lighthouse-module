const SlackNotifier = require('./SlackNotifier');
const LighthouseReporter = require('./LighthouseReporter');
const ConsoleNotifier = require('./ConsoleNotifier');
const HTMLOutput = require('./HTMLOutput');
const consola = require('consola');

class LighthouseModule {
    constructor({ context, options }) {
        this.context = context;
        this.options = options;

        this.run();
    }

    /**
     * Run the module process.
     *
     * @returns {Promise<void>}
     */
    async run() {
        if (this.options.consoleNotifier) {
            consola.info(`Running lighthouse report on ${ process.env.APP_URL }`);
        }

        const { lhr, report } = await (new LighthouseReporter({
            url: process.env.APP_URL,
            output: 'html',
            flags: [
                '--show-paint-rects',
                '--headless',
            ],
        })).run();

        if (this.options.htmlOutput) {
            (new HTMLOutput({
                report,
                options: this.options,
                context: this.context,
            })).generate();
        }

        if (this.options.consoleNotifier) {
            (new ConsoleNotifier({
                url: lhr.finalUrl,
                categories: lhr.categories,
                options: this.options,
                context: this.context,
            })).notify();
        }

        if (this.options.slackWebhookUrl) {
            (new SlackNotifier({
                url: lhr.finalUrl,
                webhookUrl: this.options.slackWebhookUrl,
                categories: lhr.categories,
                options: this.options,
                context: this.context,
            })).notify();
        }

        consola.info(`Url tested: ${ lhr.finalUrl }\n`);
    }
}

module.exports = LighthouseModule;
