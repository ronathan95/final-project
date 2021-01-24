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

export async function updateJobResults(jobsResultsArray) {
    return {
        type: "UPDATE_JOBS_RESULTS",
        jobsResultsArray: jobsResultsArray,
    };
}
