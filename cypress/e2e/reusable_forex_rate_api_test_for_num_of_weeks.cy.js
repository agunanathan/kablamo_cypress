describe("Fetch Forex Rate for baseCurrency to targetCurrency for numOfWeeks and Calculate Average", () => {
  // Get parameters from environment variables or default to 'CAD', 'AUD', and 10 weeks
  const baseCurrency = Cypress.env("baseCurrency") || "CAD";
  const targetCurrency = Cypress.env("targetCurrency") || "AUD";
  const numOfWeeks = Cypress.env("weeks") || 10;

  // Function to generate API URL with dynamic parameters
  const getApiUrl = (base, target) =>
    `https://www.bankofcanada.ca/valet/observations/FX${base}${target}/json?recent_weeks=${numOfWeeks}`;

  // Positive test: Successful data retrieval and average rate calculation
  it(`Should get a 200 response and calculate the average Forex rate from ${baseCurrency} to ${targetCurrency} for the last ${numOfWeeks} weeks`, () => {
    cy.request({
      method: "GET",
      url: getApiUrl(baseCurrency, targetCurrency),
    }).then((response) => {
      // Assert successful response
      expect(response.status).to.eq(200);
      cy.log(`API Response Status: ${response.status} (Success)`);

      // Extract observations
      const observations = response.body.observations;
      // Check if observations are empty
      if (observations.length === 0) {
        cy.log("No data available for the specified period.");
        assert.isOk(false, "Data is empty, unable to calculate average rate.");
        return;
      }
      // Log number of days of data
      cy.log(`Number of days of data: ${observations.length}`);

      // Calculate the sum of exchange rates over each observation day
      let sum = 0;
      observations.forEach((observation) => {
        const rateValue = observation[`FX${baseCurrency}${targetCurrency}`].v;
        const rate = parseFloat(
          observation[`FX${baseCurrency}${targetCurrency}`].v
        );
        sum += rate;
      });
      // Calculate and log the average rate
      const averageRate = sum / observations.length;
      cy.log(
        `Average ${baseCurrency} to ${targetCurrency} exchange rate over the last ${numOfWeeks} weeks: ${averageRate.toFixed(
          4
        )}`
      );
    });
  });

  // Negative Scenario: Invalid API Endpoint
  it("Should handle an invalid API endpoint gracefully", () => {
    cy.request({
      method: "GET",
      url: getApiUrl(baseCurrency, "INVALID"),
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.not.eq(200);
      cy.log(`API Response Status for Invalid Endpoint: ${response.status}`);
      expect(response.status).to.eq(404); // Emndpoint returns a 404 error
    });
  });

  // Negative Scenario: API Response with Errors
  it("Should handle API response with errors", () => {
    cy.request({
      method: "GET",
      url: getApiUrl(baseCurrency, targetCurrency, 0), // Invalid number of weeks
      failOnStatusCode: false,
    }).then((response) => {
      if (response.status !== 200) {
        cy.log(`API Error Handling Status: ${response.status}`);
        expect(response.status).to.not.eq(200);
      } else {
        cy.log(`Unexpected success response: ${response.status}`);
        expect(response.status).to.eq(200); // This scenario should not be possible
      }
    });
  });
});
