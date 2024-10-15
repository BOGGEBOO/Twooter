
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
    // let div = document.createElement('div')
    // div.setAttribute('class', 'container p-3 my-3 border')
    div.setAttribute('id', id)
    
    entry.appendChild(div)

    let row = createDiv('row justify-content-center align-items-center g-2')
    // let row = document.createElement('div')
    // row.setAttribute('class', 'row justify-content-center align-items-center g-2')
    div.appendChild(row)

    let col1 = createDiv('col')
    // let col1 = document.createElement('div')

    let d = new Date(date)
    let d2 = d.toLocaleDateString() + " " + d.getHours() + ":" + d.getMinutes()
    
    col1.innerHTML = '<p><small class="text-body-secondary">'+ poster +'</small></p><input type="hidden" id="id" value="' + id + 
    '"/> <h4>' + message + '</h4><p><small class="text-body-secondary">Posted at ' + d2 + '</small></p>'
    // col1.setAttribute('class', 'col')
    row.appendChild(col1)

    let col2 = createDiv('col col2')
    // let col2 = document.createElement('div')
    // col2.setAttribute('class', 'col col2')
    row.appendChild(col2)
   
    message_list.insertBefore(entry, message_list.firstChild)
    

}

function createFriendItem(name){
    //TODO skapa vänner
    let friendsList = document.getElementById('friendsList')
    let entry = document.createElement('li')

    let block = createDiv('container p-3 my-3 border')
    block.setAttribute('id', name)

    entry.appendChild(block)

    let row = createDiv('row justify-content-center align-items-center g-2')
    block.appendChild(row)

    let col1 = createDiv('col')
    col1.innerHTML = '<p>' + name + '</p>'
    row.appendChild(col1)

    let col2 = createDiv('col col2')
    row.appendChild(col2)

    let button = createDiv('form-check')
    button.innerHTML = '<input class="form-check-input" type="button" value="" id="c-' + name + 
    '" onclick="visitFriend(' + name + ')">'

    col2.append(button)
    
    friendsList.insertBefore(entry, friendsList.firstChild)

}

function visitFriend(name){
    sessionStorage.setItem('visitedProfile', name.id)
    window.location = 'profilePage.html'
}

function createAccItem(name){
    let reqsList = document.getElementById('reqsList')

    let entry = document.createElement('li')

    let div = document.createElement('div')
    div.setAttribute('class', 'container p-3 my-3 border')
    div.setAttribute('id', name)
    
    entry.appendChild(div)

    let row = document.createElement('div')
    row.setAttribute('class', 'row justify-content-center align-items-center g-2')
    div.appendChild(row)

    let col1 = document.createElement('div')

    col1.innerHTML = '<p>' + name + '</p>'
    col1.setAttribute('class', 'col')
    row.appendChild(col1)


    let col2 = document.createElement('div')
    col2.setAttribute('class', 'col col2')

    let button = document.createElement('div')
    button.setAttribute('class', 'form-check')
    button.innerHTML = '<input class="form-check-input" type="button" value="" id="c-' + name + 
    '" onclick="acceptReq(' + name + ')">'
    
    
    col2.appendChild(button)
    row.appendChild(col2)
    
    reqsList.insertBefore(entry, reqsList.firstChild)
}

function removeAccItem(name) {
    // TODO: ta bort från reqsList när man blivit kompisar
    let list = document.getElementById('reqsList')
    let child = document.getElementById(name)
    list.removeChild(child)
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
    console.log(response.messages)
    
    if(sessionStorage.getItem('currentUser') == sessionStorage.getItem('visitedProfile')) {
        let friends = await getFuncData(sessionStorage.getItem('visitedProfile'), 'getFriends')
        console.log(friends.friends)
        
        for (friend of friends.friends){
            createFriendItem(friend)
        }
        let pending = await getFuncData(sessionStorage.getItem('visitedProfile'), 'getPending')
        console.log(pending.reqs)
        for (req of pending.reqs){
            createAccItem(req)
        }
    }
    
}