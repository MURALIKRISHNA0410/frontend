import peerConfiguration from "./stunServers";





const createPeerConnection=(addIce)=>{
    //console.log(" increatePeerConnection");
    return new Promise(async(resolve,reject)=>{
        const peerConnection=await new RTCPeerConnection(peerConfiguration);
        //rtc peer connection is the connection to the peer.
        //we may need more than one this time!!
        //we pass it the config object,which is just stun servers
        //it will get us ICE candidates
        const remoteStream =new MediaStream();
        peerConnection.addEventListener('signalingstatechange',(e)=>{
            console.log("SignalingStateChange")
            console.log(e)
        })

        peerConnection.addEventListener('icecandidate',e=>{
            console.log("Found ice Candidate ...");
            if(e.candidate){
                //emit to socket server
                addIce(e.candidate)

            }
        })
        peerConnection.addEventListener('track',e=>{
            console.log("got a track from remote")
            e.streams[0].getTracks().forEach(track=>{
                remoteStream.addTrack(track,remoteStream);
                console.log('added tracks to remote stream')
            })
            })
        resolve({
            peerConnection,
            remoteStream,
        })
    })

}

export default createPeerConnection