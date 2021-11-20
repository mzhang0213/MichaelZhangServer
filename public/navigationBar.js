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
const ipAddress = "https://michaelzhangwebsite.herokuapp.com";

const navBarContainer = document.createElement("nav");
navBarContainer.id = "navBar";

const home = document.createElement("div");
const homeButton = document.createElement("button");
homeButton.id = "HomeButton";
homeButton.append("Home");
home.style.display = "inline-block";

home.appendChild(homeButton);
navBarContainer.appendChild(home);

const gameDropdown = document.createElement("div");
gameDropdown.id = "GameDropdown";
const gameDropdownButton = document.createElement("button");
gameDropdownButton.id = "GameDropdownButton";
gameDropdownButton.append("Games 🎮");
const gameDropdownContent = document.createElement("div");
gameDropdownContent.id = "GameDropdownContent";
gameDropdown.style.display = "inline-block";

document.getElementById("navContainer").appendChild(navBarContainer);
navBarContainer.appendChild(gameDropdown);
gameDropdown.appendChild(gameDropdownButton);
gameDropdown.appendChild(gameDropdownContent);

//add stuff to dropdown lists
addElement(ipAddress + "/catchBananas/", "Catch The Bananas!", gameDropdownContent);
addElement("https://scratch.mit.edu/projects/366161531/", "Catch The Bananas (Scratch)", gameDropdownContent);
addElement(ipAddress + "/hangman/", "Hangman!", gameDropdownContent);
/*
addElement(ipAddress + "/coinFlip/", "Flip a Coin!", gameDropdownContent);
addElement(ipAddress + "/clicker/", "Clicker Game", gameDropdownContent);
addElement(ipAddress + "/admin/", "Log In", gameDropdownContent);
*/
document.getElementById("HomeButton").addEventListener("click", () => {
    window.location = ipAddress;
});
/*
document.getElementById("GameDropdownButton").addEventListener("click", ()=>{
    window.location = ipAddress + "/games/";
})
*/