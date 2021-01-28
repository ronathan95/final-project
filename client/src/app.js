import { BrowserRouter, Route } from "react-router-dom";

import { createMuiTheme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";

import Search from "./search";
import JobPage from "./job-page";

export default function App() {
    return (
        <div>
            <AppBar className="AppBar" position="static">
                <img className="logo" src="../logo.PNG" alt="logo" />
            </AppBar>

            <BrowserRouter>
                <Route path="/search" render={() => <Search />} />
                <Route path="/job/:id" render={() => <JobPage />} />
            </BrowserRouter>
        </div>
    );
}
