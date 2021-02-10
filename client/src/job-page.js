import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

import axios from "./axios";

import {
    CircularProgress,
    Typography,
    Button,
    Card,
    CardActions,
    CardContent,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
    root: {
        minWidth: 275,
    },
    bullet: {
        display: "inline-block",
        margin: "0 2px",
        transform: "scale(0.8)",
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
    },
});

export default function JobPage() {
    const classes = useStyles();

    const jobsResults = useSelector(
        (state) => state && state.jobsResultsObject
    );
    const currentPage = useSelector((state) => state && state.currentPage);
    const [title, setTitle] = useState("");
    const [company, setCompany] = useState("");
    const [link, setLink] = useState("");
    const [description, setDescription] = useState({ __html: "" });
    let jobId, jobObj;

    const [showProgressSpinner, setShowProgressSpinner] = useState(true);
    const [score, setScore] = useState("");
    const [showScoreSpinner, setShowScoreSpinner] = useState(true);

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
        setLink(jobObj.link);
        setShowProgressSpinner(!jobObj.description);
        axios
            .get(`/get-company-score/${company}`)
            .then(({ data }) => {
                if (data.score) {
                    setScore(data.score);
                    setShowScoreSpinner(!data.score);
                } else if (data.score === false) {
                    setScore("no result");
                    setShowScoreSpinner(false);
                }
            })
            .catch((err) => {
                console.error(
                    `error on axios.get(/get-company-score/${company}): `,
                    err
                );
            });
    }, [jobsResults]);

    return (
        <div>
            <Card id="job-card" className={classes.root}>
                <CardContent>
                    <Typography variant="h5" component="h2">
                        {title}
                    </Typography>
                    <Typography className={classes.pos} color="textSecondary">
                        {company}
                        <br />
                        GlassDoor score:
                        {showScoreSpinner && <CircularProgress />} {score}
                    </Typography>
                    <Typography variant="body2" component="p">
                        {showProgressSpinner && <CircularProgress />}
                        <div dangerouslySetInnerHTML={description} />
                    </Typography>
                </CardContent>
                <CardActions>
                    <a className="learn-more-btn" href={link}>
                        <Button size="small">Learn More</Button>
                    </a>
                </CardActions>
            </Card>
        </div>
    );
}
