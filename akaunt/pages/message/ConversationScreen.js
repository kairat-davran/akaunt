import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Image,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useRoute, useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { GLOBALTYPES } from '../../redux/actions/globalTypes';
import {
  addMessage,
  getMessages,
  deleteConversation,
} from '../../redux/actions/messageAction';
import { imageUpload } from '../../utils/imageUpload';
import UserCard from '../../components/UserCard';
import MsgDisplay from '../../components/message/MsgDisplay';

const ConversationScreen = () => {
  const auth = useSelector(state => state.auth);
  const message = useSelector(state => state.message);
  const theme = useSelector(state => state.theme);
  const communication = useSelector(state => state.communication);

  const socket = communication.socket;
  const peer = communication.peer;

  const dispatch = useDispatch();
  const route = useRoute();
  const navigation = useNavigation();

  const id = route.params?.userId;

  const [user, setUser] = useState(null);
  const [text, setText] = useState('');
  const [media, setMedia] = useState([]);
  const [loadMedia, setLoadMedia] = useState(false);
  const [data, setData] = useState([]);
  const [result, setResult] = useState(9);
  const [page, setPage] = useState(0);

  const scrollViewRef = useRef();

  useEffect(() => {
    const newData = message.data.find(item => item._id === id);
    if (newData) {
      setData(newData.messages);
      setResult(newData.result);
      setPage(newData.page);
    }
  }, [message.data, id]);

  useEffect(() => {
    if (id && message.users.length > 0) {
      const newUser = message.users.find(u => u._id === id);
      if (newUser) setUser(newUser);
    }
  }, [message.users, id]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (message.data.every(item => item._id !== id)) {
        await dispatch(getMessages({ auth, id }));
      }
    };
    fetchMessages();
  }, [id, dispatch]);

  const handleMediaPick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsMultipleSelection: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      const files = result.assets.map(asset => ({
        uri: asset.uri,
        type: asset.type || 'image',
        name: asset.fileName || new Date().toISOString(),
      }));
      setMedia([...media, ...files]);
    }
  };

  const handleDeleteMedia = index => {
    const newArr = [...media];
    newArr.splice(index, 1);
    setMedia(newArr);
  };

  const handleSubmit = async () => {
    if (!text.trim() && media.length === 0) return;
    setText('');
    setLoadMedia(true);

    let newMedia = [];
    if (media.length > 0) {
      newMedia = await imageUpload(media);
    }

    const msg = {
      sender: auth.user._id,
      recipient: id,
      text,
      media: newMedia,
      createdAt: new Date().toISOString(),
    };

    setMedia([]);
    setLoadMedia(false);
    dispatch(addMessage({ msg, auth, socket }));
  };

  const handleDeleteConversation = () => {
    Alert.alert(
      'Delete Conversation',
      'Are you sure you want to delete this conversation?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          onPress: () => {
            dispatch(deleteConversation({ auth, id }));
            navigation.navigate('Main', { screen: 'Messages' });
          },
          style: 'destructive',
        },
      ]
    );
  };

  const initiateCall = (video = false) => {
    const contact = user;
    const me = auth.user;

    const payload = {
      sender: me._id,
      recipient: contact._id,
      avatar: me.avatar,
      username: me.username,
      fullname: me.fullname,
      video,
    };

    if (peer?.open) payload.peerId = peer._id;
    dispatch({ type: GLOBALTYPES.CALL, payload });
    socket.emit('callUser', payload);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      {user && (
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <MaterialIcons name="arrow-back" size={24} color="#007AFF" />
            </TouchableOpacity>
            <UserCard user={user} />
          </View>

          <View style={styles.callButtons}>
            <TouchableOpacity onPress={() => initiateCall(false)}>
              <MaterialIcons name="call" size={22} color="green" style={styles.callIcon} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => initiateCall(true)}>
              <MaterialIcons name="videocam" size={22} color="green" style={styles.callIcon} />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDeleteConversation}>
              <MaterialIcons name="delete" size={22} color="crimson" style={styles.deleteIcon} />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Messages */}
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.messageList}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        {data.map((msg, idx) => (
          <View
            key={idx}
            style={msg.sender === auth.user._id ? styles.msgYou : styles.msgOther}
          >
            <MsgDisplay
              user={msg.sender === auth.user._id ? auth.user : user}
              msg={msg}
              theme={theme}
            />
          </View>
        ))}
        {loadMedia && <ActivityIndicator size="small" color="#888" />}
      </ScrollView>

      {/* Media Preview */}
      {media.length > 0 && (
        <ScrollView horizontal style={styles.mediaPreview}>
          {media.map((item, index) => (
            <View key={index} style={styles.mediaItem}>
              <Image source={{ uri: item.uri }} style={styles.mediaImage} />
              <TouchableOpacity
                onPress={() => handleDeleteMedia(index)}
                style={styles.removeBtn}
              >
                <MaterialIcons name="close" size={16} color="#fff" />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}

      {/* Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={[
            styles.textInput,
            theme ? { backgroundColor: '#111', color: '#fff' } : {},
          ]}
          placeholder="Enter your message..."
          placeholderTextColor={theme ? '#aaa' : '#666'}
          value={text}
          onChangeText={setText}
        />
        <TouchableOpacity onPress={handleMediaPick}>
          <MaterialIcons name="photo-library" size={22} color="#007AFF" style={styles.iconBtn} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSubmit} disabled={!text && media.length === 0}>
          <MaterialIcons
            name="send"
            size={22}
            color={text || media.length ? '#007AFF' : '#ccc'}
            style={styles.iconBtn}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ConversationScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 5, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  callButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  callIcon: {
    marginHorizontal: 8,
  },
  deleteIcon: {
    marginHorizontal: 8,
  },
  messageList: {
    padding: 10,
    paddingBottom: 80,
  },
  msgYou: {
    alignSelf: 'flex-end',
    marginBottom: 10,
  },
  msgOther: {
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#ccc',
    padding: 5,
    paddingHorizontal: 10,
    backgroundColor: '#fafafa',
  },
  textInput: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#f1f1f1',
    marginRight: 8,
  },
  iconBtn: {
    marginHorizontal: 6,
  },
  mediaPreview: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#f9f9f9',
  },
  mediaItem: {
    position: 'relative',
    marginRight: 10,
  },
  mediaImage: {
    width: 60,
    height: 60,
    borderRadius: 6,
  },
  removeBtn: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#000',
    borderRadius: 10,
    padding: 2,
  },
});