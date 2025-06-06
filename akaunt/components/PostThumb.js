import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const PostThumb = ({ posts, result }) => {
  const theme = useSelector((state) => state.theme);
  const navigation = useNavigation();

  if (result === 0) {
    return <Text style={styles.noPost}>No Post</Text>;
  }

  return (
    <View style={styles.thumbContainer}>
      {posts.map((post) => (
        <PostThumbItem
          key={post._id}
          post={post}
          theme={theme}
          navigation={navigation}
        />
      ))}
    </View>
  );
};

const PostThumbItem = ({ post, theme, navigation }) => {
  const url = post.images[0]?.url;

  if (!url || url.match(/\.(mp4|webm|ogg)$/i)) return null; // skip videos

  return (
    <TouchableOpacity
      style={styles.postItem}
      onPress={() => navigation.navigate('PostDetail', { postId: post._id })}
    >
      <Image
        source={{ uri: url }}
        style={[styles.media, theme && styles.invert]}
        resizeMode="cover"
      />
      <View style={styles.overlay}>
        <View style={styles.iconRow}>
          <MaterialIcons name="favorite" size={16} color="white" />
          <Text style={styles.iconText}>{post.likes.length}</Text>
        </View>
        <View style={styles.iconRow}>
          <MaterialIcons name="chat-bubble-outline" size={16} color="white" />
          <Text style={styles.iconText}>{post.comments.length}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default PostThumb;

const styles = StyleSheet.create({
  noPost: {
    textAlign: 'center',
    color: 'crimson',
    fontSize: 18,
    marginVertical: 20,
  },
  thumbContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  postItem: {
    width: '48%',
    marginBottom: 10,
    position: 'relative',
    aspectRatio: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  media: {
    width: '100%',
    height: '100%',
  },
  invert: {
    tintColor: 'white',
  },
  overlay: {
    position: 'absolute',
    bottom: 5,
    left: 5,
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.35)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 5,
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  iconText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
});