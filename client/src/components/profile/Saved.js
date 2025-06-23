import React, { useState, useEffect } from 'react'
import PostThumb from '../PostThumb'
import LoadIcon from '../../images/loading.gif'
import LoadMoreBtn from '../LoadMoreBtn'
import { getDataAPI } from '../../utils/fetchData'
import { GLOBALTYPES } from '../../redux/actions/globalTypes'

const Saved = ({ auth, dispatch }) => {
  const [savePosts, setSavePosts] = useState([])
  const [result, setResult] = useState(0)
  const [page, setPage] = useState(1)
  const [load, setLoad] = useState(false)
  const [initialLoad, setInitialLoad] = useState(true)

  useEffect(() => {
    setLoad(true)
    setInitialLoad(true)

    getDataAPI(`getSavePosts?limit=${page * 9}`, auth.token)
      .then(res => {
        setSavePosts(res.data.savePosts)
        setResult(res.data.result)
        setInitialLoad(false)
        setLoad(false)
      })
      .catch(err => {
        dispatch({
          type: GLOBALTYPES.ALERT,
          payload: { error: err.response?.data?.msg || 'Failed to load saved posts.' }
        })
        setInitialLoad(false)
        setLoad(false)
      })

    // Don't clear saved posts on unmount
    return () => {}
  }, [auth.token, dispatch, page])

  const handleLoadMore = async () => {
    const nextPage = page + 1
    setLoad(true)

    try {
      const res = await getDataAPI(`getSavePosts?limit=${nextPage * 9}`, auth.token)
      setSavePosts(res.data.savePosts)
      setResult(res.data.result)
      setPage(nextPage)
    } catch (err) {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { error: err.response?.data?.msg || 'Failed to load more saved posts.' }
      })
    }

    setLoad(false)
  }

  return (
    <>
      <PostThumb posts={savePosts} result={result} initialLoad={initialLoad} />

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

export default Saved