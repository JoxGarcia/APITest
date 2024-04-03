/// <reference types="cypress" />

context("Pet API's Automation", () => {
  context("POST - Methods", () => {
    describe("POST  /pet - Add a new pet to the store", () => {
      it("Test Case: Add a new pet with all required details.", () => {
        cy.fixture("petsinfo.json").then((data) => {
          const pet = data.pet3;
          cy.request({
            method: "POST",
            url: "/pet",
            body: pet,
            headers: {
              "Content-Type": "application/json",
            },
          }).then((response) => {
            expect(response.status).to.eq(200);
          });
        });
      });

      it("Test Case: Try to add a pet without providing all mandatory fields.", () => {
        cy.fixture("petsinfo.json").then((data) => {
          const pet = data.badPet;
          cy.request({
            method: "POST",
            url: "/pet",
            body: pet,
            failOnStatusCode: false, // We don't want Cypress to fail the test if status code is 4xx
            headers: {
              "Content-Type": "application/json",
            },
          }).then((response) => {
            expect(response.status).to.be.oneOf([400, 405]); // Assuming the API returns a 400 Bad Request or 422 Unprocessable Entity for missing fields
          });
        });
      });
    });

    describe("POST /pet/{petId} - Update a pet in the store with form data", () => {
      it("Test Case: Update data for an existing pet using valid form data.", () => {
        const petId = 10;
        cy.request({
          method: "POST",
          url: `/pet/${petId}`,
          qs: {
            name: "doggie",
            status: "sold",
          },
        }).then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body).to.have.property("id", petId);
          expect(response.body).to.have.property("name", "doggie");
          expect(response.body).to.have.property("status", "sold");
        });
      });

      it("Test Case: Try to update data for a pet using an invalid ID.", () => {
        const invalidPetId = 999999; // Assuming this ID does not exist
        cy.request({
          method: "POST",
          url: `/pet/${invalidPetId}`,
          qs: {
            name: "doggie",
            status: "sold",
          },
          failOnStatusCode: false, // We expect this to fail as the ID is invalid
        }).then((response) => {
          expect(response.status).to.eq(404);
        });
      });
    });
  });

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

  describe("DELETE - Methods", () => {
    describe("DELETE /pet/{petId} - Delete a pet", () => {
      it("Test Case: Delete a pet using a valid ID.", () => {
        const validPetId = 1;
        cy.request({
          method: "DELETE",
          url: `/pet/${validPetId}`,
        }).then((response) => {
          expect(response.status).to.eq(200);
        });
      });

      it("Test Case: Try to delete a pet using an invalid ID.", () => {
        const invalidPetId = 9999999999999999999999;
        cy.request({
          method: "DELETE",
          url: `/pet/${invalidPetId}`,
          failOnStatusCode: false,
        }).then((response) => {
          expect(response.status).to.eq(400);
        });
      });
    });
  });
});
