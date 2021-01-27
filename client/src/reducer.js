const initialState = {
    currentPage: 1,
};

export default function reducer(state = initialState, action) {
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
        const arrayIndex = state.jobsResultsObject[action.jobPage].findIndex(
            (job) => job.id === action.jobId
        );
        const updatedArray = state.jobsResultsObject[action.jobPage].map(
            (job, idx) => {
                if (idx === arrayIndex) {
                    return {
                        ...job,
                        description: action.jobsDescription,
                    };
                } else {
                    return job;
                }
            }
        );

        state = {
            ...state,
            jobsResultsObject: {
                ...state.jobsResultsObject,
                [action.jobPage]: updatedArray,
            },
        };
    }

    if (action.type == "INCREASE_CURRENT_PAGE") {
        state = {
            ...state,
            currentPage: state.currentPage + 1,
        };
    }

    if (action.type == "RESET_CURRENT_PAGE") {
        state = {
            ...state,
            currentPage: 1,
        };
    }

    if (action.type == "DECREASE_CURRENT_PAGE") {
        state = {
            ...state,
            currentPage: state.currentPage - 1,
        };
    }

    return state;
}
