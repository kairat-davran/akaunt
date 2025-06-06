import React from 'react';
import { FlatList, View, Image, Dimensions, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';

const { width } = Dimensions.get('window');
const aspectRatio = 1; // You can adjust this (e.g., 3/4)

const CarouselItem = ({ item }) => {
  if (!item?.url) return null;

  return (
    <View style={styles.mediaWrapper}>
      <Image
        source={{ uri: item.url }}
        style={styles.media}
        resizeMode="cover" // or "contain"
      />
    </View>
  );
};

const Carousel = ({ images, id }) => {
  const theme = useSelector((state) => state.theme);

  const isSingleImage = images.length <= 1;

  return (
    <FlatList
      data={images}
      keyExtractor={(item, index) => `${id}-${index}`}
      horizontal
      pagingEnabled={!isSingleImage}
      scrollEnabled={!isSingleImage}
      renderItem={({ item }) => <CarouselItem item={item} />}
      showsHorizontalScrollIndicator={false}
      scrollEventThrottle={16}
    />
  );
};

export default Carousel;

const styles = StyleSheet.create({
  mediaWrapper: {
    width,
    height: width * aspectRatio,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  media: {
    width: '100%',
    height: '100%',
  },
});