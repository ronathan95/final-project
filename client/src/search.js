import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    updateUserInputJob,
    updateUserInputCity,
    updateJobResults,
    updateJobDescription,
    increaseCurrentPage,
    resetCurrentPage,
    decreaseCurrentPage,
    resetJobResults,
} from "./actions";
import axios from "./axios";

import CircularProgress from "@material-ui/core/CircularProgress";

export default function Search() {
    const dispatch = useDispatch();
    const userInputJob = useSelector((state) => state && state.userInputJob);
    const userInputCity = useSelector((state) => state && state.userInputCity);
    const jobResults = useSelector((state) => state && state.jobsResultsObject);
    const currentPage = useSelector((state) => state && state.currentPage);

    const [numOfPages, setNumOfPages] = useState(1);

    const [showProgressSpinner, setShowProgressSpinner] = useState(false);

    useEffect(() => {
        if (jobResults) {
            setNumOfPages(Object.keys(jobResults).length);
        }
    }, [jobResults]);

    const handleUserInputJob = (e) => {
        dispatch(updateUserInputJob(e.target.value));
    };
    const handleUserInputCity = (e) => {
        dispatch(updateUserInputCity(e.target.value));
    };

    const handleSearch = () => {
        dispatch(resetJobResults());
        dispatch(resetCurrentPage());
        setShowProgressSpinner(true);
        axios
            .post("/indeed-search", { userInputJob, userInputCity })
            .then(({ data }) => {
                setShowProgressSpinner(false);
                dispatch(updateJobResults(data.jobs));
            })
            .catch((err) => {
                console.error("error on axios.post(/indeed-search): ", err);
            });
    };

    const getJobDescription = (jobId, link) => {
        axios
            .get(`/get-job-description/${encodeURIComponent(link)}`)
            .then(({ data }) => {
                dispatch(
                    updateJobDescription(currentPage, jobId, data.description)
                );
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
            {showProgressSpinner && <CircularProgress />}
            {jobResults &&
                jobResults[currentPage] &&
                jobResults[currentPage].map((job) => (
                    <div key={job.id}>
                        <Link
                            onClick={() => getJobDescription(job.id, job.link)}
                            to={"/job/" + job.id}
                        >
                            {job.title} at {job.company}
                        </Link>
                    </div>
                ))}
            {currentPage != numOfPages && numOfPages != 0 && (
                <button
                    onClick={() => {
                        dispatch(increaseCurrentPage());
                    }}
                >
                    next
                </button>
            )}
            {currentPage != 1 && (
                <button
                    onClick={() => {
                        dispatch(decreaseCurrentPage());
                    }}
                >
                    previous
                </button>
            )}
        </div>
    );
}
