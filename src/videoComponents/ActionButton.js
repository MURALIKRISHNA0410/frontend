import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import HangupButton from './HangUpButtons';
import VideoButton from './VideoButton/VideoButton';
import AudioButton from './AudioButton/AudioButton';

const ActionButtons = ({ openCloseChat, smallFeedEl, largeFeedEl }) => {
    const callStatus = useSelector(state => state.callStatus);
    const menuButtons = useRef(null);
    let timer;

    useEffect(() => {
        const setTimer = () => {
            if (callStatus.current !== "idle") {
                timer = setTimeout(() => {
                    menuButtons.current.classList.add('hidden');
                }, 4000);
            }
        };

        window.addEventListener('mousemove', () => {
            if (menuButtons.current && menuButtons.current.classList && menuButtons.current.classList.contains('hidden')) {
                menuButtons.current.classList.remove('hidden');
                setTimer();
            } else {
                clearTimeout(timer);
                setTimer();
            }
        });

        return () => {
            window.removeEventListener('mousemove', () => {
                // Cleanup to prevent memory leaks
                //mouse moved! 
            //it's hidden. Remove class to display and start the timer
            if (menuButtons.current && menuButtons.current.classList && menuButtons.current.classList.contains('hidden')) {
                // console.log("Not showing. Show now")
                menuButtons.current.classList.remove('hidden');
                setTimer();
            }else{
                // Not hidden, just reset start timer
                clearTimeout(timer); //clear out the old timer
                setTimer();
            }
            });
        };
    }, [callStatus.current]);

    return (
        <div id="menu-buttons" ref={menuButtons} className="row">
            <div className="left col-2">
                <AudioButton />
                <VideoButton smallFeedEl={smallFeedEl} />
            </div>
            <div className="col-8 text-center">
                <div className="button-wrapper d-inline-block">
                    <i className="fa fa-caret-up choose-video"></i>
                    <div className="button participants">
                        <i className="fa fa-users"></i>
                        <div className="btn-text">Participants</div>
                    </div>
                </div>
                <div className="button-no-caret d-inline-block">
                    <div className="button participants">
                        <i className="fa fa-comment" onClick={openCloseChat}></i>
                        <div className="btn-text" onClick={openCloseChat}>Chat</div>
                    </div>
                </div>
                <div className="button-no-caret participants d-inline-block">
                    <div className="button participants">
                        <i className="fa fa-desktop"></i>
                        <div className="btn-text">Share Screen</div>
                    </div>
                </div>
            </div>
            <div className="center justify-center text-end col-2">
                <HangupButton />
            </div>
        </div>
    );
};

export default ActionButtons;
