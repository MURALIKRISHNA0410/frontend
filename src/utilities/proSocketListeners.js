import updateCallStatus from "../redux-elements/actions/updateCallStatus"

const proDashBoardSocketListeners = (socket,setApptInfo,dispatch)=>{
     //console.log("hi in apptData")
     //.log(socket);
    socket.on('apptData',apptData=>{
        //console.log("hi in apptData")
        console.log("apptData",apptData)
        setApptInfo(apptData)
    })

    socket.on('newOfferWaiting',offerData=>{
        //dispatch the offer to redux s that itis avalilable for later
        dispatch(updateCallStatus('offer',offerData.offer))
        dispatch(updateCallStatus('myRole','answerer'))
    })
}

const proVideoSocketListeners = (socket,addIceCandidateToPc)=>{
    socket.on('iceToClient',iceC=>{
        addIceCandidateToPc(iceC)

    })


}



export default {proDashBoardSocketListeners,proVideoSocketListeners};