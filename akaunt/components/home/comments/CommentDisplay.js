import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import CommentCard from './CommentCard'; // Assumes it's adapted for React Native

const CommentDisplay = ({ comment, post, replyCm }) => {
  const [showRep, setShowRep] = useState([]);
  const [next, setNext] = useState(1);

  useEffect(() => {
    setShowRep(replyCm.slice(replyCm.length - next));
  }, [replyCm, next]);

  return (
    <View style={styles.container}>
      <CommentCard comment={comment} post={post} commentId={comment._id}>
        <View style={styles.replySection}>
          {showRep.map((item, index) =>
            item.reply ? (
              <CommentCard
                key={index}
                comment={item}
                post={post}
                commentId={comment._id}
              />
            ) : null
          )}

          {replyCm.length - next > 0 ? (
            <TouchableOpacity onPress={() => setNext(next + 10)}>
              <Text style={styles.toggle}>See more comments...</Text>
            </TouchableOpacity>
          ) : replyCm.length > 1 ? (
            <TouchableOpacity onPress={() => setNext(1)}>
              <Text style={styles.toggle}>Hide comments...</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </CommentCard>
    </View>
  );
};

export default CommentDisplay;

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
  },
  replySection: {
    paddingLeft: 16,
    marginTop: 4,
  },
  toggle: {
    color: 'crimson',
    marginTop: 5,
  },
});