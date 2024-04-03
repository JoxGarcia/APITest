context("Users API's Automation", () => {
  const createUser = (userInfo) => {
    return cy.request("POST", `/user`, userInfo);
  };

  const createUsers = (userInfo) => {
    return cy.request("POST", `/user/createWithList`, userInfo);
  };
  const loginUser = (username, password) => {
    return cy.request("GET", `/user/login`, { username, password });
  };

  describe("POST methods", () => {
    describe("POST /user - Create user", () => {
      it("Test Case: Create a new user with valid details and verify successful creation.", () => {
        cy.fixture("users.json").then((data) => {
          const newUser = data.user1;
          createUser(newUser).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.include(newUser);
          });
        });
      });
    });

    describe("POST /user/createWithList - Create list of users with given input array", () => {
      it("Test Case: Create multiple users with an array of user objects and verify successful creation of each.", () => {
        cy.fixture("users.json").then((data) => {
          const usersList = [data.user2, data.user3];
          createUsers(usersList).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.deep.include.members(usersList);
          });
        });
      });
    });
  });

  describe("GET Methods", () => {
    describe("GET /user/login - Log user into the system", () => {
      it("Test Case: Log in with valid username and password and verify successful login.", () => {
        const newUser = {
          // Replace with valid user details
          username: "testUser",
          firstName: "Test",
          lastName: "User",
          email: "testuser@example.com",
          password: "password123",
          phone: "1234567890",
          userStatus: 1,
        };

        createUser(newUser).then(() => {
          loginUser(newUser.username, newUser.password).then((response) => {
            expect(response.status).to.eq(200);
            // Further verification of successful login
          });
        });
      });

      it("Test Case: Attempt to log in with invalid credentials and verify error response.", () => {
        const newUser = {
          // Replace with valid user details
          username: "testInvalidLogin",
          firstName: "TestInvalid",
          lastName: "Login",
          email: "testinvalid@example.com",
          password: "password123",
          phone: "1234567890",
          userStatus: 1,
        };

        createUser(newUser).then(() => {
          loginUser(newUser.username, "wrongpassword").then((response) => {
            expect(response.status).to.not.eq(200);
          });
        });
      });
    });

    describe("GET /user/{username} - Get user by user name", () => {
      it("Test Case: Retrieve a user by username and verify the user details are correct.", () => {
        const newUser = {
          username: "testRetrieveUser",
          firstName: "TestRetrieve",
          lastName: "User",
          email: "testretrieveuser@example.com",
          password: "password123",
          phone: "1234567890",
          userStatus: 1,
        };

        createUser(newUser).then(() => {
          cy.request("GET", `/user/${newUser.username}`).then((response) => {
            expect(response.status).to.eq(200);
            // Verification that the user details are correct
          });
        });
      });

      it("Test Case: Attempt to retrieve a user with a non-existent username and verify error response.", () => {
        // The username is deliberately set to a value that is expected to be non-existent
        const nonExistentUsername = "nonExistentUser123";

        cy.request({
          method: "GET",
          url: `/user/${nonExistentUsername}`,
          failOnStatusCode: false,
        }).then((response) => {
          expect(response.status).to.eq(404);
          // Further verification of the error response for a non-existent user
        });
      });
    });

    describe("GET /user/logout - Log out current logged-in session", () => {
      it("Test Case: Log out a currently logged-in user and verify successful logout.", () => {
        cy.fixture("users.json").then((users) => {
          const newUser = users.userLogout;
          createUser(newUser).then(() => {
            loginUser(newUser.username, newUser.password).then(() => {
              cy.request("GET", `/user/logout`).then((response) => {
                expect(response.status).to.eq(200);
              });
            });
          });
        });
      });
    });
  });
});
