/// <reference types="cypress" />

context("Pet API's Automation", () => {
  context("GET Methods", () => {
    describe("GET /pet/{petId} - Find pet by ID", () => {
      it("Test Case: Retrieve a pet using a valid ID", () => {
        cy.request({
          method: "GET",
          url: "/pet/1",
        }).then((response) => {
          expect(response.status).to.eq(200);
        });
      });

      it("Test Case: Try to retrieve a pet using an invalid", () => {
        cy.request({
          method: "GET",
          url: "/pet/2x",
          failOnStatusCode: false,
        }).then((response) => {
          expect(response.status).to.eq(400);
        });
      });

      it("Test Case: Try to retrieve a pet using an non-existent ID.", () => {
        cy.request({
          method: "GET",
          url: "/pet/123123123123",
          failOnStatusCode: false,
        }).then((response) => {
          expect(response.status).to.eq(404);
        });
      });
    });

    describe("GET /pet/findByTags - Find pets by tags", () => {
      it("Test Case: Search for pets using a valid tag.", () => {
        cy.request({
          method: "GET",
          url: "/pet/findByTags?tags=tag1",
        }).then((response) => {
          expect(response.status).to.eq(200);
        });
      });
    });

    describe("GET  /pet/findByStatus - Find pets by status", () => {
      it(`Test Case: Search for pets with the 'available' status and verify that the response contains only pets that are available.`, () => {
        cy.request({
          method: "GET",
          url: "/pet/findByStatus",
          qs: {
            status: "available",
          },
        }).then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body).to.not.be.null;
          response.body.forEach((pet) => {
            expect(pet.status).to.eq("available");
          });
        });
      });

      it("Test Case: Search for pets with the 'pending' status and verify that the response contains only pets that are pending.", () => {
        cy.request({
          method: "GET",
          url: "/pet/findByStatus",
          qs: {
            status: "pending",
          },
        }).then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body).to.not.be.null;
          response.body.forEach((pet) => {
            expect(pet.status).to.eq("pending");
          });
        });
      });

      it("Test Case: Search for pets with the 'sold' status and verify that the response contains only pets that have been sold.", () => {
        cy.request({
          method: "GET",
          url: "/pet/findByStatus",
          qs: {
            status: "sold",
          },
        }).then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body).to.not.be.null;
          response.body.forEach((pet) => {
            expect(pet.status).to.eq("sold");
          });
        });
      });

      it("Test Case: Search for pets using an invalid status (e.g., 'nonexistent') and verify that the error is handled correctly, possibly by returning an HTTP status code like 400 (Bad Request).", () => {
        cy.request({
          method: "GET",
          url: "/pet/findByStatus",
          qs: {
            status: "nonexistent",
          },
          failOnStatusCode: false, // para evitar que Cypress falle con estados de respuesta distintos de 2xx y 3xx
        }).then((response) => {
          expect(response.status).to.eq(400); // o el código de estado esperado para este error
        });
      });
    });
  });

  context("PUT - Methods", () => {
    describe("PUT /pet - Update an existing pet", () => {
      it("Test Case: Update the information of an existing pet with valid data.", () => {
        cy.fixture("petsinfo.json").then((data) => {
          const pet = data.pet1;
          cy.request({
            method: "PUT",
            url: "/pet",
            body: pet, // Usamos pet1 como el cuerpo de la solicitud
            headers: {
              "Content-Type": "application/json",
            },
          }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body.name).to.eq(pet.name);
          });
        });
      });
      it("Test Case: Try to update a pet that does not exist to see how the error is handled.", () => {
        cy.fixture("petsinfo.json").then((data) => {
          const pet = data.pet2;
          cy.request({
            method: "PUT",
            url: "/pet",
            failOnStatusCode: false,
            body: pet,
            headers: {
              "Content-Type": "application/json",
            },
          }).then((response) => {
            expect(response.status).to.be.oneOf([400, 404]);
          });
        });
      });
    });
  });

  describe("POST - Methods", () => {});
  describe("DELETE - Methods", () => {});
});
