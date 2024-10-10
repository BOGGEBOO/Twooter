

async function sendReq(user) {
    let data = {
        sender: currentUser,
        receiver: user,
    }
    let response = await postFunc(data, 'sendFriend')
}

async function acceptReq(user) {
    let data = {
        sender: currentUser,
        receiver: user,
    }
    let response = await postFunc(data, 'accFriend')
}

function findUsers() {
    let userName = document.getElementById('username').value
    console.log(userName)
    let re = RegExp(userName)
    let matches = []
    for(const user of allUsers) {
        if(re.test(user)) {
            matches.push(user)
        }
    }
    console.log(matches)
}
