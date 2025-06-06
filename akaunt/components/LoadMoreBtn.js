import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

const LoadMoreBtn = ({ result, page, load, handleLoadMore }) => {
  // If no more posts to load, hide the button
  if (result < 9 * (page - 1)) return null;

  return (
    <View style={styles.wrapper}>
      {load ? (
        <ActivityIndicator size="small" color="crimson" />
      ) : (
        <TouchableOpacity style={styles.btn} onPress={handleLoadMore}>
          <Text style={styles.btnText}>Load more</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default LoadMoreBtn;

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: 20,
    alignItems: 'center',
  },
  btn: {
    backgroundColor: '#000',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 6,
  },
  btnText: {
    color: '#fff',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    fontSize: 14,
  },
});