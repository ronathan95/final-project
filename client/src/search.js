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

import {
    CircularProgress,
    Typography,
    Input,
    Button,
    Icon,
    Paper,
} from "@material-ui/core";

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
                console.log("data.jobs: ", data.jobs);
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
        <div className="search">
            <Typography variant="h3">Search</Typography>

            <Input
                className="input"
                onChange={handleUserInputJob}
                type="text"
                placeholder="enter a job name"
            />
            <Input
                className="input"
                onChange={handleUserInputCity}
                type="text"
                placeholder="enter a city"
            />

            <Button
                onClick={handleSearch}
                variant="contained"
                color="primary"
                endIcon={<Icon>send</Icon>}
            >
                Search
            </Button>

            <br />

            {showProgressSpinner && <CircularProgress />}
            {jobResults &&
                jobResults[currentPage] &&
                jobResults[currentPage].map((job) => (
                    <Paper className="paper" key={job.id}>
                        <Link
                            onClick={() => getJobDescription(job.id, job.link)}
                            to={"/job/" + job.id}
                        >
                            <Typography variant="h6">{job.title}</Typography>
                        </Link>
                        <Typography variant="subtitle1">
                            {job.company}
                        </Typography>
                    </Paper>
                ))}
            {currentPage != numOfPages && numOfPages != 0 && (
                <Button
                    className="btn"
                    variant="contained"
                    color="primary"
                    onClick={() => {
                        dispatch(increaseCurrentPage());
                    }}
                >
                    next
                </Button>
            )}
            {currentPage != 1 && (
                <Button
                    className="btn"
                    variant="contained"
                    color="primary"
                    onClick={() => {
                        dispatch(decreaseCurrentPage());
                    }}
                >
                    previous
                </Button>
            )}
        </div>
    );
}
