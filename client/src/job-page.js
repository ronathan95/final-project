import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

export default function JobPage() {
    const jobsResults = useSelector((state) => state && state.jobsResultsArray);
    const [description, setDescription] = useState({ __html: "" });
    const [title, setTitle] = useState("");
    let jobId, jobObj, jobDescription, jobtitle;

    useEffect(() => {
        jobId = window.location.pathname.slice(5);
        jobObj = jobsResults.filter((jobObject) => jobObject.id == jobId);
        jobDescription = jobObj[0].description;
        jobtitle = jobObj[0].title;
        setDescription({
            __html: jobDescription,
        });
        setTitle(jobtitle);
    }, [jobsResults]);

    return (
        <div>
            <h1>job page</h1>
            <h3>{title}</h3>
            <div dangerouslySetInnerHTML={description} />
        </div>
    );
}
