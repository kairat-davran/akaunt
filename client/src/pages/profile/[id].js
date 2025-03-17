import React, { useEffect, useState } from 'react'
import Info from '../../components/profile/Info'
import Posts from '../../components/profile/Posts'
import { useDispatch, useSelector } from 'react-redux'
import LoadIcon from '../../images/loading.gif'
import { useParams } from 'react-router-dom'
import { getProfileUsers } from '../../redux/actions/profileAction'
import Saved from '../../components/profile/Saved'
import EditProfile from '../../components/profile/EditProfile'
import Followers from '../../components/profile/Followers'
import Following from '../../components/profile/Following'

const Profile = () => {
    const profile = useSelector(state => state.profile)
    const auth = useSelector(state => state.auth)

    const dispatch = useDispatch()

    const { id } = useParams()
    const [saveTab, setSaveTab] = useState(false)

    const [onEdit, setOnEdit] = useState(false)
    const [showFollowers, setShowFollowers] = useState(false)
    const [showFollowing, setShowFollowing] = useState(false)

    const [userData, setUserData] = useState([])

    useEffect(() => {
        if(id === auth.user._id) {
            setUserData(auth.user)
        } else {
            const newData = profile.users.filter(user => user._id === id)
            setUserData(...newData)
        }

    }, [id, auth, profile.users])

    useEffect(() => {
        if(profile.ids.every(item => item !== id)){
            dispatch(getProfileUsers({id, auth}))
        }
    },[id, auth, dispatch, profile.ids])

    return (
        <div className="profile">

            <Info auth={auth}
                profile={profile}
                dispatch={dispatch}
                id={id}
                onEdit={onEdit}
                setOnEdit={setOnEdit}
                showFollowers={showFollowers}
                setShowFollowers={setShowFollowers}
                showFollowing={showFollowing}
                setShowFollowing={setShowFollowing} />

            {
                auth.user._id === id &&
                <div className="profile_tab">
                    <button className={saveTab ? '' : 'active'} onClick={() => setSaveTab(false)}>Posts</button>
                    <button className={saveTab ? 'active' : ''} onClick={() => setSaveTab(true)}>Saved</button>
                </div>
            }

            {
                profile.loading 
                ? <img className="d-block mx-auto" src={LoadIcon} alt="loading" />
                : <>
                    {
                        saveTab
                        ? <Saved auth={auth} dispatch={dispatch} />
                        : <Posts auth={auth} profile={profile} dispatch={dispatch} id={id} />
                    }
                </>
            }

            {
                onEdit && <EditProfile setOnEdit={setOnEdit} />
            }

            {
                showFollowers &&
                <Followers
                    users={userData.followers}
                    setShowFollowers={setShowFollowers}
                />
            }

            {
                showFollowing &&
                <Following
                    users={userData.following}
                    setShowFollowing={setShowFollowing}
                />
            }
        </div>
    )
}

export default Profile