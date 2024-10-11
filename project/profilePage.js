

async function postMessage() {
    let message = document.getElementById('message').value
    if(message.length > 140 || message.length < 1) {

    }
}

function displayItem(message) {
    let message_list = document.getElementById('messageList')
}

window.onload = async () => {
    let data ={
        name: sessionStorage.getItem('visitedProfile')
    }
    let response = await getFuncData(data, 'getMessages')
    console.log(response.messages)
    // messages = response.messages
}