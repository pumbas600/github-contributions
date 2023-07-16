# Contributing

## How to Contribute

### Reporting Bugs

If you run into an issue, please first check the [issue tracker](https://github.com/pumbas600/github-contributions/issues?q=is%3Aissue+label%3Abug+) to ensure it hasn't been reported before. Only open a new issue if you haven't found anything similar to your issue.

### Development

The API consists of a single endpoint [`/api/contributions/[username]`](./src/pages/api/contributions/[username].tsx). It utilises [recharts](https://www.npmjs.com/package/recharts) to generate a React graph that is then rendered as a string. The component that is generated is located [here](./src/components/ContributionsChart.tsx).

Some slightly cursed string operations are then used to extract the generated `svg` and embed it within another `svg` which contains some custom css.

The custom options are validated using [`zod`](https://zod.dev/). The default options are specified in the [OptionsService](./src/services/OptionsService.ts).