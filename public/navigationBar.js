function addElement(address, name, parent) {
    const linkHtmlElement = document.createElement("a");
    linkHtmlElement.href = address;
    linkHtmlElement.append(name);
    if (name === "Catch The Bananas (Scratch)") {
        linkHtmlElement.target = "_blank";
    }
    //function invocation goes after declarations and appending of parent elements
    parent.appendChild(linkHtmlElement);
}
const ipAddress = "https://michaelzhangserver.herokuapp.com";

const navBarContainer = document.createElement("nav");
navBarContainer.id = "navBar";
const homeButton = document.createElement("button");
homeButton.id = "HomeButton";
homeButton.append("Home");

const infoDropdown = document.createElement("div");
infoDropdown.id = "InfoDropdown";
const infoDropdownButton = document.createElement("button");
infoDropdownButton.id = "InfoDropdownButton";
infoDropdownButton.append("Infographics 📄");
const infoDropdownContent = document.createElement("div");
infoDropdownContent.id = "InfoDropdownContent";

const toolsDropdown = document.createElement("div");
toolsDropdown.id = "ToolsDropdown";
const toolsDropdownButton = document.createElement("button");
toolsDropdownButton.id = "ToolsDropdownButton";
toolsDropdownButton.append("Tools 🔨");
const toolsDropdownContent = document.createElement("div");
toolsDropdownContent.id = "ToolsDropdownContent";

const gameDropdown = document.createElement("div");
gameDropdown.id = "GameDropdown";
const gameDropdownButton = document.createElement("button");
gameDropdownButton.id = "GameDropdownButton";
gameDropdownButton.append("Games 🎮");
const gameDropdownContent = document.createElement("div");
gameDropdownContent.id = "GameDropdownContent";

document.getElementById("navContainer").appendChild(navBarContainer);
navBarContainer.appendChild(homeButton);
navBarContainer.appendChild(infoDropdown);
infoDropdown.appendChild(infoDropdownButton);
infoDropdown.appendChild(infoDropdownContent);
navBarContainer.appendChild(toolsDropdown);
toolsDropdown.appendChild(toolsDropdownButton);
toolsDropdown.appendChild(toolsDropdownContent);
navBarContainer.appendChild(gameDropdown);
gameDropdown.appendChild(gameDropdownButton);
gameDropdown.appendChild(gameDropdownContent);

//add stuff to dropdown lists
addElement(ipAddress + "pokemon", "Pokemon Info", infoDropdownContent);
addElement(ipAddress + "catchBananas", "Catch The Bananas!", gameDropdownContent);
addElement("https://scratch.mit.edu/projects/366161531/", "Catch The Bananas (Scratch)", gameDropdownContent);
addElement(ipAddress + "coinFlip", "Flip a Coin!", gameDropdownContent);
addElement(ipAddress + "clicker", "Clicker Game", gameDropdownContent);
addElement(ipAddress + "hangman", "Hangman!", gameDropdownContent);
addElement(ipAddress + "admin", "Log In", gameDropdownContent);
addElement(ipAddress + "imagePaster", "Image Pasting Tool", toolsDropdownContent);
$("#HomeButton").click(() => window.location = ipAddress);
//$("#InfoDropdownButton").click(() => window.location = ipAddress + "info/");
$("#GameDropdownButton").click(() => window.location = ipAddress + "games/");