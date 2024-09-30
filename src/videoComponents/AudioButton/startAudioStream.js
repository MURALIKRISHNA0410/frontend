import updateCallStatus from "../../redux-elements/actions/updateCallStatus";

// function to update all the peerConnections 
const startAudioStream =(streams)=>{
    const localStream =streams.localStream;
    for(const s in streams){ //s is the key
        if(s!=="localStream"){
            // we should not addTracks to localStream
            const curStream = streams[s];
            /*console.log(curStream);
            console.log(curStream.stream);
            console.log('local Stream',localStream.stream)*/
            localStream.stream.getAudioTracks().forEach(t=>{
                curStream.peerConnection.addTrack(t,streams.localStream.stream);
            })
            
        }


    }
}

export default startAudioStream;

