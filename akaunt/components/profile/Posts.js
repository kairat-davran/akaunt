import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { getDataAPI } from '../../utils/fetchData';
import { PROFILE_TYPES } from '../../redux/actions/profileAction';

import PostThumb from '../PostThumb';
import LoadMoreBtn from '../LoadMoreBtn';
import LoadIcon from '../../assets/images/loading.gif';

const Posts = ({ auth, profile, dispatch, id }) => {
  const [posts, setPosts] = useState([]);
  const [result, setResult] = useState(9);
  const [page, setPage] = useState(0);
  const [load, setLoad] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    const match = profile.posts.find(data => data._id === id);
    if (match) {
      setPosts(match.posts);
      setResult(match.result);
      setPage(match.page);
      setInitialLoad(false);
    }
  }, [profile.posts, id]);

  const handleLoadMore = async () => {
    setLoad(true);
    const res = await getDataAPI(`user_posts/${id}?limit=${(page + 1) * 9}`, auth.token);
    const newData = { ...res.data, page: page + 1, _id: id };
    dispatch({ type: PROFILE_TYPES.UPDATE_POST, payload: newData });
    setPosts(newData.posts);
    setResult(newData.result);
    setPage(newData.page);
    setLoad(false);
  };

  return (
    <View style={styles.wrapper}>
      {initialLoad ? (
        <Image source={LoadIcon} style={styles.loading} resizeMode="contain" />
      ) : (
        <>
          <PostThumb posts={posts} result={result} />
          {load && (
            <Image source={LoadIcon} style={styles.loading} resizeMode="contain" />
          )}
          <LoadMoreBtn
            result={result}
            page={page}
            load={load}
            handleLoadMore={handleLoadMore}
          />
        </>
      )}
    </View>
  );
};

export default Posts;

const styles = StyleSheet.create({
  wrapper: {
    padding: 10,
  },
  loading: {
    width: 50,
    height: 50,
    alignSelf: 'center',
    marginVertical: 20,
  },
});