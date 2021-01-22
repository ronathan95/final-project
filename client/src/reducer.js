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

    return state;
}
