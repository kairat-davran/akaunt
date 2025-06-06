import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './pages/LoginScreen';
import RegisterScreen from './pages/RegisterScreen';
import PostDetailScreen from './pages/post/PostDetailScreen';
import ConversationScreen from './pages/message/ConversationScreen';
import MainTabNavigator from './components/navigators/MainTabNavigator';
import ProfileScreen from './pages/profile/ProfileScreen';
import SocketClient from './SocketClient';

import { refreshToken } from './redux/actions/authAction';
import { getPosts } from './redux/actions/postAction';
import { getSuggestions } from './redux/actions/suggestionsAction';
import { getNotifies } from './redux/actions/notifyAction';
import { setSocket } from './redux/reducers/communicationSlice';

import io from 'socket.io-client';
import { BASE_URL } from './utils/config';
import EventDetailScreen from './pages/event/EventDetailScreen';
import BazarItemDetailScreen from './pages/bazar/BazarItemDetailScreen';
import SellerProfileScreen from './pages/bazar/SellerProfileScreen';
import MessageScreen from './pages/message/MessageScreen';

const Stack = createNativeStackNavigator();

const App = () => {
  const auth = useSelector(state => state.auth);
  const dispatch = useDispatch();

  // Setup token and socket
  useEffect(() => {
    dispatch(refreshToken());
  }, [dispatch]);

  useEffect(() => {
    if (!auth.token) return;

    const socket = io(BASE_URL.replace('/api', ''), {
      transports: ['websocket'],
    });

    dispatch(setSocket(socket));

    return () => socket.disconnect();
  }, [auth.token, dispatch]);

  // Load initial data
  useEffect(() => {
    if (auth.token) {
      dispatch(getPosts(auth.token));
      dispatch(getSuggestions(auth.token));
      dispatch(getNotifies(auth.token));
    }
  }, [auth.token, dispatch]);

  return (
    <NavigationContainer>
      {auth.token && <SocketClient />}
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {auth.token ? (
          <>
            <Stack.Screen name="Main" component={MainTabNavigator} />
            <Stack.Screen name="Conversation" component={ConversationScreen} />
            <Stack.Screen name="Messages" component={MessageScreen} />
            <Stack.Screen name="PostDetail" component={PostDetailScreen} />
            <Stack.Screen name="EventDetail" component={EventDetailScreen} />
            <Stack.Screen name="BazarItemDetail" component={BazarItemDetailScreen} />
            <Stack.Screen name="SellerProfile" component={SellerProfileScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;