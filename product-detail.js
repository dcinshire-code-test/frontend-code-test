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
      document.querySelector('.invalid-size-msg').style.display = 'block';
      return;
    }
    document.querySelector('.invalid-size-msg').style.display = 'none';
    selectedSize.value;
    
    let cartDetails = JSON.parse(sessionStorage.getItem("cartDetails"));
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
    sessionStorage.setItem("cartDetails", JSON.stringify(cartDetails));
    renderCartDetails();
  });

  renderCartDetails();
});

function renderCartDetails() {
  const cartDetails = JSON.parse(sessionStorage.getItem("cartDetails"));
  if (!cartDetails) {
    return;
  }
  const cartDetailTemplate = document.querySelector(
    "#cart-details-template"
  ).innerHTML;
  const template = Handlebars.compile(cartDetailTemplate);

  const renderedHtml = template({
    cartDetails: cartDetails,
  });

  document.querySelector(".cart-details").innerHTML = renderedHtml;
}
