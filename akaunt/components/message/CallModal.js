import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Modal, Alert,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RTCView, mediaDevices } from 'react-native-webrtc';
import { Audio } from 'expo-audio';

import Avatar from '../Avatar';
import { GLOBALTYPES } from '../../redux/actions/globalTypes';
import { addMessage } from '../../redux/actions/messageAction';

const CallModal = () => {
  const call = useSelector(state => state.call);
  const auth = useSelector(state => state.auth);
  const peer = useSelector(state => state.communication.peer);
  const socket = useSelector(state => state.communication.socket);
  const theme = useSelector(state => state.theme);
  const dispatch = useDispatch();

  const [hours, setHours] = useState(0);
  const [mins, setMins] = useState(0);
  const [second, setSecond] = useState(0);
  const [total, setTotal] = useState(0);
  const [answer, setAnswer] = useState(false);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [newCall, setNewCall] = useState(null);
  const soundRef = useRef(null);

  // Timer
  useEffect(() => {
    let interval;
    if (answer) {
      interval = setInterval(() => setTotal(prev => prev + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [answer]);

  useEffect(() => {
    setSecond(total % 60);
    setMins(Math.floor(total / 60));
    setHours(Math.floor(total / 3600));
  }, [total]);

  const addCallMessage = useCallback((call, times, disconnect) => {
    if (call.recipient !== auth.user._id || disconnect) {
      const msg = {
        sender: call.sender,
        recipient: call.recipient,
        text: '',
        media: [],
        call: { video: call.video, times },
        createdAt: new Date().toISOString(),
      };
      dispatch(addMessage({ msg, auth, socket }));
    }
  }, [auth, dispatch, socket]);

  const handleEndCall = () => {
    localStream?.getTracks().forEach(track => track.stop());
    remoteStream?.getTracks?.().forEach(track => track.stop());
    if (newCall) newCall.close();

    const times = answer ? total : 0;
    socket.emit('endCall', { ...call, times });
    addCallMessage(call, times);
    dispatch({ type: GLOBALTYPES.CALL, payload: null });
  };

  const handleAnswer = async () => {
    try {
      const stream = await mediaDevices.getUserMedia({ audio: true, video: call.video });
      setLocalStream(stream);

      const callAnswer = peer.call(call.peerId, stream);
      callAnswer.on('stream', remote => setRemoteStream(remote));
      setAnswer(true);
      setNewCall(callAnswer);
    } catch (err) {
      Alert.alert("Error", "Could not access microphone/camera");
    }
  };

  useEffect(() => {
    peer.on('call', incomingCall => {
      mediaDevices.getUserMedia({ audio: true, video: call.video }).then(stream => {
        setLocalStream(stream);
        incomingCall.answer(stream);
        incomingCall.on('stream', remote => setRemoteStream(remote));
        setAnswer(true);
        setNewCall(incomingCall);
      });
    });
    return () => peer.removeListener('call');
  }, [peer, call.video]);

  useEffect(() => {
    socket.on('endCallToClient', data => {
      localStream?.getTracks().forEach(track => track.stop());
      remoteStream?.getTracks?.().forEach(track => track.stop());
      if (newCall) newCall.close();
      addCallMessage(data, data.times);
      dispatch({ type: GLOBALTYPES.CALL, payload: null });
    });
    return () => socket.off('endCallToClient');
  }, [socket, localStream, remoteStream, newCall, addCallMessage]);

  useEffect(() => {
    const initAudio = async () => {
      const { sound } = await Audio.Sound.createAsync(require('../../assets/audio/ringring.mp3'));
      soundRef.current = sound;
      if (!answer) await sound.playAsync();
    };
    initAudio();

    return () => {
      soundRef.current?.unloadAsync();
    };
  }, [answer]);

  if (!call) return null;

  return (
    <Modal visible transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Avatar src={call.avatar} size="super-avatar" />
          <Text style={styles.name}>{call.username}</Text>
          <Text style={styles.subtext}>{call.fullname}</Text>

          <Text style={styles.status}>
            {answer
              ? `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${second.toString().padStart(2, '0')}`
              : call.video ? 'calling video...' : 'calling audio...'}
          </Text>

          <View style={styles.buttonRow}>
            <TouchableOpacity onPress={handleEndCall} style={styles.endCall}>
              <Text style={styles.icon}>✖️</Text>
            </TouchableOpacity>

            {call.recipient === auth.user._id && !answer && (
              <TouchableOpacity onPress={handleAnswer} style={styles.answerCall}>
                <Text style={styles.icon}>{call.video ? '📹' : '📞'}</Text>
              </TouchableOpacity>
            )}
          </View>

          {answer && call.video && (
            <View style={styles.videoContainer}>
              {localStream && (
                <RTCView
                  streamURL={localStream.toURL()}
                  style={styles.video}
                  mirror
                />
              )}
              {remoteStream && (
                <RTCView
                  streamURL={remoteStream.toURL()}
                  style={styles.video}
                />
              )}
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default CallModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#0009',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 8,
  },
  subtext: {
    fontSize: 16,
    color: '#666',
  },
  status: {
    fontSize: 16,
    marginTop: 12,
    color: '#007AFF',
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 20,
    gap: 20,
  },
  endCall: {
    backgroundColor: 'crimson',
    borderRadius: 30,
    padding: 12,
  },
  answerCall: {
    backgroundColor: 'green',
    borderRadius: 30,
    padding: 12,
  },
  icon: {
    fontSize: 22,
    color: '#fff',
  },
  videoContainer: {
    flexDirection: 'row',
    marginTop: 20,
    width: '100%',
    justifyContent: 'space-around',
  },
  video: {
    width: 140,
    height: 180,
    backgroundColor: '#000',
  },
});