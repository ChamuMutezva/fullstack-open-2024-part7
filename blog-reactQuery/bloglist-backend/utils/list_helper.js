const Blog = require("../models/blog");
const initialBlogs = [
    {
        id: "5a422a851b54a676234d17f7",
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 7,
        __v: 0,
    },
    {
        id: "5a422aa71b54a676234d17f8",
        title: "Go To Statement Considered Harmful",
        author: "Edsger W. Dijkstra",
        url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
        likes: 5,
        __v: 0,
    },
    {
        id: "5a422b3a1b54a676234d17f9",
        title: "Canonical string reduction",
        author: "Edsger W. Dijkstra",
        url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
        likes: 12,
        __v: 0,
    },
    {
        id: "5a422b891b54a676234d17fa",
        title: "First class tests",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
        likes: 10,
        __v: 0,
    },
    {
        id: "5a422ba71b54a676234d17fb",
        title: "TDD harms architecture",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
        likes: 0,
        __v: 0,
    },
    {
        id: "5a422bc61b54a676234d17fc",
        title: "Type wars",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
        likes: 2,
        __v: 0,
    },
];
// 4.3: helper functions and unit tests, step1
const dummy = (blogs) => {
    return blogs.length === 0 ? 1 : blogs.length / blogs.length;
};

// 4.4: helper functions and unit tests, step2
const totalLikes = (blogs) => {
    return blogs.reduce((sum, blog) => {
        return sum + blog.likes;
    }, 0);
};

// 4.5*: helper functions and unit tests, step3
const favoriteBlog = (blogs) => {
    return blogs.find(
        (blog) => blog.likes === Math.max(...blogs.map((blog) => blog.likes))
    );
};

// 4.7*: helper functions and unit tests, step5
const mostLikes = (blogs) => {
    const result = blogs.find(
        (blog) => blog.likes === Math.max(...blogs.map((blog) => blog.likes))
    );
    return {
        author: result.author,
        likes: result.likes,
    };
};

// 4.6*: helper functions and unit tests, step4
const mostBlogs = (blogs) => {
    const authorBlogs = blogs.reduce((op, { author }) => {
        op[author] = op[author] || 0;
        op[author]++;
        return op;
    }, {});
    const mostBlogsAuthor = Object.keys(authorBlogs).reduce((a, b) =>
        authorBlogs[a] > authorBlogs[b] ? a : b
    );
    return { author: mostBlogsAuthor, blogs: authorBlogs[mostBlogsAuthor] };
};

const blogsInDb = async () => {
    const blogs = await Blog.find({});
    return blogs.map((blog) => blog.toJSON());
};

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes,
    initialBlogs,
    blogsInDb,
};
