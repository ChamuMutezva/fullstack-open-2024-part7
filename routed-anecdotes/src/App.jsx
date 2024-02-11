import { useState } from "react";
import PropTypes from "prop-types";

import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link,
    useParams,
    useNavigate,
} from "react-router-dom";
import { useField } from "./hooks";

const Menu = ({ anecdotes, addNew }) => {
    const padding = {
        paddingRight: 5,
    };
    return (
        <Router>
            <div>
                <Link to="/" style={padding}>
                    anecdotes
                </Link>
                <Link to="/create" style={padding}>
                    create new
                </Link>
                <Link to="/about" style={padding}>
                    about
                </Link>
            </div>
            <Routes>
                <Route
                    path="anecdote/:id"
                    element={<Anecdote anecdotes={anecdotes} />}
                />
                <Route
                    path="/"
                    element={<AnecdoteList anecdotes={anecdotes} />}
                />

                <Route path="/create" element={<CreateNew addNew={addNew} />} />
                <Route path="/about" element={<About />} />
            </Routes>
        </Router>
    );
};

const Anecdote = ({ anecdotes }) => {
    const id = useParams().id;
    console.log(id);
    const anecdote = anecdotes.find((anec) => anec.id === Number(id));
    console.log(anecdote);
    return (
        <div>
            <h2>
                {anecdote.content} by {anecdote.author}{" "}
            </h2>
            <p>has {anecdote.votes} votes</p>
            <p>
                For more info see{" "}
                <a href={`${anecdote.info}`} rel="noreferrer" target="_blank">
                    {anecdote.info}
                </a>
            </p>
        </div>
    );
};

const AnecdoteList = ({ anecdotes }) => (
    <div>
        <h2>Anecdotes</h2>
        <ul>
            {anecdotes.map((anecdote) => (
                <li key={anecdote.id}>
                    <Link to={`anecdote/${anecdote.id}`}>
                        {anecdote.content}
                    </Link>
                </li>
            ))}
        </ul>
    </div>
);

const About = () => (
    <div>
        <h2>About anecdote app</h2>
        <p>According to Wikipedia:</p>

        <em>
            An anecdote is a brief, revealing account of an individual person or
            an incident. Occasionally humorous, anecdotes differ from jokes
            because their primary purpose is not simply to provoke laughter but
            to reveal a truth more general than the brief tale itself, such as
            to characterize a person by delineating a specific quirk or trait,
            to communicate an abstract idea about a person, place, or thing
            through the concrete details of a short narrative. An anecdote is
            `&quot;`a story with a point.`&quot;`
        </em>

        <p>
            Software engineering is full of excellent anecdotes, at this app you
            can find the best and add more.
        </p>
    </div>
);

const Footer = () => (
    <div>
        Anecdote app for{" "}
        <a href="https://fullstackopen.com/">Full Stack Open</a>. See{" "}
        <a href="https://github.com/fullstack-hy2020/routed-anecdotes/blob/master/src/App.js">
            https://github.com/fullstack-hy2020/routed-anecdotes/blob/master/src/App.js
        </a>{" "}
        for the source code.
    </div>
);

const CreateNew = (props) => {
    const content = useField("text");
    const author = useField("text");
    const info = useField("text");

    const navigate = useNavigate();

    console.log(content);
    const handleSubmit = (e) => {
        e.preventDefault();
        // eslint-disable-next-line react/prop-types
        props.addNew({
            content: content.value,
            author: author.value,
            info: info.value,
            votes: 0,
        });
        navigate("/");
    };

    const reset = () => {
        content.reset();
        author.reset();
        info.reset();
    };

    return (
        <div>
            <h2>create a new anecdote</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    content{" "}
                    <input
                        type={content.type}
                        value={content.value}
                        onChange={content.onChange}
                    />
                </div>
                <div>
                    author{" "}
                    <input
                        type={author.type}
                        value={author.value}
                        onChange={author.onChange}
                    />
                </div>
                <div>
                    url for more info <input type={info.type} value={info.value} onChange={info.onChange}/>
                </div>
                <button>create</button>
                <button type="reset" onClick={reset}>
                    reset
                </button>
            </form>
        </div>
    );
};

const App = () => {
    const [anecdotes, setAnecdotes] = useState([
        {
            content: "If it hurts, do it more often",
            author: "Jez Humble",
            info: "https://martinfowler.com/bliki/FrequencyReducesDifficulty.html",
            votes: 0,
            id: 1,
        },
        {
            content: "Premature optimization is the root of all evil",
            author: "Donald Knuth",
            info: "http://wiki.c2.com/?PrematureOptimization",
            votes: 0,
            id: 2,
        },
    ]);

    const [notification, setNotification] = useState("");

    const addNew = (anecdote) => {
        anecdote.id = Math.round(Math.random() * 10000);
        setAnecdotes(anecdotes.concat(anecdote));
        setNotification(`A new anecdote ${anecdote.content} has been added`);
        setTimeout(() => {
            setNotification("");
        }, 5000);
        console.log("has this been added");
    };

    const anecdoteById = (id) => anecdotes.find((a) => a.id === id);

    const vote = (id) => {
        const anecdote = anecdoteById(id);

        const voted = {
            ...anecdote,
            votes: anecdote.votes + 1,
        };

        setAnecdotes(anecdotes.map((a) => (a.id === id ? voted : a)));
    };

    return (
        <div>
            <h1>Software anecdotes</h1>
            {notification && <p>{notification}</p>}
            <Menu anecdotes={anecdotes} addNew={addNew} />
            <Footer />
        </div>
    );
};

export default App;

Anecdote.propTypes = {
    anecdotes: PropTypes.array,
};

AnecdoteList.propTypes = {
    anecdotes: PropTypes.array,
};
Menu.propTypes = {
    anecdotes: PropTypes.array,
    addNew: PropTypes.func,
};
