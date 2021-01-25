import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

export default function JobPage() {
    const jobsResults = useSelector((state) => state && state.jobsResultsArray);
    const [description, setDescription] = useState("");
    let jobId, jobDescription;

    useEffect(() => {
        jobId = window.location.pathname.slice(5);
        jobDescription = jobsResults.filter(
            (jobObject) => jobObject.id == jobId
        )[0].jobDescription;
        console.log("jobDescription: ", jobDescription);
        setDescription(jobDescription);
    }, [jobsResults, jobDescription]);

    return (
        <div>
            <h1>job page</h1>
            {description && <p>{description}</p>}
        </div>
    );
}
