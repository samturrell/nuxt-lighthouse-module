const LighthouseModule = require('./lib/LighthouseModule');

/**
 * Setup the module.
 *
 * @param {object} moduleOptions
 */
export default async function NuxtLighthouseModule(moduleOptions = {}) {
    const options = {
        slackWebhookUrl: '',
        htmlOutput: false,
        consoleNotifier: true,
        ...moduleOptions,
        ...this.options.lighthouse || {},
    };

    if (
        process.env.LIGHTHOUSE_ENABLED !== 'true'
        || this.options.dev
        // TODO: Find better way to check for build
        || process.argv.find((arg) => arg === 'nuxtbuild')
        || (!options.slackWebhookUrl && !options.htmlOutput && !options.consoleNotifier)
    ) {
        return;
    }

    this.nuxt.hook('ready', () => {
        (new LighthouseModule({
            context: this,
            options,
        })).run();
    });
};
