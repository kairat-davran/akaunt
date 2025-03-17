import React, { useEffect, useState } from 'react'
import { getPost } from '../../redux/actions/postAction'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import LoadIcon from '../../images/loading.gif'
import PostCard from '../../components/PostCard'

const Post = () => {
    const { id } = useParams()
    const [post, setPost] = useState([])

    const auth = useSelector(state => state.auth)
    const detailPost = useSelector(state => state.detailPost)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getPost({detailPost, id, auth}))

        if(detailPost.length > 0){
            const newArr = detailPost.filter(post => post._id === id)
            setPost(newArr)
        }
    },[detailPost, dispatch, id, auth])

    return (
        <div className='posts'>
            {
                post.length === 0 &&
                <img src={LoadIcon} alt="loading" className="d-block mx-auto my-4" />
            }

            {
                 post.map(item => (
                    <PostCard key={item._id} post={item} />
                ))
            }
        </div>
    )
}

export default Post