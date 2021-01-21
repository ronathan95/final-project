import { useEffect } from "react";
import axios from "./axios";

export default function Search() {
    let userInputJob = "";
    let userInputCity = "";

    useEffect(() => {
        axios
            .get("/indeed-search")
            .then(({ data }) => {
                console.log("data.jobTitlesArray: ", data.jobTitlesArray);
            })
            .catch((err) => {
                console.error("error on axios.get(/indeed-search): ", err);
            });
    }, []);

    const handleUserInputJob = (e) => {
        userInputJob = e.target.value;
    };
    const handleUserInputCity = (e) => {
        userInputCity = e.target.value;
    };

    const handleSearch = () => {
        console.log("userInputJob: ", userInputJob);
        console.log("userInputCity: ", userInputCity);
    };

    return (
        <div>
            <h1>Search page</h1>
            <input
                onChange={handleUserInputJob}
                type="text"
                placeholder="enter a job name"
            />
            <input
                onChange={handleUserInputCity}
                type="text"
                placeholder="enter a city"
            />
            <button onClick={handleSearch}>Search</button>
        </div>
    );
}
