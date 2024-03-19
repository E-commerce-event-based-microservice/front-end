const contact_submit = document.querySelector('#contact_submit');
const order_submit = document.querySelector('#order_submit')

fetch('http://localhost:8089/products')
    .then(responseProduct => {
       return responseProduct.json();
    })
    .then(productData => {
        console.log(productData);
        productData.forEach(product => {
            const markup = `
            
                <div class="col-md-10">
                    <div class="card card-body">
                        <div class="media align-items-center align-items-lg-start text-center text-lg-left flex-column flex-lg-row">
                            <div class="mr-2 mb-3 mb-lg-0">
                             
                                <img src="images/crvena_knjiga.jpg" width="150" height="150" alt="">
                           
                            </div>

                            <div class="media-body">
                                <h6 class="text-dark">${product.name}</h6>
                                <p class="mb-3">${product.price}$</p>
                                <p class="mb-3">${product.description}</p>
                            </div>

                            <div class="mt-3 mt-lg-0 ml-lg-3 text-center">
                                <button type="button" class="btn btn-warning mt-4 text-dark" id = "addCrt"><i class="icon-cart-add mr-2"></i> Add to cart</button>
                            </div>
                        </div>
                    </div>
                </div>`;

            document.querySelector('#test').insertAdjacentHTML('beforeend', markup);
        })
    })
    .catch(error => console.log(error));

fetch('http://localhost:8089/orders')
    .then(responseOrder => {
        return responseOrder.json();
    })
    .then(orderData => {
        console.log(orderData);
        orderData.forEach(order => {
            const markup2 = `
            <tbody>
                <th scope="row">${order.orderId}</th>
                <td>${order.status}</td>
                <td>${order.date}</td>
                <td>${order.price}</td>
            </tbody>`;

            document.querySelector('#order_table').insertAdjacentHTML('beforeend', markup2);
        })
    })
    .catch(error => console.log(error));


const sendMessage = async() => {

    let client_name = document.getElementById("client_name").value
    let client_mail = document.getElementById("client_mail").value
    let client_message = document.getElementById("clinet_message").value

    let x = client_mail.valu

    let response = await fetch('http://localhost:8081/send_notification', {
        method: 'POST',
        headers:{
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            status: client_mail,
            date: client_name,
            price: client_message  
        })

    })

    console.log(response);

}

const sendOrder = async() => {

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
              "billingAddressId": 12341265,
              "shippingAddressId": 5444341221
        })
    })

    console.log(response);
}

var removeCartItemButtons = document.getElementsByClassName('btn-danger')
    for (var i = 0; i < removeCartItemButtons.length; i++) {
        var button = removeCartItemButtons[i]
        button.addEventListener('click', removeCartItem)
    }

document.getElementsByClassName('btn-purchase')[0].addEventListener('click', purchaseClicked)


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

contact_submit.addEventListener('click', sendMessage);




