import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

export default function JobPage() {
    const jobsResults = useSelector(
        (state) => state && state.jobsResultsObject
    );
    const [title, setTitle] = useState("");
    const [company, setCompany] = useState("");
    const [description, setDescription] = useState({ __html: "" });
    let jobId, jobObj;

    useEffect(() => {
        jobId = window.location.pathname.slice(5);
        console.log("jobsResults[1]: ", jobsResults[1]);
        jobObj = jobsResults[1].filter((jobObject) => jobObject.id == jobId)[0];
        setDescription({
            __html: jobObj.description,
        });
        setTitle(jobObj.title);
        setCompany(jobObj.company);
    }, [jobsResults]);

    return (
        <div>
            <h1>job page</h1>
            <h3>{title}</h3>
            <h4>{company}</h4>
            <div dangerouslySetInnerHTML={description} />
        </div>
    );
}
