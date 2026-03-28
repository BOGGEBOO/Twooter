

async function sendReq(name) {
    let data = {
        sender: sessionStorage.getItem('currentUser'),
        receiver: name.id,
    }
    let response = await postFunc(data, 'sendFriend')
    console.log(response.success)
}

async function acceptReq(user) {
    let data = {
        sender: currentUser,
        receiver: user,
    }
    let response = await postFunc(data, 'accFriend')
}

async function findUsers() {
    let searchList = document.getElementById('list-tab')
    let child = searchList.lastElementChild
    while (child){
        searchList.removeChild(child)
        child = searchList.lastElementChild
    }
    let userName = document.getElementById('username').value
    let response = await getFuncData(userName, 'findUsers')
    
    for (user of response.userNames){
        if (user == sessionStorage.getItem('currentUser')){
            continue
        }
        else{
            createSearchItem(user)
        }
    }
}

 function createSearchItem(name) {

    let test = document.getElementById('list-tab')
    let test2 = document.createElement('a')
    test2.setAttribute('class', 'list-group-item list-group-item-action')
    test2.setAttribute('onclick', 'sendReq(' + name + ')')
    test2.setAttribute('id', name)
    test2.innerHTML = name
    test.appendChild(test2)
 }

 