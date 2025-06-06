import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { createComment } from '../../redux/actions/commentAction';

const InputComment = ({ children, post, onReply, setOnReply }) => {
  const [content, setContent] = useState('');
  const auth = useSelector(state => state.auth);
  const theme = useSelector(state => state.theme);
  const socket = useSelector(state => state.communication.socket);
  const dispatch = useDispatch();

  const handleSubmit = () => {
    if (!content.trim()) {
      if (setOnReply) return setOnReply(false);
      return;
    }

    const newComment = {
      content,
      likes: [],
      user: auth.user,
      createdAt: new Date().toISOString(),
      reply: onReply && onReply.commentId,
      tag: onReply && onReply.user,
    };

    dispatch(createComment({ post, newComment, auth, socket }));
    setContent('');
    if (setOnReply) return setOnReply(false);
  };

  return (
    <View style={styles.container}>
      {children}
      <TextInput
        style={[
          styles.input,
          theme && { backgroundColor: '#333', color: '#fff' }
        ]}
        placeholder="Add your comment..."
        placeholderTextColor={theme ? '#aaa' : '#555'}
        value={content}
        onChangeText={setContent}
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Post</Text>
      </TouchableOpacity>
    </View>
  );
};

export default InputComment;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#f9f9f9',
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    color: '#111',
    marginBottom: 10,
  },
  button: {
    alignSelf: 'flex-end',
    backgroundColor: '#007bff',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
  },
});