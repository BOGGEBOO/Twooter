

async function postMessage() {
    let message = document.getElementById('message').value
    if(message.length > 140 || message.length < 1) {
        document.getElementById('BadMessage').innerHTML = 'Ditt meddelande ska vara mellan 1 och 140 tecken!'
    }
    else{
        let data = {
            profile: sessionStorage.getItem('visitedProfile'),
            poster: sessionStorage.getItem('currentUser'),
            message: message
        }
        let response = await postFunc(data, 'addMessage')
        if (response.success == true){
            const d = new Date()
            createListItem(message, d.toDateString(), response.id, sessionStorage.getItem('currentUser'))
        }
        else{
        document.getElementById('BadMessage').innerHTML = 'Passa daj'
        }
    }
}

function createListItem(message, date, id, poster) {
    // console.log(read)
    let message_list = document.getElementById("messageList")

    let entry = document.createElement('li')

    let div = document.createElement('div')
    div.setAttribute('class', 'container p-3 my-3 border')
    div.setAttribute('id', id)
    
    entry.appendChild(div)

    let row = document.createElement('div')
    row.setAttribute('class', 'row justify-content-center align-items-center g-2')
    div.appendChild(row)

    let col1 = document.createElement('div')

    let d = new Date(date)
    let d2 = d.toLocaleDateString() + " " + d.getHours() + ":" + d.getMinutes()
    
    col1.innerHTML = '<p><small class="text-body-secondary">'+ poster +'</small></p><input type="hidden" id="id" value="' + id + 
    '"/> <h4>' + message + '</h4><p><small class="text-body-secondary">Posted at ' + d2 + '</small></p>'
    col1.setAttribute('class', 'col')
    row.appendChild(col1)

    let col2 = document.createElement('div')
    col2.setAttribute('class', 'col col2')
    row.appendChild(col2)
   
    message_list.insertBefore(entry, message_list.firstChild)
    

}

function createFriendItem(){

}


window.onload = async () => {
    let response = await getFuncData(sessionStorage.getItem('visitedProfile'), 'getMessages')
    for (let i = 0; i < response.messages.length; i++){
        createListItem(response.messages[i].message, response.messages[i].date, 
            response.messages[i].id, response.messages[i].user)
    }
    console.log(response.messages)
    let friends = await getFuncData(sessionStorage.getItem('visitedProfile'), 'getFriends')
    console.log(friends.friends)
}