import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import CommentDisplay from './comments/CommentDisplay'; // should also be RN-compatible

const Comments = ({ post }) => {
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState([]);
  const [next, setNext] = useState(2);
  const [replyComments, setReplyComments] = useState([]);

  useEffect(() => {
    const newCm = post.comments.filter(cm => !cm.reply);
    setComments(newCm);
    setShowComments(newCm.slice(newCm.length - next));
  }, [post.comments, next]);

  useEffect(() => {
    const newRep = post.comments.filter(cm => cm.reply);
    setReplyComments(newRep);
  }, [post.comments]);

  return (
    <View>
      {showComments.map((comment, index) => (
        <CommentDisplay
          key={index}
          comment={comment}
          post={post}
          replyCm={replyComments.filter(item => item.reply === comment._id)}
        />
      ))}

      {comments.length - next > 0 ? (
        <TouchableOpacity style={styles.toggle} onPress={() => setNext(next + 10)}>
          <Text style={styles.toggleText}>See more comments...</Text>
        </TouchableOpacity>
      ) : comments.length > 2 ? (
        <TouchableOpacity style={styles.toggle} onPress={() => setNext(2)}>
          <Text style={styles.toggleText}>Hide comments...</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

export default Comments;

const styles = StyleSheet.create({
  toggle: {
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    marginTop: 10,
  },
  toggleText: {
    color: 'crimson',
    textAlign: 'center',
  },
});