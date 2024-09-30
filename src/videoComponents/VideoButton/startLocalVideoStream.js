import updateCallStatus from "../../redux-elements/actions/updateCallStatus";

// this functions job is to update all peerConnections (all Tracks ) and update redux call
const startLocalVideoStream=(streams, dispatch)=>{
    /*console.log("streams in startLocalVideoStream",streams)
    console.log("streams in with local Video",streams)*/
    //console.log("sanity check");
    //console.log("Streams in Start local Video",streams);
    const  localStream = streams.localStream;
    for(const s in streams){ //s is the key
        if(s!=="localStream"){
            // we should not addTracks to localStream
            const curStream = streams[s];
            /*console.log(curStream);
            console.log(curStream.stream);
            console.log('local Stream',localStream.stream)*/
            localStream.stream.getVideoTracks().forEach(t=>{
                curStream.peerConnection.addTrack(t,streams.localStream.stream);
            })
            //update redux callStatus
            dispatch(updateCallStatus('video',"enabled"));
        }
    }
    
}


export default startLocalVideoStream;