export const error = (msg, err=undefined)=>{
    return {"message": msg, "error": err?err:msg}
}