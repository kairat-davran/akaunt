import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { getDiscoverPosts, DISCOVER_TYPES } from '../redux/actions/discoverAction';
import { getDataAPI } from '../utils/fetchData';
import PostThumb from '../components/PostThumb';
import Search from '../components/header/Search';

const DiscoverScreen = () => {
  const dispatch = useDispatch();
  const auth = useSelector(state => state.auth);
  const discover = useSelector(state => state.discover);
  const [loadMore, setLoadMore] = useState(false);

  useEffect(() => {
    if (!discover.firstLoad) {
      dispatch(getDiscoverPosts(auth.token));
    }
  }, [dispatch, auth.token, discover.firstLoad]);

  const handleLoadMore = async () => {
    setLoadMore(true);
    const res = await getDataAPI(`post_discover?num=${discover.page * 9}`, auth.token);
    dispatch({ type: DISCOVER_TYPES.UPDATE_POST, payload: res.data });
    setLoadMore(false);
  };

  return (
    <SafeAreaView style={styles.wrapper}>
      <View style={styles.searchContainer}>
        <Search />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {discover.loading ? (
          <ActivityIndicator size="large" color="#000" style={styles.loading} />
        ) : (
          <PostThumb posts={discover.posts} result={discover.result} />
        )}

        {loadMore && <ActivityIndicator size="small" color="#888" />}
      </ScrollView>

      {!discover.loading &&
        discover.result >= discover.page * 9 && (
          <TouchableOpacity style={styles.loadMoreBtn} onPress={handleLoadMore}>
            <Text style={styles.loadMoreText}>Load More</Text>
          </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

export default DiscoverScreen;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#fff',
  },
    searchContainer: {
    padding: 10,
    backgroundColor: '#fff',
    zIndex: 10,
  },
  scroll: {
    padding: 10,
    paddingBottom: 80,
  },
  loading: {
    marginVertical: 20,
  },
  loadMoreBtn: {
    backgroundColor: '#000',
    padding: 10,
    borderRadius: 5,
    alignSelf: 'center',
    marginTop: 15,
  },
  loadMoreText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});