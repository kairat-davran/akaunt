import React, { useState } from 'react'
import LeftSide from '../../components/message/LeftSide'
import RightSide from '../../components/message/RightSide'

const Conversation = () => {
    const [isLeftOpen, setIsLeftOpen] = useState(false);

    return (
        <div className={`message d-flex ${isLeftOpen ? 'open-left' : ''}`}>
            <div className="col-md-4 border-right px-0 left_mess">
                <LeftSide setIsLeftOpen={setIsLeftOpen} />
            </div>
            <div className="col-md-8 px-0 right_mess">
                <RightSide setIsLeftOpen={setIsLeftOpen} />
            </div>
        </div>
    )
}

export default Conversation