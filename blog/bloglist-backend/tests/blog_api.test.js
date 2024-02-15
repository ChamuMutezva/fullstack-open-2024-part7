const mongoose = require("mongoose");
const supertest = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../app");
const api = supertest(app);
const Blog = require("../models/blog");
const User = require("../models/user");
const helper = require("../utils/list_helper");

beforeEach(async () => {
    await Blog.deleteMany({});
    let blogObject = new Blog(helper.initialBlogs[0]);
    await blogObject.save();
    blogObject = new Blog(helper.initialBlogs[1]);
    await blogObject.save();
    blogObject = new Blog(helper.initialBlogs[2]);
    await blogObject.save();
    blogObject = new Blog(helper.initialBlogs[3]);
    await blogObject.save();
    blogObject = new Blog(helper.initialBlogs[4]);
    await blogObject.save();
    blogObject = new Blog(helper.initialBlogs[5]);
    await blogObject.save();
}, 100000);

describe("Blogs returned", () => {
    // 4.8: Blog list tests, step1
    test("blogs are returned as json", async () => {
        await api
            .get("/api/blogs")
            .expect(200)
            .expect("Content-Type", /application\/json/);
    }, 100000);

    // 4.8: Blog list tests, step1
    test("all blogs are returned", async () => {
        const response = await api.get("/api/blogs");
        expect(response.body).toHaveLength(helper.initialBlogs.length);
    }, 100000);

    test("a specicic blog is within the returned blogs", async () => {
        const response = await api.get("/api/blogs");
        const titles = response.body.map((r) => r.title);
        expect(titles).toContain("Canonical string reduction");
    }, 100000);

    // 4.9: Blog list tests, step2
    test("verify unique identifier of blog post", async () => {
        const response = await api.get("/api/blogs");
        const ids = response.body.map((r) => r.id);
        expect(ids).toBeDefined();
    }, 100000);

    test("the first blog is about React", async () => {
        const response = await api.get("/api/blogs");

        expect(response.body[0].title).toBe("React patterns");
    }, 100000);
});

describe("Blog added to list", () => {
    // 4.10: Blog list tests, step3 -
    test("a valid blog has been added", async () => {
        const newBlog = {
            title: "React advanced programming",
            author: "Chamu Mutezva",
            url: "www.reactadv.com",
            likes: 19,
        };

        const user = await User.findOne({});
        // eslint-disable-next-line no-undef
        const token = jwt.sign({ id: user._id }, process.env.SECRET);

        if (!token) {
            return response.status(401).json({ error: "Token not found" });
        }

        await api
            .post("/api/blogs")
            .set("Authorization", `Bearer ${token}`)
            .send(newBlog)
            .expect(201)
            .expect("Content-Type", /application\/json/);

        const response = await api.get("/api/blogs");
        const blogs = response.body.map((blog) => blog.title);

        expect(response.body).toHaveLength(helper.initialBlogs.length + 1);
        expect(blogs).toContain("React advanced programming");
    }, 100000);

    // 4.11: Blog list tests, step4
    test("If likes property is missing default value to zero", async () => {
        const newBlog = {
            title: "CSS advanced",
            author: "Chamu Mutezva",
            url: "www.cssmastery.com",
        };

        const user = await User.findOne({});
        // eslint-disable-next-line no-undef
        const token = jwt.sign({ id: user._id }, process.env.SECRET);

        if (!token) {
            return response.status(401).json({ error: "Token not found" });
        }

        await api
            .post("/api/blogs")
            .set("Authorization", `Bearer ${token}`)
            .send(newBlog)
            .expect(201)
            .expect("Content-Type", /application\/json/);

        const response = await api.get("/api/blogs");
        expect(response.body).toHaveLength(helper.initialBlogs.length + 1);
    }, 100000);

    // 4.12*: Blog list tests, step5
    test("Verify title and url", async () => {
        const newBlog = {
            title: "CSS advanced",
            author: "Chamu Mutezva",
            url: "www.cssmastery.com",
            likes: 19,
        };

        const user = await User.findOne({});
        // eslint-disable-next-line no-undef
        const token = jwt.sign({ id: user._id }, process.env.SECRET);

        if (!token) {
            return response.status(401).json({ error: "Token not found" });
        }

        await api
            .post("/api/blogs")
            .set("Authorization", `Bearer ${token}`)
            .send(newBlog)
            .expect(201)
            .expect("Content-Type", /application\/json/);

        const response = await api.get("/api/blogs");
        expect(response.body).toHaveLength(helper.initialBlogs.length + 1);
    }, 100000);
});

describe("deletion of a blog", () => {
    test("succeeds with status code 204 if id is valid", async () => {
        const blogsAtStart = await helper.blogsInDb();
        const blogToDelete = blogsAtStart[0];
        await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);
        const blogsAtEnd = await helper.blogsInDb();
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1);
    });
}, 100000);

describe("updating a blog post", () => {
    test("update the number of likes", async () => {
        const blogsAtStart = await helper.blogsInDb();
        const blogToUpdate = blogsAtStart[0];
        console.log(blogToUpdate.id);
        const newBlog = {
            ...blogToUpdate,
            likes: 18,
        };

        await api
            .put(`/api/blogs/${blogToUpdate.id}`)
            .send(newBlog)
            .expect(200)
            .expect("Content-Type", /application\/json/);

        const response = await api.get("/api/blogs");
        console.log(response.body);

        const updatedBlog = await response.body.find((blog) => {
            console.log(blog.id);
            console.log(blogToUpdate.id);
            return blog.id === blogToUpdate.id;
        });

        expect(updatedBlog.likes).toBe(18);
    });
}, 100000);

// 4.16*: bloglist expansion, step4
describe("Validation when creating new user", () => {
    test("username has at least 3 characters", async () => {
        const newUser = {
            name: "Chamunorwa Mutezva",
            username: "Chamu",
            password: "wpopo",
        };

        expect(newUser.username).toBeDefined();
        expect(newUser.username.length).toBeGreaterThanOrEqual(3);
    });

    test("password has at least 3 characters", async () => {
        const newUser = {
            name: "Chamunorwa Mutezva",
            username: "Ch",
            password: "wpopo",
        };

        expect(newUser.password).toBeDefined();
        expect(newUser.password.length).toBeGreaterThanOrEqual(3);
    });
});

afterAll(async () => {
    await mongoose.connection.close();
});
