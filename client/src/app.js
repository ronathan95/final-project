import { BrowserRouter, Route } from "react-router-dom";

import Search from "./search";

export default function App() {
    return (
        <div>
            <h1>app page</h1>
            <BrowserRouter>
                <Route path="/search" render={() => <Search />} />
            </BrowserRouter>
        </div>
    );
}
