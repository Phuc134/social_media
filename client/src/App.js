import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Profile from "./pages/profile/Profile";
import Register from "./pages/register/Register";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect,
} from "react-router-dom";
import { useContext, useEffect } from "react";
import { AuthContext } from "./context/AuthContext";
import Messenger from "./pages/messenger/Messenger";
import UpdateProfile from "./pages/updateProfile/UpdateProfile";
import SearchFriend from "./pages/searchFriend/SearchFriend";
import InviteFriend from "./pages/inviteFriend/InviteFriend";
import { getSocketInstance } from "./connectSocket";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';


function App() {
    const { user } = useContext(AuthContext);

    return (
        <>            <Router>
            <Switch>
                <Route exact path="/">
                    {user ? <Home /> : <Login />}
                </Route>
                <Route path="/login">{user ? <Redirect to="/" /> : <Login />}</Route>
                <Route path="/register">
                    {user ? <Redirect to="/" /> : <Register />}
                </Route>
                <Route path="/messenger">
                    {!user ? <Redirect to='/' /> : <Messenger />}
                </Route>
                <Route path="/profile/:username">
                    <Profile />
                </Route>
                <Route path="/update-user">
                    <UpdateProfile />
                </Route>
                <Route path="/search">
                    <SearchFriend />
                </Route>
                <Route path="/invite-friend">
                    <InviteFriend />
                </Route>
            </Switch>
        </Router>
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
            />
            {/* Same as */}
        </>

    );
}

export default App;
