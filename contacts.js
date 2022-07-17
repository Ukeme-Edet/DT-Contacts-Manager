let contactsView = document.querySelector(".contacts-view"), contactPlate = document.querySelector(".contact-plate"), dailpadUp = document.querySelector(".up"), dailpadDown = document.querySelector(".down"), dail = document.querySelector(".dail"), dailDisplay = document.querySelector(".dail-display"), dailButtons = document.querySelectorAll(".dail-digit"), cancel = document.querySelector(".cancel"), load = document.querySelector(".load"), app = document.querySelector(".app"), contactsTab = document.querySelector(".contacts-tab"), favoritesTab = document.querySelector(".favorites-tab"), favorites = document.querySelector(".favorites"), search = document.querySelector(".search"), searchView = document.querySelector(".search-view"), dailSearch = document.querySelector(".dail-search"), options = document.querySelector(".options"), searchIcon = document.querySelector(".search-icon"), contacts, views = [contactsView, favorites], template = document.querySelector(".contact-plate"), favoriteTemplate = document.querySelector(".favorites-card"), contactForm = document.querySelector(".create-contact-form"), newContactName = document.querySelector(".new-contact-name"), numbers = contactForm.querySelector(".numbers"), numberFieldTemp = document.querySelector(".phone-number"), numberFields = document.querySelectorAll(".phone-number"), createContactForm = contactForm.querySelector("form"), formBack = document.querySelector(".form-back"), save = document.querySelector(".save"), cancelTimeOut, back;
if (localStorage.getItem("contacts") == null) {
    localStorage.setItem("contacts", JSON.stringify([]));
}
contacts = JSON.parse(localStorage.getItem("contacts"));
contacts.sort((a, b) => a.name[0] > b.name[0] ? 1 : -1);

document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
        load.classList.add("opened");
    }, 1000);
    setTimeout(() => {
        load.style.display = "none";
        app.style.opacity = "1";
    }, 2000);
});

dailpadUp.addEventListener("click", () => {
    fade(dailpadUp);
    setTimeout(() => {
        dailpadUp.style.display = "none";
        dailTransition();
    }, 100);
});

dailpadDown.addEventListener("click", () => {
    dailTransition();
    setTimeout(() => {
        dailpadUp.style.display = "block";
        fade(dailpadUp);
    }, 250);
});

dailDisplay.addEventListener("focus", event => {
    event.preventDefault();
    dailDisplay.blur();
});

dailButtons.forEach(button => {
    button.addEventListener("click", event => {
        event.preventDefault();
        dailDisplay.value += button.textContent;
        if (dailDisplay.value != "") numberSearch();
        else {
            removeContactsInView(contactsView);
            displayContacts();
        }
    });
});

if (navigator.maxTouchPoints > 1) {
    cancel.addEventListener("touchstart", (event) => {
        let values = dailDisplay.value.split("");
        values.pop();
        dailDisplay.value = values.join("");
        if (dailDisplay.value != "") numberSearch();
        else {
            removeContactsInView(contactsView);
            displayContacts();
        }
        cancelTimeOut = setTimeout(() => {
            dailDisplay.value = "";
        }, 750);
    });

    cancel.addEventListener("touchend", (event) => {
        clearTimeout(cancelTimeOut);
    });
} else {
    cancel.addEventListener("mousedown", (event) => {
        let values = dailDisplay.value.split("");
        values.pop();
        dailDisplay.value = values.join("");
        if (dailDisplay.value != "") numberSearch();
        else {
            removeContactsInView(contactsView);
            displayContacts();
        }
        cancelTimeOut = setTimeout(() => {
            dailDisplay.value = "";
        }, 750);
    });

    cancel.addEventListener("mouseup", (event) => {
        clearTimeout(cancelTimeOut);
    });
}

contactsTab.addEventListener("click", () => {
    if (contactsTab.classList.contains("active") && !contactsTab.classList.contains("invisible")) {
        return;
    } else {
        favorites.style.zIndex = "2";
        contactsTab.classList.add("active");
        contactsView.classList.remove("invisible");
        contactsView.classList.remove("opened");
        favoritesTab.classList.remove("active");
        favorites.classList.add("opened");
        setTimeout(() => favorites.classList.add("invisible"), 500);
        displayContacts();
    }
});

favoritesTab.addEventListener("click", () => {
    if (favoritesTab.classList.contains("active") && !favoritesTab.classList.contains("invisible")) {
        return;
    } else {
        favorites.style.zIndex = "";
        favoritesTab.classList.add("active");
        favorites.classList.remove("invisible");
        favorites.classList.remove("opened");
        contactsTab.classList.remove("active");
        contactsView.classList.add("opened");
        setTimeout(() => contactsView.classList.add("invisible"), 500);
        displayFavorites();
    }
});

search.addEventListener("click", () => {
    let active
    search.focus();
    search.style.width = "85.4%";
    options.style.width = "0%";
    options.style.display = "none";
    searchIcon.childNodes[0].classList.remove("fa-magnifying-glass");
    searchIcon.childNodes[0].classList.add("fa-arrow-left");
    searchView.classList.remove("invisible");
    views.forEach((view) => {
        if (!view.classList.contains("invisible")) active = view
        view.classList.add("invisible");
    });
    searchIcon.addEventListener("click", () => {
        search.blur();
        search.style.width = "73.4%";
        search.value = "";
        setTimeout(() => {
            options.style.width = "12.5%";
            options.style.display = "block";
        }, 100);
        searchView.classList.add("invisible");
        searchView.childNodes.forEach((child) => {
            child.remove();
        });
        views.forEach((view) => {
            if (view == active) view.classList.remove("invisible");
        });
        searchIcon.childNodes[0].classList.remove("fa-arrow-left");
        searchIcon.childNodes[0].classList.add("fa-magnifying-glass");
    });
    searchStart();
});

displayContacts();
displayFavorites();

function fade(element) {
    if (!element.classList.contains("opened")) {
        element.classList.add("opened");
        element.classList.remove("closed");
    } else {
        element.classList.remove("opened");
        element.classList.add("closed");
    }
}

function dailTransition() {
    if (!dail.classList.contains("dail-open")) {
        dail.classList.add("dail-open");
    } else {
        dail.classList.remove("dail-open");
    }
}

function searchStart() {
    search.addEventListener("input", () => {
        removeContactsInView(searchView);
        if (/\S/.test(search.value)) textSearch();
    });
}

function textSearch() {
    let searchValue = search.value;
    let results = contacts.filter(contact => contact.name.toLowerCase().includes(searchValue.toLowerCase().trim()));
    let resultNodes = [];
    for (let result of results) {
        let contactNode = document.createElement("div")
        contactNode.classList.add("contactS")
        let contactHead = document.createElement("h4");
        let contactSub = document.createElement("p");
        contactHead.textContent = result.name;
        let numbers = `Number${result.phoneNumbers.length > 1 ? "s" : ""}: ` + result.phoneNumbers.join(" ");
        contactSub.textContent = numbers;
        contactNode.appendChild(contactHead);
        contactNode.appendChild(contactSub);
        contactNode.addEventListener("click", () => {
            contactCard(contacts.indexOf(result));
        });
        resultNodes.push(contactNode);
    }
    for (let result of resultNodes) {
        searchView.appendChild(result);
    }
}

function contactCard(index) {
    let contact = contacts[index], contactDisplay = document.createElement("div"), top = document.createElement("div"), bottom = document.createElement("div"), backButton = document.createElement("div"), backIcon = document.createElement("i"), favoritesMark = document.createElement("div"), favoriteIcon = document.createElement("i"), edit = document.createElement("div"), editIcon = document.createElement("i"), deleteButton = document.createElement("div"), deleteIcon = document.createElement("i"), userIcon = document.createElement("i"), contactName = document.createElement("h3"), contactNumbers = document.createElement("p");
    backIcon.classList.add("fa-solid", "fa-less-than");
    favoriteIcon.classList.add(`${contact.favorite ? "fa-solid" : "fa-regular"}`, "fa-star");
    editIcon.classList.add("fa-solid", "fa-pen-to-square");
    userIcon.classList.add("fa-regular", "fa-user", "fa-10x");
    deleteIcon.classList.add("fa-solid", "fa-trash");
    backButton.append(backIcon), favoritesMark.append(favoriteIcon), edit.append(editIcon), deleteButton.append(deleteIcon);
    favoritesMark.style.color = contact.favorite ? "gold" : "white";
    backButton.addEventListener("click", () => {
        backClick();
    });
    let buttons = [backButton, favoritesMark, edit, deleteButton];
    buttons.forEach((button) => {
        button != favoritesMark ? button.style.color = "white" : "";
        top.appendChild(button);
    });
    favoritesMark.addEventListener("click", () => {
        contact.favorite = !contact.favorite;
        favoriteIcon.classList.add(`${contact.favorite ? "fa-solid" : "fa-regular"}`);
        favoriteIcon.classList.remove(`${!contact.favorite ? "fa-solid" : "fa-regular"}`)
        favoritesMark.style.color = contact.favorite ? "gold" : "white";
        localStorage.setItem("contacts", JSON.stringify(contacts))
    });
    edit.addEventListener("click", () => {
        contactEdit(index);
        backClick();
    });
    deleteButton.addEventListener("click", () => {
        if (null != prompt("Are you sure you want to delete this contact? ok / cancel")) {
            deleteContact();
            backClick();
        }
    });
    top.appendChild(userIcon);
    top.classList.add("top");
    contactName.textContent = contact.name;
    contact.phoneNumbers.forEach(number => {
        let numberNode = document.createElement("span");
        numberNode.textContent = number;
        numberNode.addEventListener("click", async () => {
            await navigator.clipboard.writeText(numberNode.textContent);
            alert("Number Copied");
        });
        contactNumbers.appendChild(numberNode);
    });
    bottom.classList.add("bottom");
    bottom.appendChild(contactName);
    bottom.appendChild(contactNumbers);
    contactDisplay.classList.add("contact-display");
    contactDisplay.appendChild(top);
    contactDisplay.appendChild(bottom);
    contactDisplay.classList.add("opened");
    app.appendChild(contactDisplay);
    setTimeout(() => contactDisplay.classList.remove("opened"), .1);

    function backClick() {
        contactDisplay.classList.add("opened");
        displayContacts();
        displayFavorites();
        setTimeout(() => {
            contactDisplay.remove();
        }, 500);
    }

    function deleteContact() {
        contacts = contacts.slice(0, index).concat(contacts.slice(index + 1))
        localStorage.setItem("contacts", JSON.stringify(contacts))
    }
}

function numberSearch() {
    removeContactsInView(contactsView);
    let results = contacts.filter(contact => contact.phoneNumbers.some(number => number.includes(dailDisplay.value)));
    let resultNodes = [];
    for (let result of results) {
        let resultNode = createContactPlate(result);
        resultNode.childNodes[1].textContent = result.name;
        resultNode.addEventListener("click", () => {
            contactCard(contacts.indexOf(result));
        });
        resultNodes.push(resultNode);
    }
    resultNodes.forEach(resultNode => contactsView.appendChild(resultNode));
    contactsView.appendChild(createContactBtn());
}

function displayContacts() {
    removeContactsInView(contactsView);
    let contactCreate = createContactBtn();
    contactsView.appendChild(contactCreate);
    contacts.forEach(contact => {
        let node = createContactPlate(contact);
        contactsView.appendChild(node);
    });
    contactsView.childNodes.forEach(child => child != contactCreate ? child.addEventListener("click", () => {contactCard(Number(child.attributes["data-index"].value))}) : "");
}

function removeContactsInView(view) {
    for (let i = view.childNodes.length - 1; i > -1; i--) view.childNodes[i].remove();
}

function createContactBtn() {
    let contactCreate = document.createElement("button");
    let contactCreateIcon = document.createElement("i");
    contactCreateIcon.classList.add("fa-solid", "fa-user-plus");
    let text = document.createElement("p");
    text.textContent = "Create new contact";
    text.appendChild(contactCreateIcon);
    contactCreate.appendChild(text);
    contactCreate.addEventListener("click", () => {
        initialiseCreateContact();
    });
    contactCreate.classList.add("contact-create");
    return contactCreate;
}

function displayFavorites() {
    removeContactsInView(favorites);
    let favoriteC = contacts.filter(contact => contact.favorite);
    favoriteC.forEach(favorite => {
        let node = createFavoriteCard(favorite);
        node.setAttribute("data-index", contacts.indexOf(favorite));
        favorites.appendChild(node);
    });
    favorites.childNodes.forEach(child => child.addEventListener("click", () => {contactCard(Number(child.attributes["data-index"].value))}));
}

function initialiseCreateContact(contact=null) {
    contactForm.classList.remove("invisible");
    if (contact) {
        createContactForm.childNodes[1].childNodes[1].childNodes[3].textContent = "Edit contact";
        newContactName.value = contact.name;
        for (let number of contact.phoneNumbers) {
            let newNumber = createNumberField(number);
            numbers.childNodes.length == 5 ? numbers.childNodes[3].value = newNumber.value : numbers.appendChild(newNumber);
        }
        checkNum()
        checkNumsFull();
    }
    setTimeout(() => contactForm.classList.remove("opened"), .1);
    checkNumsFull();

    function checkNum() {
        if (Array.from(numberFields).every(numberField => numberField.value != "")) {
            let newNumberField = createNumberField();
            numbers.appendChild(newNumberField);
            numberFields = document.querySelectorAll(".phone-number");
        } else {
            for (let i = numberFields.length - 1; i > -1; i--) {
                if (numberFields[i].value == "") numberFields[i].remove();
            }
            let newNumber = createNumberField();
            numbers.appendChild(newNumber);
        }
        checkNumsFull();
    }

    function createNumberField(number=null) {
        let newNumberField = document.createElement("input");
        newNumberField.type = "number";
        newNumberField.name = "phone-number";
        newNumberField.placeholder = "Phone Number";
        numberFields[numberFields.length - 1].required = true;
        newNumberField.classList.add("phone-number");
        number ? newNumberField.value = number : "";
        return newNumberField;
    }

    function checkNumsFull() {
        numberFields = document.querySelectorAll(".phone-number");
        for (let numberField of numberFields) {
            numberField.removeEventListener("input", checkNum);
        }
        for (let numberField of numberFields) {
            numberField.addEventListener("input", checkNum);
        }
    }

    formBack.addEventListener("click", event => {
        event.preventDefault();
        formBackClick();
    });
    
    save.addEventListener("click", event => {
        event.preventDefault();
        if (contactValidate(contact)) {
            let name = newContactName.value;
            let phoneNumbers = [];
            for (let numberField of numberFields) {
                if (numberField.value != "") phoneNumbers.push(numberField.value);
            }
            let newContact = {name, phoneNumbers, "favorite": contact ? contact.favorite : false}
            contact ? contacts[contacts.indexOf(contact)] = newContact : contacts.push(newContact);
            contacts.sort((a, b) => a.name[0] > b.name[0] ? 1 : -1);
            localStorage.setItem("contacts", JSON.stringify(contacts));
            formBackClick();
        }
    });

    function formBackClick() {
        newContactName.value = "";
        numberFields.forEach(numberField => numberField.value = "");
        contactForm.classList.add("opened");
        setTimeout(() => contactForm.classList.add("invisible"), 500);
        displayContacts();
        displayFavorites();
    }
    
    function contactValidate(contact=null) {
        if (newContactName.value == "") {
            alert("Contact Name Cannot Be Blank");
            return false;
        } else if (contacts.some(contacta => contacta.name == newContactName.value) && !contact.name == newContactName.value) {
            alert("Contact Name Already Used");
            return false;
        } else if (Array.from(numberFields).every(numberField => numberField.value == "")) {
            alert("Contact Number Cannot Be Blank");
            return false;
        } else if (Array.from(numberFields).some(numberField => contacts.some(contacta => contacta.phoneNumbers.some(phoneNumbers => phoneNumbers == numberField.value))) && !contact.phoneNumbers.some(number => Array.from(numberFields).some(numberField => numberField.value == number))) {
            alert("Contact number already saved");
            return false;
        } else {
            alert("Saving Contact");
            return true;
        }
    }
}

function createContactPlate(contact) {
    let contactPlate = document.createElement("div");
    let contactIcon = document.createElement("figure");
    let icon = document.createElement("i");
    let textContent = document.createElement("p");
    icon.classList.add("fa-solid", "fa-user", "fa-2x");
    contactIcon.classList.add("contact-icon");
    contactIcon.appendChild(icon);
    textContent.classList.add("contact-name");
    textContent.textContent = contact.name;
    contactPlate.classList.add("contact-plate");
    contactPlate.appendChild(contactIcon);
    contactPlate.appendChild(textContent);
    contactPlate.setAttribute("data-index", contacts.indexOf(contact));
    return contactPlate;
}

function createFavoriteCard(contact) {
    let favoriteCard = document.createElement("div");
    let icon = document.createElement("i");
    let textContent = document.createElement("p");
    icon.classList.add("fa-solid", "fa-user", "fa-3x");
    textContent.textContent = contact.name;
    favoriteCard.classList.add("favorites-card");
    favoriteCard.appendChild(icon);
    favoriteCard.appendChild(document.createElement("br"));
    favoriteCard.appendChild(textContent);
    return favoriteCard;
}

function contactEdit(index) {
    let currentContact = contacts[index];
    initialiseCreateContact(currentContact);
}