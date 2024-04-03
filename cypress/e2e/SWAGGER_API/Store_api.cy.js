context("Store API's Automation", () => {
  describe("GET methods", () => {
    describe("GET  /store/inventory - Retrieve pet inventories by status", () => {
      it("Test Case: Verify that the response includes the correct inventory statuses.", () => {
        cy.request(`/store/inventory`).then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body).to.have.all.keys(
            "approved",
            "placed",
            "delivered"
          );
          expect(response.body.approved).to.be.a("number");
          expect(response.body.placed).to.be.a("number");
          expect(response.body.delivered).to.be.a("number");
        });
      });

      it("Test Case: Check that the response is properly formatted as a JSON object and contains integer values for inventory.", () => {
        cy.request(`/store/inventory`).then((response) => {
          expect(response.status).to.eq(200);
          expect(response.headers["content-type"]).to.include(
            "application/json"
          );
          expect(response.body).to.be.an("object");
          Object.keys(response.body).forEach((key) => {
            expect(response.body[key]).to.satisfy(Number.isInteger);
          });
        });
      });
    });

    describe("GET /store/order/{orderId} - Find purchase order by ID", () => {
      it("Test Case: Retrieve the details of an existing order using a valid order ID and verify the details match the placed order.", () => {
        const orderId = 1; // Replace with an ID that exists
        cy.request(`/store/order/${orderId}`).then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body).to.have.property("id", orderId);
          // Further checks for the order contents can be added here
        });
      });

      it("Test Case: Attempt to retrieve an order using an invalid or non-existent order ID and verify that the appropriate status code is returned.", () => {
        const orderId = 999999; // Use an ID that is likely invalid or does not exist
        cy.request({
          method: "GET",
          url: `/store/order/${orderId}`,
          failOnStatusCode: false,
        }).then((response) => {
          expect(response.status).to.be.oneOf([400, 404]);
          // Further checks for the error message or details can be added here
        });
      });
    });
  });

  describe("POST methods", () => {
    describe("POST /store/order - Place an order for a pet", () => {
      it("Test Case: Create an order with all necessary details and verify that the response returns the created order with a unique ID.", () => {
        cy.fixture("orders.json").then((validOrder) => {
          cy.request({
            method: "POST",
            url: `/store/order`,
            body: validOrder.order1,
            headers: {
              "Content-Type": "application/json",
            },
          }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.have.property("id");
            expect(response.body).to.have.property("petId");
          });
        });
      });

      it("Test Case: Attempt to create an order with incomplete or invalid data and verify that the error is handled appropriately.", () => {
        cy.fixture("orders.json").then((order) => {
          cy.request({
            method: "POST",
            url: `/store/order`,
            body: order.badOrder,
            headers: {
              "Content-Type": "application/json",
            },
            failOnStatusCode: false,
          }).then((response) => {
            console.log(response);
            expect(response.status).to.eq(400);
          });
        });
      });
    });
  });

  describe("DELETE /store/order/{orderId} - Delete purchase order by ID", () => {
    it("Test Case: Delete an existing order using a valid order ID and verify the response confirms the deletion.", () => {
      cy.fixture("orders.json").then((validOrder) => {
        cy.request("POST", `/store/order`, validOrder).then(
          (createResponse) => {
            const orderId = createResponse.body.id;

            // Actual test for deletion
            cy.request("DELETE", `/store/order/${orderId}`).then(
              (deleteResponse) => {
                expect(deleteResponse.status).to.eq(200);
                // Add any additional assertions you need to verify the deletion
              }
            );
          }
        );
      });
    });

    it("Test Case: Attempt to delete an order using an invalid or non-existent order ID and verify that the appropriate status code is returned for the failed operation.", () => {
      const invalidOrderId = "invalid-id";
      cy.request({
        method: "DELETE",
        url: `/store/order/${invalidOrderId}`,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.be.oneOf([400, 404]);
      });
    });
  });
});
