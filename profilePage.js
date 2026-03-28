
function logout(){
    sessionStorage.clear()
    window.location = 'index.html'
}

async function postMessage() {
    let message = document.getElementById('message').value
    message.trim()
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

function createDiv(chosenClass) {
    let div = document.createElement('div')
    div.setAttribute('class', chosenClass)
    return div
}

function createListItem(message, date, id, poster) {
    
    let message_list = document.getElementById("messageList")

    let entry = document.createElement('li')

    let div = createDiv('container p-3 my-3 border')
    div.setAttribute('id', id)
    
    entry.appendChild(div)

    let row = createDiv('row justify-content-center align-items-center g-2')
    
    div.appendChild(row)

    let col1 = createDiv('col')

    let d = new Date(date)
    let d2 = d.toLocaleDateString() + " " + d.getHours() + ":" + d.getMinutes()
    
    col1.innerHTML = '<p><small class="text-body-secondary">'+ poster +'</small></p><input type="hidden" id="id" value="' + id + 
    '"/> <h4>' + message + '</h4><p><small class="text-body-secondary">Posted at ' + d2 + '</small></p>'
    row.appendChild(col1)

    let col2 = createDiv('col col2')
    
    row.appendChild(col2)
   
    message_list.insertBefore(entry, message_list.firstChild)
}

function createFriendItem(name){
    let list = document.getElementById('list-tab')
    let entry = document.createElement('a')
    entry.setAttribute('class', 'list-group-item list-group-item-action')
    entry.setAttribute('href', 'profilePage.html')
    entry.setAttribute('onclick', 'visitFriend(' + name + ')')
    entry.setAttribute('id', name)
    entry.innerHTML = name
    list.appendChild(entry)
}

function visitFriend(name){
    sessionStorage.setItem('visitedProfile', name.id)
    window.location = 'profilePage.html'
}

function createAccItem(name){
    console.log(name)
    let list = document.getElementById('list-tab-req')
    let entry = document.createElement('a')
    entry.setAttribute('class', 'list-group-item list-group-item-action')
    entry.setAttribute('onclick', 'acceptReq(' + name + ')')
    entry.setAttribute('id', name)
    entry.innerHTML = name
    list.appendChild(entry)
}

function removeAccItem(name) {
    let list = document.getElementById('list-tab-req')
    list.children[name].remove()
}

async function acceptReq(name) {
    let data = {
        sender: sessionStorage.getItem('currentUser'),
        receiver: name.id,
    }
    let response = await postFunc(data, 'accFriend')
    if(response.success) {
        createFriendItem(name.id)
        removeAccItem(name.id)
    }
}


window.onload = async () => {
    let response = await getFuncData(sessionStorage.getItem('visitedProfile'), 'getMessages')
    for (let i = 0; i < response.messages.length; i++){
        createListItem(response.messages[i].message, response.messages[i].date, 
            response.messages[i].id, response.messages[i].user)
    }
    
    if(sessionStorage.getItem('currentUser') == sessionStorage.getItem('visitedProfile')) {
        let friends = await getFuncData(sessionStorage.getItem('visitedProfile'), 'getFriends')
        
        for (friend of friends.friends){
            createFriendItem(friend)
        }
        let pending = await getFuncData(sessionStorage.getItem('visitedProfile'), 'getPending')
        for (req of pending.reqs){
            createAccItem(req)
        }
    }
    else {
    }
    
}