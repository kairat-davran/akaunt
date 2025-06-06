import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import PostThumb from '../PostThumb';
import LoadMoreBtn from '../LoadMoreBtn';
import { getDataAPI } from '../../utils/fetchData';
import { GLOBALTYPES } from '../../redux/actions/globalTypes';
import LoadIcon from '../../assets/images/loading.gif';


const Saved = ({ auth, dispatch }) => {
  const [savePosts, setSavePosts] = useState([]);
  const [result, setResult] = useState(9);
  const [page, setPage] = useState(2);
  const [load, setLoad] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true); // NEW

  useEffect(() => {
    setLoad(true);
    getDataAPI('getSavePosts', auth.token)
      .then(res => {
        setSavePosts(res.data.savePosts);
        setResult(res.data.result);
      })
      .catch(err => {
        dispatch({
          type: GLOBALTYPES.ALERT,
          payload: { error: err.response?.data?.msg || 'Something went wrong' },
        });
      })
      .finally(() => {
        setLoad(false);
        setInitialLoad(false); // NEW
      });

    return () => setSavePosts([]);
  }, [auth.token, dispatch]);

  const handleLoadMore = async () => {
    setLoad(true);
    const res = await getDataAPI(`getSavePosts?limit=${page * 9}`, auth.token);
    setSavePosts(res.data.savePosts);
    setResult(res.data.result);
    setPage(page + 1);
    setLoad(false);
  };

  return (
    <View style={styles.wrapper}>
      {initialLoad ? (
        <Image
          source={LoadIcon}
          style={styles.loading}
          resizeMode="contain"
        />
      ) : (
        <>
          <PostThumb posts={savePosts} result={result} />
          {load && (
            <Image
              source={LoadIcon}
              style={styles.loading}
              resizeMode="contain"
            />
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

export default Saved;

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