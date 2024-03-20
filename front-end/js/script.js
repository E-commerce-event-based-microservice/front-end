const makeUser = async() => {

    let email = document.getElementById('email').value
    let password = document.getElementById('password').value
    let reset_question = document.getElementById('reset-question').value
    let reset_answer = document.getElementById('reset-answer').value

    let response = await fetch('http://localhost:8080/auth/signup', {
        method: 'POST',
        headers:{
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            
            password: password,
            role: "USER",
            email: email,
            passwordResetQuestion: reset_question,
            passwordResetAnswer: reset_answer
              
        })

    })

    console.log(response);
    window.location.href = "login.html"

}

const logOut = async() => {
    deleteCookie("username");
    deleteCookie("ID");
    window.location.href = "login.html"
}


const sendMessage = async() => {

    let client_name = document.getElementById('client_name').value
    let client_mail = document.getElementById('client_mail').value
    let client_message = document.getElementById('clinet_message').value

    let response = await fetch('http://localhost:8081/send_notification', {
        method: 'POST',
        headers:{
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            receiver: client_mail,
            subject: client_name,
            message: client_message  
        })

    })

    console.log(response);

}

const sendOrder = async() => {
    let user_id = getCookie("ID");
    let response = await fetch('http://localhost:8089/orders', {
        method: 'POST',
        headers:{
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            details: [
                {
                  itemId: 1,
                  num: 1
                },
              ],
            billingAddressId: 12341265,
            shippingAddressId: 5444341221,
            userId: user_id
        })
    })

    console.log(response);
}


function removeCartItem(event) {
    var buttonClicked = event.target
    buttonClicked.parentElement.parentElement.remove()
    updateCartTotal()
}

function updateCartTotal() {
    var cartItemContainer = document.getElementsByClassName('cart-items')[0]
    var cartRows = cartItemContainer.getElementsByClassName('cart-row')
    var total = 0
    for (var i = 0; i < cartRows.length; i++) {
        var cartRow = cartRows[i]
        var priceElement = cartRow.getElementsByClassName('cart-price')[0]
        var quantityElement = cartRow.getElementsByClassName('cart-quantity-input')[0]
        var price = parseFloat(priceElement.innerText.replace('$', ''))
        var quantity = quantityElement.value
        total = total + (price * quantity)
    }
    total = Math.round(total * 100) / 100
    document.getElementsByClassName('cart-total-price')[0].innerText = '$' + total
}

function purchaseClicked() {
    alert('Thank you for your purchase')
    var cartItems = document.getElementsByClassName('cart-items')[0]
    while (cartItems.hasChildNodes()) {
        cartItems.removeChild(cartItems.firstChild)
    }
    updateCartTotal()
    sendOrder()
}

function setCookie(name, value, daysToLive){
    const date = new Date();
    date.setTime(date.getTime() +  (daysToLive * 24 * 60 * 60 * 1000));
    let expires = "expires=" + date.toUTCString();
    document.cookie = `${name}=${value}; ${expires}; path=/`
}

function deleteCookie(name){
    setCookie(name, null, null);
}

function getCookie(name){
    const cDecoded = decodeURIComponent(document.cookie);
    const cArray = cDecoded.split("; ");
    let result = null;
    
    cArray.forEach(element => {
        if(element.indexOf(name) == 0){
            result = element.substring(name.length + 1)
        }
    })
    return result;
}











