import { BrowserRouter, Route } from "react-router-dom";

import Search from "./search";
import JobPage from "./job-page";

export default function App() {
    return (
        <div>
            <h1>app page</h1>
            <BrowserRouter>
                <Route path="/search" render={() => <Search />} />
                <Route path="/job/:id" render={() => <JobPage />} />
            </BrowserRouter>
        </div>
    );
}
