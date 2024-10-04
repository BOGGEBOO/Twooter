

// TODO: fixa filtreringen så att förbjudna meddelanden inte dyker upp i listan

async function getAll() {
    let messages = await fetch('http://localhost:3000/getall', {method: 'GET', mode: 'cors'})
                    .then((response) => response.json())
                    .catch((err) => console.log(err))
    return messages
}

async function postMessage(new_message) {
    let headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',                                                                                                
    }
    let data = {
        message: new_message
    }
    let response = await fetch('http://localhost:3000/save', {
        method: 'POST', 
        mode: 'cors',
        headers: headers, 
        body: JSON.stringify(data)
    })
    .then(response => response.json().then(data => ({status: response.status, body: data})))
    .catch((err) => console.log(err))
    return response
}

async function flagMessage(id, read) {
    let headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',                                                                                                
    }
    let data = {
        id: id, 
        read: read
    }
    let response = await fetch('http://localhost:3000/flag', {
        method: 'POST', 
        mode: 'cors',
        headers: headers, 
        body: JSON.stringify(data)
    })
    return response.status
}

async function postButton() {
    let message = document.getElementById('message').value;
    if(message.length > 140 || message.length === 0) {
        document.getElementById('BadMessage').innerHTML = 'Ditt meddelande ska vara mellan 1 och 140 tecken!'
    }
    else {

        let response = await postMessage(message)
        console.log(response)
        if (response.status == 200){
            const d = new Date()
            console.log(response.status)
            createListItem(message, d.toDateString(), response.body, false)
        }
        else{
            document.getElementById('BadMessage').innerHTML = 'Inga fula ord, dumsnut!'
        }
        
        
    }
}

function createListItem(message, date, id, read) {
    console.log(read)
    let message_list = document.getElementById("messages_list")

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
    
    col1.innerHTML = '<p><small class="text-body-secondary">Alex the Great</small></p><input type="hidden" id="id" value="' + id + 
    '"/> <h4>' + message + '</h4><p><small class="text-body-secondary">Posted at ' + d2 + '</small></p>'
    col1.setAttribute('class', 'col')
    row.appendChild(col1)

    let col2 = document.createElement('div')
    col2.setAttribute('class', 'col col2')

    let checkbox = document.createElement('div')
    checkbox.setAttribute('class', 'form-check')
    if (read) {
        div.classList.add('checked')
        checkbox.innerHTML = '<input class="form-check-input" type="checkbox" value="" id="c-' + id + 
        '" onclick="checkBox(this)" checked><label class="form-check-label" for="flexCheckDefault"></label>'
    }
    else{
        checkbox.innerHTML = '<input class="form-check-input" type="checkbox" value="" id="c-' + id + 
        '" onclick="checkBox(this)"><label class="form-check-label" for="flexCheckDefault"></label>'
    }
    
    
    col2.appendChild(checkbox)
    row.appendChild(col2)
    
    message_list.insertBefore(entry, message_list.firstChild)

}


async function checkBox(box){
    let isChecked = document.getElementById(box.id);
    let splitted = box.id.split('-')
    let messageBox = document.getElementById(splitted[1])
    let status = await flagMessage(splitted[1], box.checked)
    if(status != 200) {
        return 
    }

    if (box.checked){
        messageBox.classList.add('checked')
    }
    else{
        messageBox.classList.remove('checked')
    }
}

window.onload = async () => {
    let messages = await getAll()
    for (message of messages){
        createListItem(message.message, message.date, message._id, message.read)
    }

}