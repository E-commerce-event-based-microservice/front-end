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
    deleteCookie("cart");
    deleteCookie("number");
    window.location.href = "login.html";
}


const sendMessage = async() => {

    let client_name = document.getElementById('client_name').value
    let client_mail = document.getElementById('client_mail').value
    let client_message = document.getElementById('client_message').value

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
function order(obj){
    //console.log(obj)
    const cartData = getCookie("cart");
    let user_id = getCookie("ID");
    let email = getCookie("username")
    let items = "";
    //console.log(cartData);
    if(cartData === null){
        alert("There are no items in a cart!")
    }else{
        const jsonCartData = JSON.parse(cartData);
        const arrayJsonCartData = Array.from(jsonCartData["details"]);
        console.log("length" + arrayJsonCartData.length);
        let product = arrayJsonCartData[0];
        let temp = product.id.toString();
            //console.log(product.id)
        if(arrayJsonCartData.length>1) {
            items = "{\"details\":[" + "{" + "\"itemId\":" + temp + "," + "\"num\":" + obj[product.id] + "}" + ","
            for (let j = 1; j < (arrayJsonCartData.length-1); j++) {
                product = arrayJsonCartData[j];
                temp = product.id.toString()
                items = items + "{" + "\"itemId\":" + temp + "," + "\"num\":" + obj[product.id] + "},"

            }
            product = arrayJsonCartData[arrayJsonCartData.length-1];
            temp = product.id.toString()
            items = items + "{" + "\"itemId\":" + temp + "," + "\"num\":" + obj[product.id] + "}"
            }else{items = "{\"details\":[" + "{" + "\"itemId\":" + temp + "," + "\"num\":" + obj[product.id] + "}"}

        items = items + "],\"billingAddressId\": 12341265,\"shippingAddressId\": 5444341221, \"userId\":" + user_id + ", \"email\": \"" + email + "\"}"


    }
    let jsonItems = JSON.parse(items)
    //console.log(jsonItems)



    const sendOrder = async() => {
        //console.log(obj);
        let user_id = getCookie("ID");
        let email = getCookie("username")
        let response = await fetch('http://localhost:8089/orders', {
            method: 'POST',
            headers:{
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(jsonItems)
        })


        console.log(response);
    }
    sendOrder()
}


function removeCartItem(event) {
    var buttonClicked = event.target
    var shopItem = buttonClicked.parentElement.parentElement
    var productID = shopItem.getElementsByClassName('cart-id')[0].innerText

    id = productID.slice(4);

    buttonClicked.parentElement.parentElement.remove()
    const cartData = getCookie("cart");
    console.log(cartData);
    if(cartData === null){
    }else{
        const jsonCartData = JSON.parse(cartData);
        const arrayJsonCartData = Array.from(jsonCartData["details"]);
        console.log("length" + arrayJsonCartData.length);
        let newCart = "";
        for(let i = 0; i < arrayJsonCartData.length; i++) {
            let product = arrayJsonCartData[i];
            if (product.id === id) {
                arrayJsonCartData.splice(i, 1);
                if(arrayJsonCartData.length>0){

                    if(arrayJsonCartData.length>1) {
                        newCart = "{\"details\":[" + JSON.stringify(arrayJsonCartData[0]) + ","
                        for (let j = 1; j < (arrayJsonCartData.length-1); j++) {

                            newCart = newCart + JSON.stringify(arrayJsonCartData[j]) + ","

                        }
                        newCart = newCart + JSON.stringify(arrayJsonCartData[arrayJsonCartData.length - 1])
                    }else{newCart = "{\"details\":[" + JSON.stringify(arrayJsonCartData[0])}

                    newCart = newCart + "]}"
                    let temp = getCookie("number")
                    deleteCookie("number")
                    setCookie("number",temp-1,365)
                    deleteCookie("cart");
                    setCookie("cart", newCart,365)
                    console.log(getCookie("cart"))
                    console.log("current number of cart items" + getCookie("number"))

                }else{
                    deleteCookie("cart")
                    deleteCookie("number")
                    console.log(getCookie("cart"))
                    console.log("current number of cart items" + getCookie("number"))
                }
                updateCartTotal()
                return
            }

        }
    }

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
    var obj = {}
    var numberOfCartItems = parseInt(getCookie("number"))

    for(var i = 0; i < numberOfCartItems; i++){
        obj[document.getElementsByClassName('cart-id')[i].innerText.slice(4)] = document.getElementsByClassName('cart-quantity-input')[i].value
    }

    var cartItems = document.getElementsByClassName('cart-items')[0]
    while (cartItems.hasChildNodes()) {
        cartItems.removeChild(cartItems.firstChild)
    }

    updateCartTotal()
    order(obj)
}

function addToCartClicked(event){
    var button = event.target
    var shopItem = button.parentElement.parentElement
    var title = shopItem.getElementsByClassName('shop-item-title')[0].innerText
    var price = shopItem.getElementsByClassName('shop-item-price')[0].innerText
    var productID = shopItem.getElementsByClassName('shop-item-id')[0].innerText
    var imageSrc = shopItem.getElementsByClassName('shop-item-image')[0].src

    let temp = getCookie("number")
    let intergerTemp = parseInt(temp)
    if(temp === null){
        setCookie("number", 1,365 )
    }else{
        deleteCookie("number")
        intergerTemp = intergerTemp + 1
        setCookie("number", intergerTemp,365)
    }

    console.log("Current cart item number:" + getCookie("number"))

    addItemToCart(productID, title, price)
    //updateCartTotal()
}
function addItemToCart(itemID, name, price){
    //deleteCookie("cart");
    const newPrice = price.slice(0,-1)
    const obj = {
        details: [
            {
                name: name,
                price: newPrice,
                id: itemID
            }
        ]

    };
    const jsonString = JSON.stringify(obj);
    const currentCart  = getCookie("cart");
    //console.log("current Cart " + currentCart)
    if (currentCart === null){
        setCookie("cart", jsonString, 365);
    }else{

        const jsonCartData = JSON.parse(currentCart);
        const arrayJsonCartData = Array.from(jsonCartData["details"]);
        console.log("length" + arrayJsonCartData.length);
        for(let i = 0; i < arrayJsonCartData.length; i++) {
            let product = arrayJsonCartData[i];
            if (product.name === name) {
                alert('This item is already added to the cart')
                return
            }
        }
        const objSmall = {
            name: name,
            price: newPrice,
            id: itemID
        }
        jsonCartData['details'].push(objSmall);
        const temp = JSON.stringify(jsonCartData);
        deleteCookie("cart");
        setCookie("cart", temp, 365);
    }
    console.log("cookie: " + getCookie("cart"));
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











