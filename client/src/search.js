import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getJobDescription } from "../../puppeteer-jobs-search";
import {
    updateUserInputJob,
    updateUserInputCity,
    updateJobResults,
} from "./actions";
import axios from "./axios";

export default function Search() {
    const dispatch = useDispatch();
    const userInputJob = useSelector((state) => state && state.userInputJob);
    const userInputCity = useSelector((state) => state && state.userInputCity);
    const jobResults = useSelector((state) => state && state.jobsResultsArray);

    // useEffect(() => {
    //     console.log(jobResults);
    // }, [jobResults]);

    const handleUserInputJob = (e) => {
        dispatch(updateUserInputJob(e.target.value));
    };
    const handleUserInputCity = (e) => {
        dispatch(updateUserInputCity(e.target.value));
    };

    const handleSearch = () => {
        axios
            .post("/indeed-search", { userInputJob, userInputCity })
            .then(({ data }) => {
                dispatch(updateJobResults(data.jobs));
            })
            .catch((err) => {
                console.error("error on axios.post(/indeed-search): ", err);
            });
    };

    const getJobDescription = (link) => {
        axios
            .get(`/get-job-description/${link}`)
            .then(() => {
                console.log("done");
            })
            .catch((err) => {
                console.error(
                    `error on axios.get(/get-job-description/${link}): `,
                    err
                );
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
            {jobResults &&
                jobResults.map((job) => (
                    <div key={job.id}>
                        <p onClick={() => getJobDescription(job.link)}>
                            {job.title}
                        </p>
                    </div>
                ))}
        </div>
    );
}
