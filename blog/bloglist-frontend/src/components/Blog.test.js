import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Blog from "./Blog";
import CreateBlogForm from "./CreateBlogForm";

// 5.13: Blog list tests, step1
test("renders blog title and author", () => {
    const blog = {
        title: "Lord of rings",
        author: "Furl Kissinger",
    };

    render(<Blog blog={blog} />);
    expect(screen.getByText(blog.title)).toBeInTheDocument();
    expect(screen.getByText(blog.author)).toBeInTheDocument();
});

// 5.14: Blog list tests, step2
describe("div hidden at first", () => {
    let container;
    const mockHandler = jest.fn();

    beforeEach(() => {
        container = render(<Blog update={mockHandler} />).container;
    });

    test("at start the children are not displayed", async () => {
        const div = container.querySelector(".disclosure__content");
        expect(div).toHaveClass("hide");
    });

    test("after clicking the button, children are displayed", async () => {
        const div = container.querySelector(".disclosure__content");
        const user = userEvent.setup();
        const button = screen.getByText("View");
        await user.click(button);
        expect(div).not.toHaveClass("hide");
    });

    //5.15: Blog list tests, step3
    test("like button is clicked twice", async () => {
        const button = screen.getByText("Like");

        fireEvent.click(button);
        fireEvent.click(button);

        expect(mockHandler.mock.calls).toHaveLength(2);
    });
});

// 5.16: Blog list tests, step4
describe("test for the new blog form", () => {
    test("form calls the event handler", () => {
        const mockHandler = jest.fn();

        const component = render(
            <CreateBlogForm handleCreateBlog={mockHandler} />
        );

        const titleInput = component.container.querySelector("#title");
        const authorInput = component.container.querySelector("#author");
        const urlInput = component.container.querySelector("#url");
        const form = component.container.querySelector("#form");

        fireEvent.change(titleInput, {
            target: { value: "The rising moon" },
        });
        fireEvent.change(authorInput, {
            target: { value: "Chamu Mutezva" },
        });
        fireEvent.change(urlInput, {
            target: { value: "https://mutezva.com" },
        });
        fireEvent.submit(form);

        expect(mockHandler.mock.calls).toHaveLength(1);
        
        expect(mockHandler.mock.calls[0][0]).toEqual({
            title: "The rising moon",
            author: "Chamu Mutezva",
            url: "https://mutezva.com",
        });
        
    });
});
