import React from 'react'
import Loading from './Loading'
import { useDispatch, useSelector } from 'react-redux'
import Toast from './Toast'
import { GLOBALTYPES } from '../../redux/actions/globalTypes'

function Alert() {
    const alert = useSelector(state => state.alert)
    const dispatch = useDispatch()

    return (
        <div>
            {alert.loading && <Loading />}
            
            {
                alert.error && 
                <Toast msg={{title: 'Error', body: alert.error}}
                handleShow={() => dispatch({type: GLOBALTYPES.ALERT, payload: {}})}
                bgColor="bg-danger" />
            }
            
            {
                alert.success &&
                <Toast msg={{title: 'Success', body: alert.success}}
                handleShow={() => dispatch({type: GLOBALTYPES.ALERT, payload: {}})}
                bgColor="bg-success" />
            }
        </div>
    )
}

export default Alert