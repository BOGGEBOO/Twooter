
// sidor vi vill ha:
// login (finns)
// profil/meddelanden/lista över vänner
// vänförfrågningar
// sök efter användare

// Globala variabler: 
let currentUser = ''
let allUsers = []

// "Globala funktioner": 

async function postFunc(data, path) {
    let headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',                                                                                                
    }
    let url = 'http://localhost:3000/' + path
    let response = await fetch(url, 
        {
            method: 'POST', 
            mode: 'cors', 
            headers: headers, 
            body: JSON.stringify(data)
        }
    ).then(response => response.json())
    .catch(err => console.log('POST: ' + err))
    
    return response.success
}

async function getFunc(path) {
    let url = 'http://localhost:3000/' + path
    let response = await fetch(url, 
        {method: 'GET', mode: 'cors'}
    ).then((response) => response.json())
    .catch((err) => console.log(err))
    return response
}

// Funktioner för inloggning: 

async function logIn(newUser) {
    let uNameInput = document.getElementById('username')
    let username = uNameInput.value
    

    let pWordInput = document.getElementById('password')
    let password = pWordInput.value

    let path = 'login'
    if(newUser) {
        path = 'signin'
    }

    encP = window.btoa(password)
    let data = {
        username: username, 
        password: encP
    }

    let success = await postFunc(data, path)
    // success = success.success

    // console.log(success)

    if(!success) {
        // felmeddelande
        // om login: fel användarnamn/lösenord
        // om signin: användarnamnet finns redan
    }
    else {
        currentUser = username
        sessionStorage.setItem('currentUser', username)
        sessionStorage.setItem('visitedProfile', username)
        window.location = 'profilePage.html'
    }
}

window.onload = async () => {
    currentUser = sessionStorage.getItem('currentUser')
}