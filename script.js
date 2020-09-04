//You can edit ALL of the code here
function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  rootElem.textContent = `Got ${episodeList.length} episode(s)`;

  var episodesElem = document.createElement("div");
  episodesElem.setAttribute("id", "main");
  rootElem.appendChild(episodesElem);

  for(i = 0; i < episodeList.length; ++i) {
    episodesElem.appendChild(createEpisodeElement(episodeList[i]));
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

window.onload = setup;
