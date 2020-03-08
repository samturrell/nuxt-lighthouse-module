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

    // TODO: Find better way to check for build
    if (
        this.options.dev
        || process.argv.find((arg) => arg === 'nuxtbuild')
        || (!this.slackWebhookUrl && !this.htmlOutput && !this.consoleNotifier)
    ) {
        return;
    }

    this.nuxt.hook('ready', () => {
        setTimeout(() => {
            new LighthouseModule({
                context: this,
                options,
            });
        }, 5000);
    });
};
