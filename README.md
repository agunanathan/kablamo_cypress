Steps:

1.  Clone Repo
2.  Run "npm install"

Tests:
There are two test scripts;

🚀Mission

- Lightweight API automation framework using JavaScript utilizing Cypress.

🎯 Target

- Automate the following scenarios using valet API from the Bank of Canada :
  https://www.bankofcanada.ca/valet/docs :
- Find the average Forex conversion rate, "CAD to AUD," for the recent 10 weeks using
  observations by Series.
- Include assertions for positive and negative scenarios to ensure the accuracy and reliability of
  the API response.

💪 Stretch Goals:

- HTML reporting has been setup to use mochawesome.
  html report showing test results can be found in cypress>e2e>reports folder (index.html); generated new after every run
- Additional negative scenarios added to test error-handling capabilities.
- Code resusability has been setup to be able to pass in baseCurrency and targetCurrency along with numOfWeeks as cypress environment variables when run from CLI.
- Note that some baseCurrency targetCurrency parameters seem to have response body with Series not found. Tried to trouble shoot but not sure why but the following as an example:

  "message": "Series FXUSDAUD not found.",
  "docs": "https://www.bankofcanada.ca/valet/docs"

Running the tests on CLI:

- Running tests individually:
  script: cad_to_aud_forex_rate_over_10_weeks.cy.js
  CLI Command: npx cypress run --spec cypress/e2e/cad_to_aud_forex_rate_over_10_weeks.cy.js

      script: reusable_forex_rate_api_test_for_num_of_weeks.cy.js
      CLI Command: npx cypress run --env baseCurrency=USD,targetCurrency=CAD,weeks=10 --spec cypress/e2e/reusable_forex_rate_api_test_for_num_of_weeks.cy.js  // Note: weeks, baseCurrency and targetCurrency can be changed here before running

- Running both tests together on CLI:
  CLI command: npx cypress run --env baseCurrency=USD,targetCurrency=CAD,weeks=10 // Note: weeks, baseCurrency and targetCurrency can be changed here before running

- Running tests on Cypress Test Runner:
  Command: npx cypress open
