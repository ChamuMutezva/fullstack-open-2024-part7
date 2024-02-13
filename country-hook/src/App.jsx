import React, { useState, useEffect } from "react";
import { useCountry, useField } from "./hooks";

/*
const useField = (type) => {
    const [value, setValue] = useState("");

    const onChange = (event) => {
        setValue(event.target.value);
    };

    return {
        type,
        value,
        onChange,
    };
};
*/
/*
const useCountry = (name) => {
    const [country, setCountry] = useState(null);

    useEffect(() => {
        axios
            .get(
                `https://studies.cs.helsinki.fi/restcountries/api/name/${name}`
            )
            .then((response) => {
                setCountry(response.data);
            }).catch(error => {
                console.log(error.message)
            });
    }, [name]);

    return country;
};
*/
const Country = ({ country }) => {
    console.log(country);
    console.log(country?.name.common);

    if (!country) {
        return null;
    }

    if (typeof country === "undefined" || country.name.common === null) {
        return <div>not found...</div>;
    }

    return (
        <div>
            <h3>{country.name?.common} </h3>
            <div>capital {country.capital[0]} </div>
            <div>population {country?.population}</div>
            <img
                src={country?.flags.png}
                height="100"
                alt={country.flags.alt}
            />
        </div>
    );
};

const App = () => {
    const nameInput = useField("text");
    const [name, setName] = useState("nepal");
    const country = useCountry(name);

    const fetch = (e) => {
        e.preventDefault();
        setName(() => nameInput.value);
    };

    return (
        <div>
            <form onSubmit={fetch}>
                <input {...nameInput} />
                <button>find</button>
            </form>

            <Country country={country} />
        </div>
    );
};

export default App;
