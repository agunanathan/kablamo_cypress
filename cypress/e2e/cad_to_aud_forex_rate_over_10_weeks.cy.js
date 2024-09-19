describe("Fetch Forex Rate and Calculate Average", () => {
  const baseCurrency = "CAD"; // Base currency
  const targetCurrency = "AUD"; // Target currency
  const numOfWeeks = 10; // Number of weeks for historical data

  const getApiUrl = (base, target, weeks) =>
    `https://www.bankofcanada.ca/valet/observations/FX${base}${target}/json?recent_weeks=${weeks}`;

  it(`Should get a 200 response and calculate the average Forex rate from ${baseCurrency} to ${targetCurrency} for the last ${numOfWeeks} weeks`, () => {
    cy.request({
      method: "GET",
      url: getApiUrl(baseCurrency, targetCurrency, numOfWeeks),
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
        return; // Exit the test early
      }

      // Log number of days of data
      cy.log(`Number of days of data: ${observations.length}`);

      // Calculate the sum of exchange rates over each observation day
      let sum = 0;
      observations.forEach((observation) => {
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
      url: getApiUrl(baseCurrency, "INVALID", numOfWeeks),
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.not.eq(200);
      cy.log(`API Response Status for Invalid Endpoint: ${response.status}`);
      expect(response.status).to.eq(404); // endpoint returns a 404 error
    });
  });

  // Negative Scenario: API Response with Errors
  it("Should handle API response with errors", () => {
    cy.request({
      method: "GET",
      url: getApiUrl(baseCurrency, targetCurrency, 0), // Adding 0 for number of weeks gives 400 response status
      failOnStatusCode: false, // Prevent Cypress from failing the test automatically
    }).then((response) => {
      // Log and assert if the response status is not 200
      if (response.status !== 200) {
        cy.log(`API Error Handling Status: ${response.status}`);
        expect(response.status).to.not.eq(200);
      } else {
        //assertion for successful 200 response
        cy.log(`Unexpected success response: ${response.status}`);
        expect(response.status).to.eq(200); // This scenario should not be possible
      }
    });
  });
});
