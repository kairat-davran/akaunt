import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Platform,
  Image,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useDispatch, useSelector } from 'react-redux';
import { createItem } from '../../redux/actions/bazarAction';

const BazarModal = ({ visible, onClose }) => {
  const dispatch = useDispatch();
  const auth = useSelector(state => state.auth);

  const [form, setForm] = useState({
    title: '',
    price: '',
    location: '',
    category: '',
    description: '',
    images: [],
  });

  const handlePickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permission.status !== 'granted') {
      alert('Permission required to access media library.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });
    if (!result.canceled) {
      const selected = result.assets[0];
      setForm(prev => ({ ...prev, images: [...prev.images, selected] }));
    }
  };

  const handleSubmit = () => {
    const { title, price, location } = form;
    if (!title || !price || !location) {
      alert('Please fill in all required fields.');
      return;
    }
    dispatch(createItem({ data: form, auth }));
    onClose();
    setForm({ title: '', price: '', location: '', category: '', description: '', images: [] });
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>New Marketplace Item</Text>
          {['title', 'price', 'location', 'category', 'description'].map((field, idx) => (
            <TextInput
              key={idx}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              style={styles.input}
              value={form[field]}
              onChangeText={text => setForm(prev => ({ ...prev, [field]: text }))}
            />
          ))}

          <TouchableOpacity style={styles.imageButton} onPress={handlePickImage}>
            <Text style={styles.imageButtonText}>Pick Image</Text>
          </TouchableOpacity>

          {form.images.map((img, idx) => (
            <Image
              key={idx}
              source={{ uri: img.uri }}
              style={styles.previewImage}
            />
          ))}

          <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
            <Text style={styles.saveButtonText}>Post</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default BazarModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#000000aa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: '90%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 14,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  imageButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  imageButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  previewImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    marginVertical: 6,
  },
  saveButton: {
    backgroundColor: '#28a745',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cancelButton: {
    marginTop: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#888',
    fontSize: 15,
  },
});