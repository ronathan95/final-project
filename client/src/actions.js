export async function updateUserInputJob(userInputJob) {
    return {
        type: "UPDATE_USER_INPUT_JOB",
        userInputJob: userInputJob,
    };
}

export async function updateUserInputCity(userInputCity) {
    return {
        type: "UPDATE_USER_INPUT_CITY",
        userInputCity: userInputCity,
    };
}

export async function updateJobResults(jobsResultsObject) {
    return {
        type: "UPDATE_JOBS_RESULTS",
        jobsResultsObject: jobsResultsObject,
    };
}

export async function updateJobDescription(jobPage, jobId, description) {
    return {
        type: "UPDATE_JOB_DESCRIPTION",
        jobPage: jobPage,
        jobId: jobId,
        jobsDescription: description,
    };
}

export async function increaseCurrentPage() {
    return {
        type: "INCREASE_CURRENT_PAGE",
    };
}

export async function resetCurrentPage() {
    return {
        type: "RESET_CURRENT_PAGE",
    };
}

export async function decreaseCurrentPage() {
    return {
        type: "DECREASE_CURRENT_PAGE",
    };
}

export async function resetJobResults() {
    return {
        type: "RESET_JOBS_RESULTS",
    };
}
