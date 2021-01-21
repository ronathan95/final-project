export default function Search() {
    let userInputJob = "";
    let userInputCity = "";

    const handleUserInputJob = (e) => {
        userInputJob = e.target.value;
    };
    const handleUserInputCity = (e) => {
        userInputCity = e.target.value;
    };

    const handleSearch = () => {
        console.log("userInputJob: ", userInputJob);
        console.log("userInputCity: ", userInputCity);
    };

    return (
        <div>
            <h1>Search page</h1>
            <input
                onChange={handleUserInputJob}
                type="text"
                placeholder="enter a job name"
            />
            <input
                onChange={handleUserInputCity}
                type="text"
                placeholder="enter a city"
            />
            <button onClick={handleSearch}>Search</button>
        </div>
    );
}
