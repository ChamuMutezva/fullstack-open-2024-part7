import axios from "axios";
const baseUrl = "/api/blogs";

let token = null;

const setToken = (newToken) => {
    token = `Bearer ${newToken}`;
};

const getAll = () => {
    const request = axios.get(baseUrl);
    return request.then((response) => response.data);
};

const create = async (newObject) => {
    const config = {
        headers: { Authorization: token },
    };
    const response = await axios.post(baseUrl, newObject, config);
    return response.data;
};

const update = async (updatedBlog) => {
    const response = await axios.put(
        `${baseUrl}/${updatedBlog.id}`,
        updatedBlog
    );
    //const response = await request;
    return response.data;
};

const deleteBlog = (id) => {
    const config = {
        headers: { Authorization: token },
    };
    const request = axios.delete(`${baseUrl}/${id}`, config);
    return request.then((response) => response.data);
};

const getSingleBlog =  async (id) => {
    const request = axios.get(`${baseUrl}/${id}`);
    const response = await request;
    return response.data;
};

export default { getAll, setToken, create, update, deleteBlog, getSingleBlog };
