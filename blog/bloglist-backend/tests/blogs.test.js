const listHelper = require("../utils/list_helper");

// 4.3: helper functions and unit tests, step1
test("dummy returns one", () => {
    const blogs = [];

    const result = listHelper.dummy(blogs);
    expect(result).toBe(1);
});

// 4.4: helper functions and unit tests, step2
describe("total likes", () => {
    const listWithOneBlog = [
        {
            _id: "5a422aa71b54a676234d17f8",
            title: "Go To Statement Considered Harmful",
            author: "Edsger W. Dijkstra",
            url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
            likes: 5,
            __v: 0,
        },
    ];

    test("when list has only one blog, equals the likes of that", () => {
        const result = listHelper.totalLikes(listWithOneBlog);
        expect(result).toBe(5);
    });

    test("List with more than one blog", () => {
        const result = listHelper.totalLikes(listHelper.initialBlogs);
        expect(result).toBe(36);
    });
});

// 4.5*: helper functions and unit tests, step3
describe("Favorite blog", () => {
    test("Favorite blog from the list", () => {
        const result = listHelper.favoriteBlog(listHelper.initialBlogs);
        expect(result).toEqual({
            id: "5a422b3a1b54a676234d17f9",
            title: "Canonical string reduction",
            author: "Edsger W. Dijkstra",
            url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
            likes: 12,
            __v: 0,
        });
    });
});

// 4.6*: helper functions and unit tests, step4
describe("Author with most blogs", () => {
    test("The author who has written most blogs", () => {
        const result = listHelper.mostBlogs(listHelper.initialBlogs);
        console.log(result);
        expect(result).toEqual({
            author: "Robert C. Martin",
            blogs: 3,
        });
    });
});

// 4.7*: helper functions and unit tests, step5
describe("Most liked blog and author", () => {
    test("Most liked blog from list and author", () => {
        const result = listHelper.mostLikes(listHelper.initialBlogs);
        expect(result).toEqual({
            author: "Edsger W. Dijkstra",
            likes: 12,
        });
    });
});
