import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateUserInputJob, updateUserInputCity } from "./actions";
import axios from "./axios";

export default function Search() {
    const dispatch = useDispatch();
    const userInputJob = useSelector((state) => state && state.userInputJob);
    const userInputCity = useSelector((state) => state && state.userInputCity);

    // useEffect(() => {
    //     axios
    //         .get("/indeed-search")
    //         .then(({ data }) => {
    //             console.log("data.jobTitlesArray: ", data.jobTitlesArray);
    //         })
    //         .catch((err) => {
    //             console.error("error on axios.get(/indeed-search): ", err);
    //         });
    // }, []);

    const handleUserInputJob = (e) => {
        dispatch(updateUserInputJob(e.target.value));
    };
    const handleUserInputCity = (e) => {
        dispatch(updateUserInputCity(e.target.value));
    };

    const handleSearch = () => {
        axios
            .post("/indeed-search", { userInputJob, userInputCity })
            .then(() => {})
            .catch((err) => {
                console.error("error on axios.post(/indeed-search): ", err);
            });
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
