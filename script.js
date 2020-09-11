const searchElem = document.getElementById("search");
const selectorElem = document.getElementById("episode-selector");
const rootElem = document.getElementById("root");
const epNumSpan = document.getElementById("ep-num");

async function setup() {
  allEpisodes = await fetchEpisodes("https://api.tvmaze.com/shows/82/episodes");
  makePageForEpisodes(allEpisodes);

  searchElem.addEventListener("input", displayFoundEpisodes);

  selectorElem.onchange = function() {
    window.location.href = this.value;
  }
}

async function fetchEpisodes(url) {
  let jsonData;    
  await fetch(url)
    .then(response => response.json())
    .then(json => jsonData = json)
  return jsonData;
}

function makePageForEpisodes(episodeList) {
  epNumSpan.textContent = `${episodeList.length}/${episodeList.length}`;
  for(i = 0; i < episodeList.length; ++i) {
    rootElem.appendChild(createEpisodeElement(episodeList[i]));
    selectorElem.innerHTML += 
      `<option value="#${episodeList[i].id}">
      S${formatNumber(episodeList[i].season)}E${formatNumber(episodeList[i].number)} - ${episodeList[i].name}
      </option>`
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
  const episodeList = allEpisodes;
  rootElem.innerHTML = "";

  var keyword = searchElem.value;
  var foundEpisodes = searchEpisodes(keyword, episodeList);

  epNumSpan.textContent = `${foundEpisodes.length}/${episodeList.length}`;
  for(i = 0; i < foundEpisodes.length; ++i) {
    rootElem.appendChild(createEpisodeElement(foundEpisodes[i]));
  }
}

function searchEpisodes(keyword, episodeList) {
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
