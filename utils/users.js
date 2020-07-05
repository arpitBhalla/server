const users=[]
const addUser=({id,username,room})=>{
    console.log(users);
    username=username.trim().toLowerCase()
    room=room.trim().toLowerCase()
    const existingUser=users.find((user)=>{
        return user.room==room && user.username==username
    })
    const user={id,username,room}
    const err='';

    if(existingUser){
        return {err,user}
    }
    users.push(user)
    return {err, user}
}
const removeUser=(id)=>{
    const index=users.findIndex((user)=>user.id===id)    
    if(index!=-1){
        return users.splice(index,1)[0]
    }
}
const getUser=(id)=>{
    return users.filter((user)=>user.id===id)
}
const getUserInRoom=(room)=>users.filter((user)=>user.room===room)


module.exports={
    addUser,
    removeUser,
    getUser,
    getUserInRoom
}