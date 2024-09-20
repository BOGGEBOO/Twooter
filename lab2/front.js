
function postButton() {
    let message = document.getElementById('message').value;
    if(message.length > 140 || message.length === 0) {
        document.getElementById('BadMessage').innerHTML = 'Ditt meddelande ska vara mellan 1 och 140 tecken!'
    }
    else {
        //TODO: skicka meddelandet till servern
        //TODO: uppdatera listan
        let item = document.createElement("div");
        
        
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