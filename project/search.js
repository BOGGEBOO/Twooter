

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
    let searchList = document.getElementById('searchList')
    while (searchList.firstChild){
        searchList.removeChild(searchList.firstChild)
    }
    let userName = document.getElementById('username').value
    console.log(userName)
    let response = await getFuncData(userName, 'findUsers')
    console.log(response.userNames)
    // createSearchItem(response.userNames[0])
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
    let searchList = document.getElementById("searchList")

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
    '" onclick="sendReq(' + name + ')">'
    
    
    col2.appendChild(button)
    row.appendChild(col2)
    
    searchList.insertBefore(entry, searchList.firstChild)
 }