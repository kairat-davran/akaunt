import React from 'react';
import { View, StyleSheet } from 'react-native';

import CardHeader from './home/post_card/CardHeader';
import CardBody from './home/post_card/CardBody';
import CardFooter from './home/post_card/CardFooter';
import Comments from './home/Comments';
import InputComment from './home/InputComment';

const PostCard = ({ post, theme, showComments = true }) => {
  return (
    <View style={styles.card}>
      <CardHeader post={post} />
      <CardBody post={post} theme={theme} />
      <CardFooter post={post} />
      {showComments && <Comments post={post} />}
      <InputComment post={post} />
    </View>
  );
};

export default PostCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 6,
    paddingVertical: 8,
    marginVertical: 10,
    marginHorizontal: 10,
    elevation: 2, // still useful for Android
    boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1)', // Web-compatible
    },
});