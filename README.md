# Nuxt Lighthouse Module

This module provides a simple integration with Google Lighthouse, to perform Lighthouse reports on each deploy of your application.

This module can log to three different locations:

- Directly to the console
- To a file in the static folder of your app
- To Slack via a Slack Webhook

The module will run a Lighthouse report after your application has been built, or more specifically when the `ready` hook is fired.

This module will also store previous reports in a `.lighthouse` directory in your project root, and will use this to compare and return a `change` value, for how much each metric has changed since the last report.

## Why?

You may wish to monitor your Lighthouse scores as you make changes to your application, whether during development as part of Continuous Deployment to your staging environment, or after deploying to production.

## Installation

```sh
yarn add @samturrell/nuxt-lighthouse-module
```

## Usage

Simply add the module to your nuxt config:

```js
module.exports = {
    modules: [
        '@samturrell/nuxt-lighthouse-module',
    ],
};
```

And define any applicable options:

```js
module.exports = {
    lighthouse: {
        slackWebhookUrl: '',
        htmlOutput: true,
        consoleNotifier: true,
        maxReports: 10
    },
};
```

This module is disabled by default, and must be explicitly enable by setting the `LIGHTHOUSE_ENABLED` environment variable to `true`.

## Options

The following options are available:

### `slackWebhookUrl`

- Type: `string`
- Default: `''`

The webhook url to send the Slack notification to your channel of choice. For information on how to setup a webhook, check out the [Slack Documentation](https://api.slack.com/messaging/webhooks). If no value is supplied, no notification will be sent.

### `htmlOutput`

- Type: `boolean`
- Default: `false`

Set to `true` to enable html output. The results of the report will be copied to the static directory of your app, and will be accessible via the web at `/__lighthouse`.

### `consoleNotifier`

- Type: `boolean`
- Default: `true`

Set to `true` to enable logging to the console.

### `maxReports`

- Type: `number`
- Default: `10`

Set maximum reports to store
