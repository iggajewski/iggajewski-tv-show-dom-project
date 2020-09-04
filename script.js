const episodeList = getAllEpisodes();
const rootElem = document.getElementById("root");
const epNumSpan = document.getElementById("ep-num");

function setup() {
  makePageForEpisodes();

  // document.getElementById("search").addEventListener("submit", function(event) {
  //   event.preventDefault();
  // });

  document.getElementById("search").addEventListener("keypress", displayFoundEpisodes);
}

function makePageForEpisodes() {
  epNumSpan.textContent = `${episodeList.length}/${episodeList.length}`;
  for(i = 0; i < episodeList.length; ++i) {
    rootElem.appendChild(createEpisodeElement(episodeList[i]));
  }
}

// FOR EPISODE DISPLAYING: //

function formatNumber(number) {
  if (number < 10) {
    return "0" + String(number);
  }
  else {
    return String(number);
  }
}

function createEpisodeElement(episode) {
  var episodeDiv = document.createElement("div");
  episodeDiv.setAttribute("class", "episode");
  episodeDiv.setAttribute("id", episode.id);

  var episodeHeader = document.createElement("h2");
  episodeHeader.innerHTML = `${episode.name} - S${formatNumber(episode.season)}E${formatNumber(episode.number)}`;
  episodeDiv.appendChild(episodeHeader);

  var episodeImage = document.createElement("img");
  episodeImage.setAttribute("src", episode.image.medium);
  episodeDiv.appendChild(episodeImage);

  var episodeSummary = document.createElement("p");
  episodeSummary.innerHTML = episode.summary;
  episodeDiv.appendChild(episodeSummary);

  return episodeDiv;
}

// FOR SEARCHING: //

function displayFoundEpisodes() {
  rootElem.innerHTML = "";
  console.log("inside event function");

  var keyword = document.getElementById("search").value;
  var foundEpisodes = searchEpisodes(keyword);

  epNumSpan.textContent = `${foundEpisodes.length}/${episodeList.length}`;
  for(i = 0; i < foundEpisodes.length; ++i) {
    rootElem.appendChild(createEpisodeElement(foundEpisodes[i]));
  }
}

function searchEpisodes(keyword) {
  if(keyword.length === 0) {
    return episodeList;
  }

  keyword = keyword.toLowerCase();
  var newEpisodeList = [];

  for(i = 0; i < episodeList.length; ++i) {
    var episodeDescription = episodeList[i].name.toLowerCase() + episodeList[i].summary.toLowerCase();
    if(episodeDescription.includes(keyword)) {
      newEpisodeList.push(episodeList[i])
    }
  }
  return newEpisodeList;
}


window.onload = setup;
