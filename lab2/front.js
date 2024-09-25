
async function getAll(path) {
    console.log("3 test print")
    let messages = fetch('/getall', {method: 'GET', mode: 'cors'})
                    .then((response) => response.json())
                    // .then((data) => data)
                    .catch((err) => console.log(err))
    console.log(messages)
}

async function postButton() {
    let message = document.getElementById('message').value;
    if(message.length > 140 || message.length === 0) {
        document.getElementById('BadMessage').innerHTML = 'Ditt meddelande ska vara mellan 1 och 140 tecken!'
    }
    else {

        //TODO: skicka meddelandet till servern
        //TODO: uppdatera listan

        await getAll('/getall')

        let message_list = document.getElementById("messages_list")

        let entry = document.createElement('li')

        let div = document.createElement('div')
        div.setAttribute('class', 'container p-3 my-3 border')
        entry.appendChild(div)

        let row = document.createElement('div')
        row.setAttribute('class', 'row justify-content-center align-items-center g-2')
        div.appendChild(row)

        let col1 = document.createElement('div')
        // byt ut [namn], titel och [datum] mot faktisk information från messages
        col1.innerHTML = '<p><small class="text-body-secondary">[namn]</small></p> <h4>titel</h4><p><small class="text-body-secondary">[datum]</small></p>'
        col1.setAttribute('class', 'col')
        row.appendChild(col1)

        let col2 = document.createElement('div')
        col2.setAttribute('class', 'col')
        col2.setAttribute('id', 'checkbox')

        let checkbox = document.createElement('div')
        checkbox.setAttribute('class', 'form-check')
        checkbox.innerHTML = '<input class="form-check-input" type="checkbox" value="" id="isRead" onclick="checkBox()"><label class="form-check-label" for="flexCheckDefault"></label>'
        
        col2.appendChild(checkbox)
        row.appendChild(col2)
        
        message_list.appendChild(entry)
        
    }
}

function checkBox(){
    let isChecked = document.getElementById("isRead");
    if (isChecked.checked == true){
        //is checked, mark unread
    }
    else{
        //no checked, mark read
    }
}