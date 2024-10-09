
// sidor vi vill ha:
// login (finns)
// profil/meddelanden/lista över vänner
// vänförfrågningar
// sök efter användare

// Globala variabler: 
let currentUser = ''
let allUsers = []

// Funktioner för inloggning: 

async function logInBE(userName, passWord, path) {
    
    let headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',                                                                                                
    }
    let user = {
        username: userName, 
        password: passWord
    }
    let url = 'http://localhost:3000/' + path
    
    let response = await fetch(url, {
        method: 'POST', 
        mode: 'cors',
        headers: headers, 
        body: JSON.stringify(user)
    }).then(response => response.json())
    .catch((err) => console.log('l21 '+ err))

    if(response.success) {
        currentUser = userName
        allUsers.push(userName)
    }

    return response.success
}

async function logIn(newUser) {
    // Om användaren finns sedan innan (eller tror det i alla fall)
    let uNameInput = document.getElementById('username')
    let username = uNameInput.value

    let pWordInput = document.getElementById('password')
    let password = pWordInput.value

    let path = 'login'
    if(newUser) {
        path = 'signin'
    }

    encP = window.btoa(password)
    
    let success = await logInBE(username, encP, path)

    if(!success) {
        // felmeddelande
        // om login: fel användarnamn/lösenord
        // om signin: användarnamnet finns redan
    }
    else {
        // byt sida
        window.location = 'profilePage.html'
    }
}

async function getUsers() {
    let users = await fetch('http://localhost:3000/getUsers', 
                            {method: 'GET', mode: 'cors'}
                        )
                    .then((response) => response.json())
                    .catch((err) => console.log(err))
    return users.userNames
}

window.onload = async () => {
    allUsers = await getUsers()
}


// Funktioner för publicering av meddelanden:
// sno labb 2

// Funktioner för display av meddelanden/vänner:
// sno labb 2 (ish)/vue

// Funktioner för att hitta användare: 

// Funktioner för vänförfågningar: 

export default {currentUser, allUsers}
// export default 