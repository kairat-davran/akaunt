import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';

import Avatar from '../../Avatar';
import LikeButton from '../../LikeButton';
import CommentMenu from './CommentMenu';
import InputComment from '../InputComment';
import {
  likeComment,
  unLikeComment,
  updateComment,
} from '../../../redux/actions/commentAction';

const CommentCard = ({ children, comment, post, commentId }) => {
  const auth = useSelector((state) => state.auth);
  const theme = useSelector((state) => state.theme);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const [content, setContent] = useState('');
  const [readMore, setReadMore] = useState(false);
  const [onEdit, setOnEdit] = useState(false);
  const [isLike, setIsLike] = useState(false);
  const [loadLike, setLoadLike] = useState(false);
  const [onReply, setOnReply] = useState(false);

  useEffect(() => {
    setContent(comment.content);
    setIsLike(comment.likes.some((like) => like._id === auth.user._id));
    setOnReply(false);
  }, [comment, auth.user._id]);

  const handleUpdate = () => {
    if (comment.content !== content) {
      dispatch(updateComment({ comment, post, content, auth }));
    }
    setOnEdit(false);
  };

  const handleLike = async () => {
    if (loadLike) return;
    setIsLike(true);
    setLoadLike(true);
    await dispatch(likeComment({ comment, post, auth }));
    setLoadLike(false);
  };

  const handleUnLike = async () => {
    if (loadLike) return;
    setIsLike(false);
    setLoadLike(true);
    await dispatch(unLikeComment({ comment, post, auth }));
    setLoadLike(false);
  };

  const handleReply = () => {
    if (onReply) return setOnReply(false);
    setOnReply({ ...comment, commentId });
  };

  const handleNavigate = (id) => {
    navigation.navigate('Profile', { userId: id });
  };

  return (
    <View style={[styles.card, !comment._id && styles.disabled]}>
      <TouchableOpacity
        style={styles.userRow}
        onPress={() => handleNavigate(comment.user._id)}
      >
        <Avatar src={comment.user.avatar} size="small-avatar" />
        <Text style={styles.username}>{comment.user.username}</Text>
      </TouchableOpacity>

      <View style={styles.commentContentRow}>
        <View style={[styles.textBlock, theme && styles.darkTheme]}>
          {onEdit ? (
            <TextInput
              multiline
              value={content}
              onChangeText={setContent}
              style={styles.textarea}
            />
          ) : (
            <Text style={styles.commentText}>
              {comment.tag && comment.tag._id !== comment.user._id && (
                <Text
                  style={styles.tag}
                  onPress={() => handleNavigate(comment.tag._id)}
                >
                  @{comment.tag.username}{' '}
                </Text>
              )}
              {content.length < 100
                ? content
                : readMore
                ? content + ' '
                : content.slice(0, 100) + '....'}
              {content.length > 100 && (
                <Text
                  style={styles.readMore}
                  onPress={() => setReadMore(!readMore)}
                >
                  {readMore ? ' Hide content' : ' Read more'}
                </Text>
              )}
            </Text>
          )}

          <View style={styles.actionRow}>
            <Text style={styles.muted}>
              {moment(comment.createdAt).fromNow()}
            </Text>
            <Text style={styles.bold}>{comment.likes.length} likes</Text>

            {onEdit ? (
              <>
                <Text style={styles.bold} onPress={handleUpdate}>
                  update
                </Text>
                <Text style={styles.bold} onPress={() => setOnEdit(false)}>
                  cancel
                </Text>
              </>
            ) : (
              <Text style={styles.bold} onPress={handleReply}>
                {onReply ? 'cancel' : 'reply'}
              </Text>
            )}
          </View>
        </View>

        <View style={styles.inlineActions}>
          <CommentMenu post={post} comment={comment} setOnEdit={setOnEdit} />
          <LikeButton
            isLike={isLike}
            handleLike={handleLike}
            handleUnLike={handleUnLike}
          />
        </View>
      </View>

      {onReply && (
        <InputComment post={post} onReply={onReply} setOnReply={setOnReply}>
          <Text
            style={styles.replyTag}
            onPress={() => handleNavigate(onReply.user._id)}
          >
            @{onReply.user.username}:
          </Text>
        </InputComment>
      )}

      {children}
    </View>
  );
};

export default CommentCard;

const styles = StyleSheet.create({
  card: {
    marginTop: 8,
    paddingHorizontal: 10,
  },
  disabled: {
    opacity: 0.5,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  username: {
    marginLeft: 8,
    fontWeight: '600',
  },
  commentContentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 5,
  },
  textBlock: {
    flex: 1,
    paddingRight: 10,
  },
  darkTheme: {
    color: 'white',
  },
  commentText: {
    color: '#111',
  },
  actionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 5,
  },
  muted: {
    fontSize: 12,
    color: '#888',
    marginRight: 10,
  },
  bold: {
    fontSize: 12,
    fontWeight: '600',
    marginRight: 10,
  },
  tag: {
    color: '#007AFF',
    fontWeight: '600',
  },
  readMore: {
    color: 'gray',
    fontStyle: 'italic',
  },
  textarea: {
    minHeight: 60,
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 6,
    borderRadius: 4,
  },
  inlineActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  replyTag: {
    fontWeight: '600',
    color: '#007AFF',
    marginBottom: 5,
  },
});