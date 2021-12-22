(function create(){
	function br(e){var br=document.createElement("br");e.appendChild(br);}
	var div = document.createElement("div");
	div.style.position="absolute";
	div.style.top=0;
	div.style.left=0;
	div.style.width="400px";
	div.style.display="flex";
	div.style.flexDirection="column";
	div.style.alignItems="flex-end";
	div.id="navigationContainer";

	var cardCreator = document.createElement("a");
	var deckCreator = document.createElement("a");
	var deckViewer = document.createElement("a");
	cardCreator.href="http://"+window.location.host+"/cardCreator";
	deckCreator.href="http://"+window.location.host+"/deckCreator";
	deckViewer.href="http://"+window.location.host+"/deckViewer";
	cardCreator.append("Card Creator");
	deckCreator.append("Deck Creator");
	deckViewer.append("View Created Decks!")
	document.body.appendChild(div);
	div.appendChild(cardCreator);br(div);div.appendChild(deckCreator);br(div);div.appendChild(deckViewer);
	window.onload=function(){
		div.style.left=(window.innerWidth-div.clientWidth)+"px";
		cardCreator.className="navigationLink";
		deckCreator.className="navigationLink";
		deckViewer.className="navigationLink";
	}
	/*
	cardCreator
	deckCreator
	deckViewer
	<link rel="stylesheet" type="text/css" href="http://72.74.171.56:12232/navigation.css">
	<script src="http://72.74.171.56:12232/navigation.js"></script>
	*/
})();