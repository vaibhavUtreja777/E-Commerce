const user = null

const handleUser = (state=user, action) =>{
    switch(action.type){
        case "SETUSER" : 
            return action.payload
        default:
            return state
    }
}

export default handleUser