import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Carousel from '../../Carousel'; // Make sure this is adapted for React Native

const CardBody = ({ post, theme }) => {
  const [readMore, setReadMore] = useState(false);

  const contentColor = theme ? '#fff' : '#111';
  const contentBackground = theme ? '#222' : '#fff';

  const displayedText =
    post.content.length < 60
      ? post.content
      : readMore
      ? post.content
      : post.content.slice(0, 60) + '.....';

  return (
    <View style={styles.cardBody}>
      <View
        style={[
          styles.contentBox,
          { backgroundColor: contentBackground },
        ]}
      >
        <Text style={[styles.text, { color: contentColor }]}>
          {displayedText}
        </Text>

        {post.content.length > 60 && (
          <TouchableOpacity onPress={() => setReadMore(!readMore)}>
            <Text style={styles.readMore}>
              {readMore ? 'Hide content' : 'Read more'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {post.images.length > 0 && (
        <Carousel images={post.images} id={post._id} />
      )}
    </View>
  );
};

export default CardBody;

const styles = StyleSheet.create({
  cardBody: {
  },
  contentBox: {
    marginBottom: 10,
    padding: 5,
    borderRadius: 4,
  },
  text: {
    fontSize: 15,
    lineHeight: 20,
  },
  readMore: {
    marginTop: 5,
    color: 'crimson',
    fontWeight: '500',
  },
});
