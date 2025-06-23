import React from 'react';
import { useLocation, Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';

import Header from '../components/header/Header';
import StatusModal from '../components/StatusModal';
import SocketClient from '../SocketClient';
import CallModal from '../components/message/CallModal';

import Home from '../pages/home';
import Login from '../pages/login';
import Register from '../pages/register';
import PageRender from '../customRouter/PageRender';
import PrivateRouter from '../customRouter/PrivateRouter';

const AppRouter = () => {
  const { pathname } = useLocation();
  const auth = useSelector(state => state.auth);
  const status = useSelector(state => state.status);
  const modal = useSelector(state => state.modal);
  const call = useSelector(state => state.call);

  const isMobileOrTablet = window.innerWidth <= 1024; // phones + tablets
  const hideHeader =
    isMobileOrTablet &&
    (pathname.startsWith('/message') || pathname.startsWith('/profile'));

  return (
    <>
      <input type="checkbox" id="theme" />
      <div className={`App ${(status || modal) && 'mode'}`}>
        <div className="main">
          {auth.token && !hideHeader && <Header />}
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
    </>
  );
};

export default AppRouter;