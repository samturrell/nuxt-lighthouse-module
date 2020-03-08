const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');

class LighthouseReporter {
    constructor({ url, flags, ...opts }) {
        this.url = url;
        this.flags = flags;
        this.opts = opts;
    }

    /**
     * Run the lighthouse report.
     *
     * @returns {Promise}
     */
    async run() {
        const chrome = await chromeLauncher.launch({
            chromeFlags: this.flags,
        });

        const results = await lighthouse(this.url, {
            port: chrome.port,
            ...this.opts,
        });

        await chrome.kill();

        return results;
    }
}

module.exports = LighthouseReporter;
