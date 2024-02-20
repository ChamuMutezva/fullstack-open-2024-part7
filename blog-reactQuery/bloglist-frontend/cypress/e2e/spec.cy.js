describe("Blog app", function () {
    beforeEach(function () {
        cy.request({
            method: "POST",
            url: "http://localhost:3003/api/testing/reset",
            failOnStatusCode: false,
        });
        const user = {
            name: "Chamu",
            username: "Chamu",
            password: "Chamu",
        };

        cy.request("POST", "http://localhost:3003/api/users/", user);
        cy.visit("http://localhost:5173");
    });

    // 5.17: bloglist end to end testing, step1
    it("Login form is shown", function () {
        cy.contains("Login to application");
        cy.get(".login-form").should("have.length", 1);
    });

    // 5.18: bloglist end to end testing, step2
    describe("Login", function () {
        it("succeeds with correct credentials", function () {
            cy.login({ username: "Chamu", password: "Chamu" });
            cy.contains("Chamu logged in");
        });

        it("fails with wrong credentials", function () {
            cy.get("#username").type("Chamu");
            cy.get("#password").type("wrong password");
            cy.get("#login-btn").click();

            cy.get(".error")
                .should("contain", "Wrong username or password")
                .and("have.css", "color", "rgb(255, 0, 0)")
                .and("have.css", "border-style", "solid");

            cy.get("html").should("not.contain", "Chamu logged in");
        });
    });

    describe("When logged in", function () {
        beforeEach(function () {
            cy.login({ username: "Chamu", password: "Chamu" });
        });

        // 5.19: bloglist end to end testing, step3
        it("A blog can be created", function () {
            cy.contains("Chamu logged in");
            cy.get("#show-createform-btn").click();
            cy.get("#title").type(
                "A blog created with Cypress testing application as a trial to end to end testing"
            );
            cy.get("#author").type("Gordon Bay");
            cy.get("#url").type("www.gordonbay.com");
            cy.get("#createform-btn").click();
            cy.contains(
                "A blog created with Cypress testing application as a trial to end to end testing"
            );
        });

        describe("A blog exists", function () {
            // 5.20: bloglist end to end testing, step4
            it("Users can like a blog", function () {
                cy.get("#view-details-btn").click();
                cy.get("#number-likes").contains("0");
                cy.get("#like-btn").click({ force: true });
                cy.get("#number-likes").contains("1");
            });

            // 5.21: bloglist end to end testing, step5
            it("User can delete own blog ", function () {
                cy.contains("Chamu logged in");
                cy.get("#show-createform-btn").click();

                cy.createBlog({
                    title: "A blog created with Cypress testing application as a trial to end to end testing",
                    author: "Gordon Bay",
                    url: "www.gordonbay.com",
                    likes: 0,
                });

                cy.get(".blog").should("have.length", 1);
                cy.get("#view-details-btn").click();

                cy.get("@blogId").then((blogId) => {
                    cy.deleteBlog(blogId);
                });

                cy.get(".blog").should("have.length", 0);
            });

            // 5.23: bloglist end to end testing, step7
            it("Order by number of likes descending", function () {
                cy.contains("Chamu logged in");
                cy.createBlog({
                    title: "First blog created with Cypress testing application as a trial to end to end testing",
                    author: "Gordon Bay",
                    url: "www.gordonbay.com",
                    likes: 7,
                });
                cy.createBlog({
                    title: "Second blog created with Cypress testing application as a trial to end to end testing",
                    author: "Henry Kissinger",
                    url: "www.kissinger.com",
                    likes: 20,
                });
                cy.createBlog({
                    title: "Third blog created with Cypress testing application as a trial to end to end testing",
                    author: "David Psalms",
                    url: "www.davidpsalms.com",
                    likes: 2,
                });

                cy.get(".blog")
                    .eq(0)
                    .should(
                        "contain",
                        "Second blog created with Cypress testing application as a trial to end to end testing"
                    );

                cy.get(".blog")
                    .eq(1)
                    .should(
                        "contain",
                        "First blog created with Cypress testing application as a trial to end to end testing"
                    );

                cy.get(".blog")
                    .eq(2)
                    .should(
                        "contain",
                        "Third blog created with Cypress testing application as a trial to end to end testing"
                    );
            });

            //
        });
    });

    describe("Login where the user can only see the delete button for own blogs ", function () {
        it("user can see the delete button", function () {
            cy.login({ username: "Chamu", password: "Chamu" });
            const user = {
                username: "testuser",
                name: "Test User",
                id: "1234567890",
            };

            
            const blog = {
                title: "Test Blog",
                author: "John Doe",
                url: "www.example.com",
                likes: 0,
                user: user,
            };

            cy.createBlog(blog);

            cy.get("#delete-btn").should("not.exist");

            cy.get("#view-details-btn").click();

            cy.get("#delete-btn").should("exist");

           // cy.deleteBlog(blog.id);
        });
    });
});
