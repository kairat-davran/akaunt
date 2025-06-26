import { GLOBALTYPES } from './globalTypes'
import { imageUpload, uploadMediaToServer } from '../../utils/imageUpload'
import { deleteDataAPI, getDataAPI, patchDataAPI, postDataAPI } from '../../utils/fetchData'
import { createNotify, removeNotify } from './notifyAction'

export const POST_TYPES = {
    CREATE_POST: 'CREATE_POST',
    LOADING_POST: 'LOADING_POST',
    GET_POSTS: 'GET_POSTS',
    UPDATE_POST: 'UPDATE_POST',
    GET_POST: 'GET_POST',
    DELETE_POST: 'DELETE_POST'
}

export const createPost = ({ content, images, auth, socket }) => async (dispatch) => {
  try {
    dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } });

    const uploadPromises = images.map(img =>
      img?.file ? uploadMediaToServer([img.file], auth.token) :
      img?.uri ? uploadMediaToServer([img.uri], auth.token) :
      null
    );
    
    const media = (await Promise.all(uploadPromises)).flat().filter(Boolean);

    const res = await postDataAPI('posts', {
      content,
      images: media
    }, auth.token);

    dispatch({
      type: POST_TYPES.CREATE_POST,
      payload: { ...res.data.newPost, user: auth.user }
    });

    dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: false } });

    // Notify
    const msg = {
      id: res.data.newPost._id,
      text: 'added a new post.',
      recipients: Array.isArray(res.data.newPost.user?.followers) ? res.data.newPost.user.followers : [],
      url: `/post/${res.data.newPost._id}`,
      content,
      image:
        typeof media[0] === 'string'
          ? media[0]
          : media[0]?.url || media[0]?.uri || null
    };

    dispatch(createNotify({ msg, auth, socket }));

  } catch (err) {
    console.error("Create Post Error:", err?.response?.data || err.message);
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: {
        error: err?.response?.data?.msg || 'Post creation failed. Check the server logs.'
      }
    });
  }
};

export const getPosts = (token) => async (dispatch) => {
    try {
        dispatch({ type: POST_TYPES.LOADING_POST, payload: true })
        const res = await getDataAPI('posts', token)
        
        dispatch({
            type: POST_TYPES.GET_POSTS,
            payload: {...res.data, page: 2}
        })

        dispatch({ type: POST_TYPES.LOADING_POST, payload: false })
    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {error: err.response && err.response.data.msg}
        })
    }
}

export const updatePost = ({ content, images, auth, status, socket }) => async (dispatch) => {
  let media = [];

  const imgNew = images.filter(img => !img.url && !img._id);
  const imgOld = images.filter(img => img.url || img._id);

  if (
    status.content === content &&
    imgNew.length === 0 &&
    imgOld.length === status.images.length
  ) return;

  try {
    dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } });

    if (imgNew.length > 0) {
      media = (await Promise.all(
        imgNew.map(img =>
          img?.file ? uploadMediaToServer([img.file], auth.token) :
          img?.uri ? uploadMediaToServer([img.uri], auth.token) :
          null
        )
      )).flat().filter(Boolean);
    }

    const updatedImages = [...imgOld, ...media.filter(Boolean)];

    const res = await patchDataAPI(
      `post/${status._id}`,
      { content, images: updatedImages },
      auth.token
    );

    dispatch({ type: POST_TYPES.UPDATE_POST, payload: res.data.newPost });
    dispatch({ type: GLOBALTYPES.ALERT, payload: { success: res.data.msg } });

    // ✅ Safe Notify
    const msg = {
      id: res.data.newPost._id,
      text: 'updated a post.',
      recipients: Array.isArray(status.user?.followers) ? status.user.followers : [],
      url: `/post/${status._id}`,
      content: content || '',
      image:
        typeof updatedImages[0] === 'string'
          ? updatedImages[0]
          : updatedImages[0]?.url || updatedImages[0]?.uri || null
    };

    dispatch(createNotify({ msg, auth, socket }));

  } catch (err) {
    console.error("Update Post Error:", err);
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { error: err.response?.data?.msg || 'Post update failed' }
    });
  }
};

export const likePost = ({post, auth, socket}) => async (dispatch) => {
    const newPost = {...post, likes: [...post.likes, auth.user]}
    dispatch({ type: POST_TYPES.UPDATE_POST, payload: newPost})

    socket.emit('likePost', newPost)
    try {
        await patchDataAPI(`post/${post._id}/like`, null, auth.token)
        
        // Notify
        const msg = {
            id: auth.user._id,
            text: 'like your post.',
            recipients: [post.user._id],
            url: `/post/${post._id}`,
            content: post.content, 
            image: post.images[0].url
        }

        dispatch(createNotify({msg, auth, socket}))

    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {error: err.response.data.msg}
        })
    }
}

export const unLikePost = ({post, auth, socket}) => async (dispatch) => {
    const newPost = {...post, likes: post.likes.filter(like => like._id !== auth.user._id)}
    dispatch({ type: POST_TYPES.UPDATE_POST, payload: newPost})

    socket.emit('unLikePost', newPost)
    try {
        await patchDataAPI(`post/${post._id}/unlike`, null, auth.token)

        // Notify
        const msg = {
            id: auth.user._id,
            text: 'like your post.',
            recipients: [post.user._id],
            url: `/post/${post._id}`,
        }
        dispatch(removeNotify({msg, auth, socket}))

    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {error: err.response.data.msg}
        })
    }
}

export const getPost = ({detailPost, id, auth}) => async (dispatch) => {
    if(detailPost.every(post => post._id !== id)){
        try {
            const res = await getDataAPI(`post/${id}`, auth.token)
            dispatch({ type: POST_TYPES.GET_POST, payload: res.data.post })
        } catch (err) {
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {error: err.response.data.msg}
            })
        }
    }
}

export const deletePost = ({post, auth, socket}) => async (dispatch) => {
    dispatch({ type: POST_TYPES.DELETE_POST, payload: post });

    try {
        const res = await deleteDataAPI(`post/${post._id}`, auth.token);
    
        if (!res.data || !res.data.deletedPost) {
            throw new Error("Invalid response from server");
        }
    
        const msg = {
            id: post._id,
            text: 'deleted a post.',
            recipients: res.data.deletedPost?.user?.followers || [],
            url: `/post/${post._id}`,
        };
        dispatch(removeNotify({ msg, auth, socket }));
    
    } catch (err) {
        console.error("Delete Post Error:", err);
    
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: { error: err.response?.data?.msg || "Something went wrong" }
        });
    }
};

export const savePost = ({post, auth}) => async (dispatch) => {
    const newUser = {...auth.user, saved: [...auth.user.saved, post._id]}
    dispatch({ type: GLOBALTYPES.AUTH, payload: {...auth, user: newUser}})

    try {
        await patchDataAPI(`savePost/${post._id}`, null, auth.token)
    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {error: err.response.data.msg}
        })
    }
}

export const unSavePost = ({post, auth}) => async (dispatch) => {
    const newUser = {...auth.user, saved: auth.user.saved.filter(id => id !== post._id) }
    dispatch({ type: GLOBALTYPES.AUTH, payload: {...auth, user: newUser}})

    try {
        await patchDataAPI(`unSavePost/${post._id}`, null, auth.token)
    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {error: err.response.data.msg}
        })
    }
}