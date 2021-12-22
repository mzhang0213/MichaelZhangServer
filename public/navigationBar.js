const ipAddress = "https://michaelzhangwebsite.herokuapp.com";

const navBarContainer = document.createElement("nav");
navBarContainer.id = "navBar";

function addElement(address, name, parent) {
    const linkHtmlElement = document.createElement("a");
    linkHtmlElement.href = address;
    linkHtmlElement.append(name);
    if (name === "Catch The Bananas (Scratch)") {
        linkHtmlElement.target = "_blank";
    }
    //function invocation goes after declarations and appending of parent elements
    document.getElementById(parent).appendChild(linkHtmlElement);
}
function createButton(name, displayName){
    const container = document.createElement("div");
    const button = document.createElement("button");
    button.id = name+"Button";
    button.className="navButton";
    button.append(displayName);
    container.style.display = "inline-block";

    container.appendChild(button);
    navBarContainer.appendChild(container);
}
function createDropdown(name, displayName){
    const dropdown = document.createElement("div");
    dropdown.className = "dropdown";
    const dropdownButton = document.createElement("button");
    dropdownButton.className = "dropdownButton";
    dropdownButton.append(displayName);
    const dropdownContent = document.createElement("div");
    dropdownContent.className = "dropdownContent";
    dropdownContent.id=name+"DropdownContent";
    dropdown.style.display = "inline-block";
    
    document.getElementById("navContainer").appendChild(navBarContainer);
    navBarContainer.appendChild(dropdown);
    dropdown.appendChild(dropdownButton);
    dropdown.appendChild(dropdownContent);
}

createButton("home", "Home");

createDropdown("games");
addElement(ipAddress + "/catchBananas/", "Catch The Bananas!", "gamesDropdownContent");
addElement("https://scratch.mit.edu/projects/366161531/", "Catch The Bananas (Scratch)", "gamesDropdownContent");
addElement(ipAddress + "/hangman/", "Hangman!", "gamesDropdownContent");

createButton("spotifyYt", "Cracked Spotify");

createButton("USH", "USH")

document.getElementById("homeButton").addEventListener("click", () => {
    window.location = ipAddress;
});
document.getElementById("spotifyYtButton").addEventListener("click", () => {
    window.location = "https://"+window.location.host+"/spotifyYt";
});
document.getElementById("USHButton").addEventListener("click", () => {
    window.location = "https://"+window.location.host+"/USH";
});