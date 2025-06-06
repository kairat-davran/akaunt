import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Audio } from 'expo-audio';
import { Alert, Linking } from 'react-native';

import { POST_TYPES } from './redux/actions/postAction';
import { GLOBALTYPES } from './redux/actions/globalTypes';
import { NOTIFY_TYPES } from './redux/actions/notifyAction';
import { MESS_TYPES } from './redux/actions/messageAction';

const SocketClient = () => {
  const auth = useSelector(state => state.auth);
  const socket = useSelector(state => state.communication.socket);
  const notify = useSelector(state => state.notify);
  const online = useSelector(state => state.online);
  const call = useSelector(state => state.call);
  const dispatch = useDispatch();

  let sound;

  const spawnNotification = async (msg) => {
    Alert.alert("akaunt", `${msg.user.username} ${msg.text}`, [
      { text: "Open", onPress: () => Linking.openURL(msg.url) },
      { text: "Dismiss", style: "cancel" },
    ]);

    if (notify.sound && Audio && Audio.Sound) {
      try {
        const { sound: newSound } = await Audio.Sound.createAsync(
          require('./assets/audio/got-it-done-613.mp3')
        );
        sound = newSound;
        await sound.playAsync();
      } catch (err) {
        console.error("Audio playback error:", err.message);
      }
    }
  };

  useEffect(() => {
    if (!socket || !auth.user) return;

    socket.emit('joinUser', auth.user);

    socket.on('connect_error', (err) => {
      console.error('Socket connection error:', err.message);
    });

  }, [socket, auth.user]);

  useEffect(() => {
    if (!socket) return;

    // Post events
    socket.on('likeToClient', post =>
      dispatch({ type: POST_TYPES.UPDATE_POST, payload: post })
    );
    socket.on('unLikeToClient', post =>
      dispatch({ type: POST_TYPES.UPDATE_POST, payload: post })
    );
    socket.on('createCommentToClient', post =>
      dispatch({ type: POST_TYPES.UPDATE_POST, payload: post })
    );
    socket.on('deleteCommentToClient', post =>
      dispatch({ type: POST_TYPES.UPDATE_POST, payload: post })
    );

    // Follow events
    socket.on('followToClient', newUser =>
      dispatch({ type: GLOBALTYPES.AUTH, payload: { ...auth, user: newUser } })
    );
    socket.on('unFollowToClient', newUser =>
      dispatch({ type: GLOBALTYPES.AUTH, payload: { ...auth, user: newUser } })
    );

    // Notification
    socket.on('createNotifyToClient', msg => {
      dispatch({ type: NOTIFY_TYPES.CREATE_NOTIFY, payload: msg });
      spawnNotification(msg);
    });
    socket.on('removeNotifyToClient', msg =>
      dispatch({ type: NOTIFY_TYPES.REMOVE_NOTIFY, payload: msg })
    );

    // Message
    socket.on('addMessageToClient', msg => {
      dispatch({ type: MESS_TYPES.ADD_MESSAGE, payload: msg });
      dispatch({
        type: MESS_TYPES.ADD_USER,
        payload: { ...msg.user, text: msg.text, media: msg.media },
      });
    });

    // Online/offline presence
    socket.emit('checkUserOnline', auth.user);

    socket.on('checkUserOnlineToMe', data => {
      data.forEach(user => {
        if (!online.includes(user.id)) {
          dispatch({ type: GLOBALTYPES.ONLINE, payload: user.id });
        }
      });
    });

    socket.on('checkUserOnlineToClient', id => {
      if (!online.includes(id)) {
        dispatch({ type: GLOBALTYPES.ONLINE, payload: id });
      }
    });

    socket.on('CheckUserOffline', id =>
      dispatch({ type: GLOBALTYPES.OFFLINE, payload: id })
    );

    // Call
    socket.on('callUserToClient', data =>
      dispatch({ type: GLOBALTYPES.CALL, payload: data })
    );
    socket.on('userBusy', () =>
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { error: `${call.username} is busy!` },
      })
    );

    return () => {
      socket.off();
      if (sound?.unloadAsync) sound.unloadAsync();
    };
  }, [socket, dispatch, auth, notify.sound, online, call]);

  return null;
};

export default SocketClient;