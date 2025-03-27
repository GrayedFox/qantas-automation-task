# qantas-automation-task

Technical task involving API and web front-end automation using `PlayWright`.

## Role

Senior Quality Engineer - Qantas Hotels

> [!TIP]
> Cool built in [table of contents][6] (thanks GitHub :rocket:).

## Requirements

- [NodeJS][0]: for installing `PlayWright` and other project deps
- [Node Version Manager][2]: for easily managing installed node versions

## Setup

From the project root please do the following:

1. `npm ci`: clean install of project deps
2. `npx playwright install --with-deps`: ensures PlayWright has everything it needs to run on your operating system
3. Create a `.env` file and set the variable PlayWright uses for the `baseUrl`
4. To interact with the WeatherBit API you'll need [to signup][7] to the free tier of their service and confirm your account via a confirmation email

> [!NOTE]
> Set the chance seed if needing consistency in case of a failed runs, see the [chance docs][8] for more info. Leaving it blank results in a random UUID being used as the seed.

```bash
QAT_PW_CHANCE_SEED=""
QAT_PW_SWAG_URL="https://www.saucedemo.com/"
QAT_PW_SWAG_USERNAME="standard_user"
QAT_PW_SWAG_PASSWORD="secret_sauce"
QAT_PW_WEATHER_BIT_API_KEY=""
QAT_PW_WEATHER_BIT_URL="https://api.weatherbit.io/"
```

### VSCode Extensions

If using `vscode` and allowing the workspace recommended extensions and settings to apply prettier will format files on
save and markdown will render in the same style as it does on GitHub.

- `esbenp.prettier-vscode`: Prettier
- `bierner.markdown-preview-github-styles`: Markdown Preview Github Styling
- `dbaeumer.vscode-eslint`: Integrated ESLint

## Linting and Formatting

- `npm run lint`: lint everything with ESLint
- `npm run prettify`: format everything with Prettier

## Test Running and Development

- `npm run dev`: open the playwright test runner
- `npm run test:api`: run the API tests headlessly
- `npm run test:web`: run the integration tests headlessly

## Why PlayWright for everything?

There were a few options that stood out as potential frameworks for this task, namely:

- `PACT`: is a mature framework but is best utilized _"...where you (or your team/organisation/partner organisation) control the development of both
  the consumer and the provider"_ (see FAQ question about testing [public APIs][4])
- `postman-cli`: now [supports generating JUnit][3] and other widely used test report formats, this may be a better choice for certain teams and
  organisations that already use Postman for manual API testing, development, and/or documentation but it also requires a Postman team and API key
- `newmann`: is the historical go-to companion to Postman but still benefits if Postman is already being used as part of the team's tooling given it
  [consumes a collection][5] (or URL)

This repo optimizes for the following:

1. time constraints: minimal setup and dependencies while still meeting all required acceptance criteria dictated in the brief
2. unified language and environment: pytest is great for paramtrizing fixtures and keeping tests DRY but multiple languages increases overhead
3. stongly typed and easy to debug: using TypeScript and PlayWright for both API and web tests will speed up development and reduce debugging time

Using PACT would likely be a good get given more complex API testing needs and multiple teams/products, this mostly came down to the "right tool
for the job" givent the scope of the task.

## Troubleshooting

> add troubleshooting steps when encountered
> note that if an invalid UUID is provided for the Mersenne twister seed it will default to a randomly generated one

## Report

### Bugs

1. it's not possible to add multiple of the same product to the cart from the product list or cart display
2. the dollar sign is missing from the cart display page
3. it's not possible to edit the quantity despite it looking a bit like an input
4. it's possible to enter only spaces for the customer information which will get past the details screen
5. the customer details field never asks for an address, unless that information is tied to the stored payment method, the shop won't know where to ship the products
6. the customer's details aren't displayed on the checkout summary screen
7. the checkout button is a link (`a`) instead of a `button` element on the your cart screen
8. the continue button on the your informatio screen is classed as an input instead of a `button`
9. the finish button is a link (`a`) instead of a `button` element on the your cart screen

### Other

- tested all sorting functions manually and they are working as expected and described (A-Z, Z-A, High-Low, Low-High)

[0]: https://nodejs.org/en/download
[1]: https://learning.postman.com/docs/postman-cli/postman-cli-installation/
[2]: https://github.com/nvm-sh/nvm
[3]: https://github.com/postmanlabs/postman-app-support/issues/11761#issuecomment-1979999006
[4]: https://docs.pact.io/faq#why-pact-may-not-be-the-best-tool-for-public-testing-apis
[5]: https://learning.postman.com/docs/collections/using-newman-cli/installing-running-newman/#run-a-collection-with-newman
[6]: https://github.blog/changelog/2021-04-13-table-of-contents-support-in-markdown-files/
[7]: https://www.weatherbit.io/account/create
[8]: https://chancejs.com/usage/seed.html
