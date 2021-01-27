export default function reducer(state = {}, action) {
    if (action.type == "UPDATE_USER_INPUT_JOB") {
        state = {
            ...state,
            userInputJob: action.userInputJob,
        };
    }

    if (action.type == "UPDATE_USER_INPUT_CITY") {
        state = {
            ...state,
            userInputCity: action.userInputCity,
        };
    }

    if (action.type == "UPDATE_JOBS_RESULTS") {
        state = {
            ...state,
            jobsResultsObject: action.jobsResultsObject,
        };
    }

    if (action.type == "UPDATE_JOB_DESCRIPTION") {
        state = {
            ...state,
            jobsResultsObject: state.jobsResultsObject[action.jobPage].map(
                (jobObject) => {
                    jobObject.id == action.jobId &&
                        (jobObject = {
                            ...jobObject,
                            description: action.jobsDescription,
                        });
                    return jobObject;
                }
            ),
        };
    }

    return state;
}
