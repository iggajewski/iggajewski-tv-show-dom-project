/* SETUP: */

const showSelectorElem = document.getElementById("show-selector");
const episodeSelectorElem = document.getElementById("episode-selector");
const searchElem = document.getElementById("search");
const rootElem = document.getElementById("root");
const epNumSpan = document.getElementById("ep-num");

async function setup() {
  allShows =  await fetchShows();
  allEpisodes = await makePageForEpisodes(allShows[0]._links.self.href + "/episodes");

  searchElem.addEventListener("input", displayFoundEpisodes);
  showSelectorElem.addEventListener("input", showSelection);
  episodeSelectorElem.onchange = function() {
    window.location.href = this.value;
  }
}

window.onload = setup;


/* FOR CREATING SHOW LIST: */

function sortShows(show_a, show_b) {
  let a_name = show_a.name.toLowerCase();
  let b_name = show_b.name.toLowerCase();

  if(a_name > b_name) return 1;
  if(a_name < b_name) return -1;
  return 0;
}

function fetchShows() {
  let showArray = getAllShows();
  showArray.sort(sortShows);

  for (let i = 0; i < showArray.length; ++i) {
    showSelectorElem.innerHTML += `<option value="#${showArray[i].id}">${showArray[i].name}</option>`;
  } 
  return showArray;
}


/* FOR CREATING EPISODE LISTS AND ELEMENTS: */

async function fetchEpisodes(url) {
  let jsonData;    
  await fetch(url)
    .then(response => response.json())
    .then(json => jsonData = json)
  return jsonData;
}

async function makePageForEpisodes(url) {
  rootElem.innerHTML = "";
  episodeSelectorElem.innerHTML = "";

  episodeList = await fetchEpisodes(url);

  epNumSpan.textContent = `${episodeList.length}/${episodeList.length}`;
  for(let i = 0; i < episodeList.length; ++i) {
    rootElem.appendChild(createEpisodeElement(episodeList[i]));
    episodeSelectorElem.innerHTML += 
      `<option value="#${episodeList[i].id}">
      S${formatNumber(episodeList[i].season)}E${formatNumber(episodeList[i].number)} - ${episodeList[i].name}
      </option>`
  }
  return episodeList;
}

async function showSelection() {
  for (let i = 0; i < allShows.length; ++i) {
    if(`#${allShows[i].id}` == showSelectorElem.value) {
      allEpisodes = await makePageForEpisodes(allShows[i]._links.self.href + "/episodes");
      return;
    }
  }
  console.log("ERROR: episode not found");
}


/* FOR INDIVIDUAL EPISODE DISPLAYING: */

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


/* FOR SEARCHING: */

function displayFoundEpisodes() {
  const episodeList = allEpisodes;
  rootElem.innerHTML = "";

  var keyword = searchElem.value;
  var foundEpisodes = searchEpisodes(keyword, episodeList);

  epNumSpan.textContent = `${foundEpisodes.length}/${episodeList.length}`;
  for(let i = 0; i < foundEpisodes.length; ++i) {
    rootElem.appendChild(createEpisodeElement(foundEpisodes[i]));
  }
}

function searchEpisodes(keyword, episodeList) {
  if(keyword.length === 0) {
    return episodeList;
  }

  keyword = keyword.toLowerCase();
  var newEpisodeList = [];

  for(let i = 0; i < episodeList.length; ++i) {
    var episodeDescription = episodeList[i].name.toLowerCase() + episodeList[i].summary.toLowerCase();
    if(episodeDescription.includes(keyword)) {
      newEpisodeList.push(episodeList[i])
    }
  }
  return newEpisodeList;
}