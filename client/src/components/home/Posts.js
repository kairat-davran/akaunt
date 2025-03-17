import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PostCard from '../PostCard'

import LoadMoreBtn from '../LoadMoreBtn'
import LoadIcon from '../../images/loading.gif'
import { getDataAPI } from '../../utils/fetchData'
import { POST_TYPES } from '../../redux/actions/postAction'

const Posts = () => {
    const homePosts = useSelector(state => state.homePosts)
    const auth = useSelector(state => state.auth)
    const theme = useSelector(state => state.theme)
    const dispatch = useDispatch()

    const [load, setLoad] = useState(false)

    const handleLoadMore = async () => {
        setLoad(true)
        const res = await getDataAPI(`posts?limit=${homePosts.page * 9}`, auth.token)
        
        dispatch({
            type: POST_TYPES.GET_POSTS,
            payload: {...res.data, page: homePosts.page + 1}
        })
        
        setLoad(false)
    }
    
    return (
        <div className="posts">
            {
                homePosts.posts.map(post => (
                    <PostCard key={post._id} post={post} theme={theme} />
                ))
            }

            {
                load && <img src={LoadIcon} alt="loading" className="d-block mx-auto" />
            }

            
            <LoadMoreBtn result={homePosts.result} page={homePosts.page}
            load={load} handleLoadMore={handleLoadMore} />
        </div>
    )
}

export default Posts