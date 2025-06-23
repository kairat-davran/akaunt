import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

const PostThumb = ({ posts, result, initialLoad }) => {
  const theme = useSelector(state => state.theme)

  if (!initialLoad && result === 0 && posts.length === 0) {
    return <h2 className="text-center text-danger">No Posts</h2>
  }

  return (
    <div className="post_thumb">
      {posts.map(post => (
        <Link key={post._id} to={`/post/${post._id}`} className="post_thumb_display">
          {post.images[0].url.match(/\.(mp4|webm)$/)
            ? (
              <video
                src={post.images[0].url}
                alt="video"
                muted
                playsInline
                preload="metadata"
                style={{ filter: theme ? 'invert(1)' : 'invert(0)' }}
              />
            ) : (
              <img
                src={post.images[0].url}
                alt="post"
                style={{ filter: theme ? 'invert(1)' : 'invert(0)' }}
              />
            )}
          <div className="post_thumb_menu">
            <i className="far fa-heart">{post.likes.length}</i>
            <i className="far fa-comment">{post.comments.length}</i>
          </div>
        </Link>
      ))}
    </div>
  )
}

export default PostThumb