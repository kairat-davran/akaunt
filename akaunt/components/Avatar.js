import React from 'react';
import { Image, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';

const Avatar = ({ src, size }) => {
  const theme = useSelector(state => state.theme);
  const sizeStyle = sizeStyles[size] || sizeStyles.default;

  return (
    <Image
      source={{ uri: src }}
      resizeMode="cover" // ✅ use here
      style={[
        styles.avatar,
        sizeStyle,
        theme ? styles.invert : null
      ]}
    />
  );
};

export default Avatar;

const styles = StyleSheet.create({
  avatar: {
    borderRadius: 50,
    // ❌ Don't use resizeMode here
  },
  invert: {
    tintColor: 'white',
  },
});

const sizeStyles = StyleSheet.create({
  default: {
    width: 40,
    height: 40,
  },
  'big-avatar': {
    width: 50,
    height: 50,
  },
  'medium-avatar': {
    width: 45,
    height: 45,
  },
  'small-avatar': {
    width: 35,
    height: 35,
  },
});