import React from 'react';
import { View, SafeAreaView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/header/Header';
import Posts from '../components/home/Posts';
import StatusModal from '../components/StatusModal';

const HomeScreen = () => {
  const navigation = useNavigation()

  return (
    <SafeAreaView style={styles.wrapper}>
      <Header navigation={navigation} />
      <View style={styles.postContainer}>
        <Posts />
      </View>
      <StatusModal />
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#fff',
  },
  postContainer: {
    flex: 1,
    zIndex: 0,
  },
});