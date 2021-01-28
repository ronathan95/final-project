import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

import CircularProgress from "@material-ui/core/CircularProgress";

export default function JobPage() {
    const jobsResults = useSelector(
        (state) => state && state.jobsResultsObject
    );
    const currentPage = useSelector((state) => state && state.currentPage);
    const [title, setTitle] = useState("");
    const [company, setCompany] = useState("");
    const [description, setDescription] = useState({ __html: "" });
    let jobId, jobObj;

    const [showProgressSpinner, setShowProgressSpinner] = useState(true);

    useEffect(() => {
        jobId = window.location.pathname.slice(5);
        jobObj = jobsResults[currentPage].filter(
            (jobObject) => jobObject.id == jobId
        )[0];
        setDescription({
            __html: jobObj.description,
        });
        setTitle(jobObj.title);
        setCompany(jobObj.company);
        setShowProgressSpinner(!jobObj.description);
    }, [jobsResults]);

    return (
        <div>
            <h1>job page</h1>
            <h3>{title}</h3>
            <h4>{company}</h4>
            {showProgressSpinner && <CircularProgress />}
            <div dangerouslySetInnerHTML={description} />
        </div>
    );
}
