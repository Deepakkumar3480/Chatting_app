export function formatMessageTime(myval){
    // console.log(myval)
    return new Date(myval).toLocaleTimeString("en-us",{
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    })
}