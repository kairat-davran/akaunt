import React, { useEffect, useState } from 'react'
import PostThumb from '../PostThumb'
import LoadMoreBtn from '../LoadMoreBtn'
import LoadIcon from '../../images/loading.gif'
import { getDataAPI } from '../../utils/fetchData'
import { GLOBALTYPES } from '../../redux/actions/globalTypes'

const Posts = ({ auth, id, dispatch }) => {
  const [posts, setPosts] = useState([])
  const [result, setResult] = useState(0)
  const [page, setPage] = useState(1)
  const [load, setLoad] = useState(false)
  const [initialLoad, setInitialLoad] = useState(true)

  useEffect(() => {
    setLoad(true)
    setInitialLoad(true)

    getDataAPI(`user_posts/${id}?limit=${page * 9}`, auth.token)
      .then(res => {
        setPosts(res.data.posts)
        setResult(res.data.result)
        setInitialLoad(false)
        setLoad(false)
      })
      .catch(err => {
        dispatch({
          type: GLOBALTYPES.ALERT,
          payload: { error: err.response?.data?.msg || 'Failed to load posts.' }
        })
        setInitialLoad(false)
        setLoad(false)
      })

    // Do not reset posts here
  }, [auth.token, id, dispatch, page])

  const handleLoadMore = async () => {
    const nextPage = page + 1
    setLoad(true)

    try {
      const res = await getDataAPI(`user_posts/${id}?limit=${nextPage * 9}`, auth.token)
      setPosts(res.data.posts)
      setResult(res.data.result)
      setPage(nextPage)
    } catch (err) {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { error: err.response?.data?.msg || 'Failed to load more posts.' }
      })
    }

    setLoad(false)
  }

  return (
    <>
      <PostThumb posts={posts} result={result} initialLoad={initialLoad} />

      {load && <img src={LoadIcon} alt="loading" className="d-block mx-auto" />}

      <LoadMoreBtn
        result={result}
        page={page}
        load={load}
        handleLoadMore={handleLoadMore}
      />
    </>
  )
}

export default Posts