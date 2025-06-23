import {BrowserRouter as Router} from 'react-router-dom'

import Alert from './components/alert/Alert';

import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { refreshToken } from './redux/actions/authAction';
import { getPosts } from './redux/actions/postAction';

import { setPeer, setSocket } from './redux/reducers/communicationSlice';
import io from "socket.io-client";
import { getSuggestions } from './redux/actions/suggestionsAction';
import { getNotifies } from './redux/actions/notifyAction';
import Peer from 'peerjs'
import { BASE_URL } from './utils/config';

import AppRouter from './customRouter/AppRouter';

function App() {
  const auth = useSelector(state => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(refreshToken());

    const socket = io(BASE_URL);
    dispatch(setSocket(socket));
    return () => socket.disconnect();
  }, [dispatch]);

  useEffect(() => {
    if (auth.token) {
      dispatch(getPosts(auth.token));
      dispatch(getSuggestions(auth.token));
      dispatch(getNotifies(auth.token));
    }
  }, [dispatch, auth.token]);

  useEffect(() => {
    const newPeer = new Peer(undefined, { path: '/', secure: true });
    dispatch(setPeer(newPeer));
  }, [dispatch]);

  return (
    <Router>
      <Alert />
      <AppRouter />
    </Router>
  );
}

export default App;