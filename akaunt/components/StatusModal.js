import React, { useState, useEffect } from 'react';
import {
  Modal, View, Text, TextInput, TouchableOpacity,
  StyleSheet, Image, ScrollView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useDispatch, useSelector } from 'react-redux';

import { GLOBALTYPES } from '../redux/actions/globalTypes';
import { createPost, updatePost } from '../redux/actions/postAction';

const StatusModal = () => {
  const auth = useSelector(state => state.auth);
  const status = useSelector(state => state.status);
  const socket = useSelector(state => state.communication.socket);
  const dispatch = useDispatch();

  const [content, setContent] = useState('');
  const [images, setImages] = useState([]);

  useEffect(() => {
    if (status.onEdit) {
      setContent(status.content);
      setImages(status.images);
    }
  }, [status]);

  const handleClose = () => {
    setContent('');
    setImages([]);
    dispatch({ type: GLOBALTYPES.STATUS, payload: false });
  };

  const handlePickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permission.status !== 'granted') {
      alert('Permission denied.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      base64: false,
      quality: 1,
    });

    if (!result.canceled) {
      setImages(prev => [...prev, ...result.assets]);
    }
  };

  const handleSubmit = () => {
    if (images.length === 0) {
      return dispatch({ type: GLOBALTYPES.ALERT, payload: { error: 'Please add a photo.' } });
    }

    if (status.onEdit) {
      dispatch(updatePost({ content, images, auth, status }));
    } else {
      dispatch(createPost({ content, images, auth, socket }));
    }

    handleClose();
  };

  const handleRemoveImage = (index) => {
    const newArr = [...images];
    newArr.splice(index, 1);
    setImages(newArr);
  };

  return (
    <Modal visible={status} animationType="fade" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Create Post</Text>
            <TouchableOpacity onPress={handleClose}>
              <Text style={styles.close}>×</Text>
            </TouchableOpacity>
          </View>

          <TextInput
            style={styles.input}
            placeholder={`${auth.user.username}, what are you thinking?`}
            value={content}
            onChangeText={setContent}
            multiline
          />

          <ScrollView horizontal>
            {images.map((img, index) => (
              <View key={index} style={styles.imageWrapper}>
                <Image source={{ uri: img.uri || img.url }} style={styles.preview} />
                <TouchableOpacity onPress={() => handleRemoveImage(index)} style={styles.remove}>
                  <Text style={styles.removeText}>×</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity onPress={handlePickImage} style={styles.iconBtn}>
              <Text>📷</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSubmit} style={styles.submitBtn}>
              <Text style={styles.submitText}>Post</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default StatusModal;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: '#0008',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '95%',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  close: {
    fontSize: 26,
    color: 'crimson',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  imageWrapper: {
    position: 'relative',
    marginRight: 10,
  },
  preview: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginTop: 10,
  },
  remove: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: 'crimson',
    borderRadius: 12,
    padding: 2,
  },
  removeText: {
    color: '#fff',
    fontSize: 14,
  },
  footer: {
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconBtn: {
    fontSize: 24,
  },
  submitBtn: {
    backgroundColor: '#000',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 6,
  },
  submitText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});