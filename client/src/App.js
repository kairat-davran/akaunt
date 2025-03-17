import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import Login from './pages/login';

import Alert from './components/alert/Alert';

import { useSelector, useDispatch } from 'react-redux';
import Home from './pages/home';
import { useEffect } from 'react';
import { refreshToken } from './redux/actions/authAction';
import PageRender from './customRouter/PageRender';
import Register from './pages/register';
import PrivateRouter from './customRouter/PrivateRouter';
import Header from './components/header/Header';
import StatusModal from './components/StatusModal';
import { getPosts } from './redux/actions/postAction';

import SocketClient from './SocketClient';
import { setPeer, setSocket } from './redux/reducers/communicationSlice';
import io from "socket.io-client";
import { getSuggestions } from './redux/actions/suggestionsAction';
import { getNotifies } from './redux/actions/notifyAction';
import CallModal from './components/message/CallModal';
import Peer from 'peerjs'

function App() {
    const auth = useSelector(state => state.auth)
    const status = useSelector(state => state.status)
    const modal = useSelector(state => state.modal)
    const call = useSelector(state => state.call)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(refreshToken())

        const socket = io('http://localhost:5000');
        dispatch(setSocket(socket)); // Store the socket instance in Redux

        return () => {
            socket.disconnect(); // Clean up on component unmount
        };
    }, [dispatch])

    useEffect(() => {
        if(auth.token) {
            dispatch(getPosts(auth.token))
            dispatch(getSuggestions(auth.token))
            dispatch(getNotifies(auth.token))
        }
    }, [dispatch, auth.token])

    useEffect(() => {
        if (!("Notification" in window)) {
            alert("This browser does not support desktop notification");
        }
        else if (Notification.permission === "granted") {}
        else if (Notification.permission !== "denied") {
            Notification.requestPermission().then(function (permission) {
                if (permission === "granted") {}
            });
        }
    },[])

    useEffect(() => {
        const newPeer = new Peer(undefined, {
            path: '/', secure: true
        })

        dispatch(setPeer(newPeer))
        
    },[dispatch])

    return (
        <Router>
            <Alert />

            <input type="checkbox" id="theme" />
            <div className={`App ${(status || modal) && 'mode'}`}>
                <div className="main">
                    {auth.token && <Header />}
                    {status && <StatusModal />}
                    {auth.token && <SocketClient />}
                    {call && <CallModal />}

                    <Routes>
                        <Route path="/" element={auth.token ? <Home /> : <Login />} />
                        <Route path="/register" element={<Register />} />

                        <Route path="/:page" element={<PrivateRouter><PageRender /></PrivateRouter>} />
                        <Route path="/:page/:id" element={<PrivateRouter><PageRender /></PrivateRouter>} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default App;
