document.addEventListener("DOMContentLoaded", async () => {
  const response = await fetch(
    "https://3sb655pz3a.execute-api.ap-southeast-2.amazonaws.com/live/product"
  );
  const product = await response.json();

  document.querySelector(".product-name").innerText = product.title;
  document.querySelector(".price").innerText = `$${product.price}`;
  document.querySelector(".description").innerText = product.description;
  document.querySelector(".image-container img").src = product.imageURL;
  const sizeOptionsTemplate = document.querySelector(
    "#size-option-template"
  ).innerHTML;
  const template = Handlebars.compile(sizeOptionsTemplate);

  const renderedHtml = template({
    sizeOptions: product.sizeOptions,
  });

  document.querySelector(".size-options").innerHTML = renderedHtml;

  document.querySelector(".add-cart-btn").addEventListener("click", () => {
    var selectedSize = document.querySelector('input[name="size"]:checked');
    if (!selectedSize) {
      document.querySelector('.invalid-size-msg').classList.remove("hidden");
      return;
    }
    document.querySelector('.invalid-size-msg').classList.add("hidden");
    selectedSize.value;
    
    let cartDetails = JSON.parse(localStorage.getItem("cartDetails"));
    if (!cartDetails) {
      cartDetails = {
        [selectedSize.value]: {
          imageUrl: product.imageURL,
          title: product.title,
          price: product.price,
          count: 1,
        }
      };
    } else if (!cartDetails[selectedSize.value]) {
      cartDetails[selectedSize.value] = {
        imageUrl: product.imageURL,
        title: product.title,
        price: product.price,
        count: 1,
      };
    } else {
      cartDetails[selectedSize.value].count += 1;
    }
    localStorage.setItem("cartDetails", JSON.stringify(cartDetails));
    renderCartLink();
    renderCartDetails(product.sizeOptions);
  });

  document.querySelectorAll('input[name="size"]').forEach((button) => button.addEventListener("change", (e) => {
    document.querySelector('.selected-size').innerText = e.target.nextElementSibling.innerText;
  }));


  document.querySelector(".my-cart-link").addEventListener("click", () => {
    document.querySelector('.mini-cart-container').classList.toggle("hidden")
  });

  renderCartLink();
  renderCartDetails(product.sizeOptions);
});

document.addEventListener("click", (e) => {
  var myCartLink = document.querySelector(".my-cart-link");
  var miniCartContainer = document.querySelector(".mini-cart-container");
  var target = e.target;
  
  var isMyCartLink = myCartLink.contains(target);
  var isInMiniCart = miniCartContainer.contains(target);
  
  if (!isMyCartLink && !isInMiniCart) {
    miniCartContainer.classList.add("hidden")
  }
});

function renderCartDetails(sizeOptions) {
  const cartDetails = JSON.parse(localStorage.getItem("cartDetails"));
  if (!cartDetails) {
    return;
  }
  const cartDetailTemplate = document.querySelector(
    "#mini-cart-template"
  ).innerHTML;
  const template = Handlebars.compile(cartDetailTemplate);
  for(let sizeId in cartDetails) {
    const size = sizeOptions.find(size => size.id == sizeId);
    cartDetails[sizeId].label = size.label;
  }

  const renderedHtml = template({
    cartDetails: cartDetails,
  });

  document.querySelector(".mini-cart-container").innerHTML = renderedHtml;
}

function renderCartLink() {
  let count = 0;
  const cartDetails = JSON.parse(localStorage.getItem("cartDetails"));
  if (cartDetails) {
    for (var key of Object.keys(cartDetails)) {
      count += cartDetails[key].count;
    }
  }

  document.querySelector("#cart-count").innerText = `(${count})`;
}
