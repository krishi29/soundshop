/** Add any JavaScript you need to this file. */

var userSelection = {};
var availableCategories = {};

function setupPage() {
    var productsDiv = document.getElementById("products");
    productsDiv.innerHTML = "";
    var categoryDiv = document.getElementById("categorySection");
    categoryDiv.innerHTML = "";
    setupCheckboxes();
    showAllProducts();
    setupProductTopNavOptions();
}

function setupProductTopNavOptions() {
    var coll = document.getElementById("product-menulink");

    coll.addEventListener("mouseover", function() {
        this.classList.toggle("active");
        var content = document.getElementById("product-topnav-section-div");
        content.style.maxHeight = content.scrollHeight + "px";
        var contentSection = document.querySelector(".content-section");
        contentSection.style.opacity = 0.2;
    });

    var topnavProductDiv = document.getElementById(
        "product-topnav-section-div"
    );

    topnavProductDiv.addEventListener("mouseleave", function() {
        if (this.style.maxHeight) {
            this.style.maxHeight = null;
            var contentSection = document.querySelector(".content-section");
            contentSection.style.opacity = 1;
        }
    });
}

function selectProductMenu(key, value) {
    for (let item in availableCategories) {
        selectAll(item);
    }
    var content = document.getElementById("product-topnav-section-div");
    content.style.maxHeight = null;
    var contentSection = document.querySelector(".content-section");
    contentSection.style.opacity = 1;
    selectOne(key, value);
}

function setupCollapsibleButtons() {
    var coll = document.getElementsByClassName("collapsible");
    var i;

    for (i = 0; i < coll.length; i++) {
        coll[i].addEventListener("click", function() {
            this.classList.toggle("active");
            var content = this.nextElementSibling;
            if (content.style.maxHeight) {
                content.style.maxHeight = null;
            } else {
                content.style.maxHeight = content.scrollHeight + "px";
            }
        });
    }
}

function toggleSlideoutForm() {
    var buttonDiv = document.querySelector(".contact-flyout-button-div");
    var contentSection = document.querySelector(".content-section");
    if (buttonDiv.style.minWidth !== "0px") {
        buttonDiv.style.minWidth = "0px";
        contentSection.style.opacity = 0.2;
    } else {
        buttonDiv.style.minWidth = "100%";
        contentSection.style.opacity = 1;
    }
}

function setupCheckboxes() {
    availableCategories.type = new Set();
    availableCategories.subType = new Set();
    availableCategories.Brand = new Set();
    availableCategories.Connection = new Set();

    for (let product of productsData) {
        availableCategories.type.add(product.type);
        availableCategories.subType.add(product.categories.subType);
        availableCategories.Brand.add(product.categories.brand);
        availableCategories.Connection.add(product.categories.connection);
    }

    for (let key in availableCategories) {
        addCheckBoxes(key, availableCategories[key]);
        userSelection[key] = Array.from(availableCategories[key]);
    }

    setupCollapsibleButtons();
}

function updateSelection(key, value, checkBoxItem) {
    if (!userSelection[key]) {
        userSelection[key] = [];
    }
    if (checkBoxItem.checked) {
        userSelection[key].push(value);
    } else {
        if (userSelection[key].length == 1) {
            checkBoxItem.checked = true;
            return;
        }
        userSelection[key] = userSelection[key].filter(e => e !== value);
    }

    filterBySelection();
}

function filterBySelection() {
    for (let item of productsData) {
        var typeMatch =
            !userSelection["type"] || userSelection["type"].includes(item.type);
        var subTypeMatch =
            !userSelection["subType"] ||
            userSelection["subType"].includes(item.categories.subType);
        var connectionMatch =
            !userSelection["Connection"] ||
            userSelection["Connection"].includes(item.categories.connection);
        var brandMatch =
            !userSelection["Brand"] ||
            userSelection["Brand"].includes(item.categories.brand);

        if (typeMatch && subTypeMatch && connectionMatch && brandMatch) {
            document.getElementById(item.id).classList.remove("invisible");
        } else {
            document.getElementById(item.id).classList.add("invisible");
        }
    }
}

function setAllCheckBoxes(key, checked) {
    var categoryDiv = document.getElementById(key);
    var checkBoxList = categoryDiv.querySelectorAll('input[type="checkbox"]');
    for (let item of checkBoxList) {
        item.checked = checked;
    }
}

function selectAll(key) {
    setAllCheckBoxes(key, true);
    userSelection[key] = Array.from(availableCategories[key]);
    filterBySelection();
}

function selectOne(key, value) {
    setAllCheckBoxes(key, false);
    var target = document.getElementById(key + "_" + value);
    target.checked = true;
    userSelection[key] = [];
    userSelection[key].push(value);
    filterBySelection();
}

function addCheckBoxes(key, valueSet) {
    var categorySection = document.getElementById("categorySection");

    var categoryButton = document.createElement("button");
    categoryButton.setAttribute("class", "collapsible");
    categoryButton.innerText = categoryLabels[key] ? categoryLabels[key] : key;

    categorySection.appendChild(categoryButton);

    var categoryDiv = document.createElement("div");
    categoryDiv.setAttribute("id", key);
    categoryDiv.setAttribute("class", "content");

    var selectAllDiv = document.createElement("div");
    selectAllDiv.setAttribute("class", "selectAllDiv");

    var selectAllAnchor = document.createElement("a");
    selectAllAnchor.innerText = "Select All";
    selectAllAnchor.onclick = function() {
        selectAll(key);
    };

    selectAllDiv.appendChild(selectAllAnchor);
    categoryDiv.appendChild(selectAllDiv);

    for (let value of valueSet) {
        var checkBoxDiv = document.createElement("div");

        var checkBoxInput = document.createElement("input");
        checkBoxInput.setAttribute("type", "checkbox");
        checkBoxInput.setAttribute("id", key + "_" + value);
        checkBoxInput.setAttribute("name", value);
        checkBoxInput.setAttribute(
            "onclick",
            "updateSelection('" + key + "','" + value + "',this)"
        );
        checkBoxInput.setAttribute("checked", true);

        checkBoxDiv.appendChild(checkBoxInput);

        var labelElement = document.createElement("label");
        labelElement.setAttribute("for", key + "_" + value);
        labelElement.innerText = categoryLabels[value]
            ? categoryLabels[value]
            : value;

        var selectOnlySpan = document.createElement("span");
        selectOnlySpan.setAttribute("class", "selectOnlySpan");
        selectOnlySpan.innerText = "only";
        selectOnlySpan.onclick = function() {
            selectOne(key, value);
        };

        labelElement.appendChild(selectOnlySpan);
        checkBoxDiv.appendChild(labelElement);

        categoryDiv.appendChild(checkBoxDiv);
    }

    categorySection.appendChild(categoryDiv);
}

function plusSlides(productId) {
    var activeIdx = getCurrentCarouselIdx(productId);
    showSlides(productId, activeIdx + 1);
}

function prevSlide(productId) {
    var activeIdx = getCurrentCarouselIdx(productId);
    var nextIdx = activeIdx - 1;
    if (nextIdx === -1) {
        nextIdx = 2;
    }
    showSlides(productId, nextIdx);
}

function showSlides(productId, n) {
    var carousel = document.getElementById(productId + "-carousel");
    var images = carousel.getElementsByTagName("IMG");
    if (images.length === 1) {
        return;
    } else {
        n = n % images.length;
    }
    for (let element of images) {
        element.setAttribute("class", "inactiveimage");
    }
    images[n].setAttribute("class", "activeimage");

    var dots = document
        .getElementById(productId + "-dots")
        .getElementsByTagName("SPAN");
    for (let element of dots) {
        if (element.getAttribute("class")) {
            element.setAttribute("class", "dot");
        }
    }
    dots[n].setAttribute("class", dots[n].getAttribute("class") + " activedot");
}

function getCurrentCarouselIdx(productId) {
    var carousel = document.getElementById(productId + "-carousel");
    var images = carousel.getElementsByTagName("IMG");

    var activeIdx = 0;
    for (let element of images) {
        if (element.className === "activeimage") {
            break;
        }
        activeIdx++;
    }

    return activeIdx;
}

function showAllProducts() {
    showProducts(productsData);
}

function showProducts(products) {
    var productsDiv = document.getElementById("products");

    for (var i = 0; i < products.length; i++) {
        var element = this.productsData[i];

        //Create element for product card and set attributes
        var productCard = document.createElement("div");
        productCard.setAttribute("class", "product-card");
        productCard.setAttribute("id", element.id);

        //create div for images
        var imagesDiv = createProductImageCarouselElement(
            element.id,
            element.images
        );
        productCard.appendChild(imagesDiv);

        //create div for dots
        var dotsDiv = createDotSpan(element.id, element.images);
        productCard.append(dotsDiv);

        //create div for details
        var detailDiv = createProductDetailslElement(element);
        productCard.appendChild(detailDiv);

        //append product card to products div
        productsDiv.appendChild(productCard);
    }
}

function createProductDetailslElement(element) {
    var detailDiv = document.createElement("div");
    detailDiv.setAttribute("class", "product-details");

    var ulElement = document.createElement("ul");

    var nameElement = document.createElement("li");
    nameElement.innerText = element.name + "  -  $" + element.price;
    ulElement.appendChild(nameElement);

    var priceElement = document.createElement("li");
    priceElement.setAttribute("class", "itemDescription");
    priceElement.innerText = element.description;
    ulElement.appendChild(priceElement);

    detailDiv.appendChild(ulElement);

    return detailDiv;
}

var imageFolder = "./images/products/";
function createProductImageCarouselElement(productId, images) {
    var imagesDiv = document.createElement("div");
    imagesDiv.setAttribute("class", "product-images");

    var imagesCarousel = document.createElement("div");
    imagesCarousel.setAttribute("id", productId + "-carousel");

    var idx;
    for (idx = 0; idx < images.length; idx++) {
        var image = images[idx];
        var imgElement = document.createElement("img");
        imgElement.setAttribute("src", imageFolder + image);
        if (idx === 0) {
            imgElement.setAttribute("class", "activeimage");
        } else {
            imgElement.setAttribute("class", "inactiveimage");
        }
        imagesCarousel.appendChild(imgElement);
    }
    imagesDiv.appendChild(imagesCarousel);

    var prevControl = document.createElement("a");
    prevControl.setAttribute("class", "prev");
    prevControl.setAttribute("onClick", "prevSlide('" + productId + "')");
    prevControl.appendChild(document.createTextNode("\u276E"));

    imagesDiv.appendChild(prevControl);

    var nextControl = document.createElement("a");
    nextControl.setAttribute("class", "next");
    nextControl.setAttribute("onClick", "plusSlides('" + productId + "')");
    nextControl.appendChild(document.createTextNode("\u276F"));

    imagesDiv.appendChild(nextControl);

    return imagesDiv;
}

function createDotSpan(productId, images) {
    var dots = document.createElement("div");
    dots.setAttribute("id", productId + "-dots");
    dots.setAttribute("class", "slidedots");

    var idx = 0;
    for (idx = 0; idx < images.length; idx++) {
        var dot = document.createElement("span");
        dot.setAttribute("class", "dot");
        dot.setAttribute(
            "onClick",
            "showSlides('" + productId + "'," + idx + ")"
        );
        dots.appendChild(dot);
    }
    return dots;
}
