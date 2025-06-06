import React from 'react';
import { TouchableOpacity } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useSelector } from 'react-redux';

const LikeButton = ({ isLike, handleLike, handleUnLike }) => {
  const theme = useSelector(state => state.theme);

  return (
    <TouchableOpacity onPress={isLike ? handleUnLike : handleLike}>
      <MaterialIcons
        name={isLike ? 'favorite' : 'favorite-border'}
        size={24}
        color={isLike ? 'red' : theme ? 'white' : 'black'}
        style={{ marginHorizontal: 8 }}
      />
    </TouchableOpacity>
  );
};

export default LikeButton;