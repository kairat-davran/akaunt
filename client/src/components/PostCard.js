import React from 'react'
import CardHeader from './home/post_card/CardHeader'
import CardBody from './home/post_card/CardBody'
import CardFooter from './home/post_card/CardFooter'
import InputComment from './home/InputComment'
import Comments from './home/Comments'

const PostCard = ({post, theme}) => {
    return (
        <div className="card my-3">
            <CardHeader post={post} />
            <CardBody post={post} theme={theme} />
            <CardFooter post={post} />
            
            <Comments post={post} />
            <InputComment post={post} />
        </div>
    )
}

export default PostCard