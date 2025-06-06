import React from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Share,
  Platform,
} from 'react-native';

const ShareModal = ({ url, theme, visible, onClose }) => {
  const handleShare = async () => {
    try {
      await Share.share({
        message: url,
        title: 'Check this out!',
        url,
      });
    } catch (error) {
      console.log('Error sharing', error.message);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={[styles.modalContent, theme && styles.darkTheme]}>
          <Text style={styles.title}>Share this post</Text>

          <TouchableOpacity style={styles.button} onPress={handleShare}>
            <Text style={styles.buttonText}>Share</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancel} onPress={onClose}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default ShareModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopRightRadius: 16,
    borderTopLeftRadius: 16,
    ...Platform.select({
      android: {
        elevation: 12,
      },
      ios: {
        boxShadow: '0 -3px 6px rgba(0,0,0,0.2)',
      },
      web: {
        boxShadow: '0 -3px 6px rgba(0,0,0,0.2)',
      },
    }),
  },
  darkTheme: {
    backgroundColor: '#222',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  cancel: {
    marginTop: 15,
    alignItems: 'center',
  },
  cancelText: {
    color: 'gray',
  },
});