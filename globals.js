
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
    
    return response
}

async function getFunc(path) {
    let url = 'http://localhost:3000/' + path 
    let response = await fetch(url, 
        {method: 'GET', mode: 'cors'}
    ).then((response) => response.json())
    .catch((err) => console.log(err))
    return response
}

async function getFuncData(data, path) {
    let url = 'http://localhost:3000/' + path + "?name=" + data
    let response = await fetch(url, 
        {method: 'GET', mode: 'cors'}
    ).then((response) => response.json())
    .catch((err) => console.log(err))
    return response
}

function checkUser() {
    if(sessionStorage.getItem('visitedProfile') != sessionStorage.getItem('currentUser')) {
        sessionStorage.setItem('visitedProfile', sessionStorage.getItem('currentUser'))
    }
 }

 