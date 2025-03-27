# qantas-automation-task

Technical task involving API and web front-end automation using `PlayWright`.

## Role

Senior Quality Engineer - Qantas Hotels

> [!TIP]
> Cool built in [table of contents][6] (thanks GitHub!).

## Requirements

- [NodeJS][0]: for installing `PlayWright` and other project deps
- [Node Version Manager][2]: for easily managing installed node versions

## Setup

From the project root please do the following:

1. `npm ci`: clean install of project deps
2. `npx playwright install --with-deps`: ensures PlayWright has everything it needs to run on your operating system
3. Create a `.env` file and set the variable PlayWright uses for the `baseUrl`

```bash
QAT_PW_BASE_URL="https://www.saucedemo.com/v1/"
```

### VSCode Extensions

If using `vscode` and allowing the workspace recommended extensions and settings to apply prettier will format files on save and markdown will render in the same style as it does on GitHub.

- `esbenp.prettier-vscode`: Prettier
- `bierner.markdown-preview-github-styles`: Markdown Preview Github Styling

## Linting and Formatting

- `npm run lint`: lint everything with ESLint
- `npm run prettify`: format everything with Prettier

## Running Tests

### playwright

## Why PlayWright for everything?

There were a few options that stood out as potential frameworks for this task, namely:

- `PACT`: is a mature framework but is best utilized "...where you (or your team/organisation/partner organisation) control the development of both
  the consumer and the provider", see FAQ question about testing [public APIs][4]
- `postman-cli`: now [supports generating JUnit][3] and other widely test report formats, this may be a better choice for certain teams and organisations that already use Postman for manual API testing, development, and/or documentation but it also requires a Postman team and API key
- `newmann`: is the historical go-to companion to Postman but still benefits if Postman is already being used as part of the team's tooling given it
  [consumes a collection][5] (or URL)

This little task repo optimizes for the following conditions:

1. minimal setup and dependencies while still meeting all required acceptance criteria dictated in the brief
2. a single programming language (pytest is great for paramtrizing fixtures and keeping tests DRY but introduces too much overhead)
3.

## Troubleshooting

> add troubleshooting steps when encountered

[0]: https://nodejs.org/en/download
[1]: https://learning.postman.com/docs/postman-cli/postman-cli-installation/
[2]: https://github.com/nvm-sh/nvm
[3]: https://github.com/postmanlabs/postman-app-support/issues/11761#issuecomment-1979999006
[4]: https://docs.pact.io/faq#why-pact-may-not-be-the-best-tool-for-public-testing-apis
[5]: https://learning.postman.com/docs/collections/using-newman-cli/installing-running-newman/#run-a-collection-with-newman
[6]: https://github.blog/changelog/2021-04-13-table-of-contents-support-in-markdown-files/
