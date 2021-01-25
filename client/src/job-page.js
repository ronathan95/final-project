import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

export default function JobPage() {
    const jobsResults = useSelector((state) => state && state.jobsResultsArray);
    const [title, setTitle] = useState("");
    const [company, setCompany] = useState("");
    const [description, setDescription] = useState({ __html: "" });
    let jobId, jobObj, jobDescription, jobtitle, jobCompany;

    useEffect(() => {
        jobId = window.location.pathname.slice(5);
        jobObj = jobsResults.filter((jobObject) => jobObject.id == jobId);
        jobDescription = jobObj[0].description;
        jobtitle = jobObj[0].title;
        jobCompany = jobObj[0].company;
        setDescription({
            __html: jobDescription,
        });
        setTitle(jobtitle);
        setCompany(jobCompany);
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
