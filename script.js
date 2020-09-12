/* SETUP: */

const showSelectorElem = document.getElementById("show-selector");
const episodeSelectorElem = document.getElementById("episode-selector");
const searchElem = document.getElementById("search");
const rootElem = document.getElementById("root");
const epNumSpan = document.getElementById("ep-num");
const allShows = fetchShows();
let allEpisodes = [];

async function setup() {
  allEpisodes = await fetchEpisodes(allShows[0]._links.self.href);

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

async function showSelection() {
  for (let i = 0; i < allShows.length; ++i) {
    if(`#${allShows[i].id}` == showSelectorElem.value) {
      allEpisodes = await fetchEpisodes(allShows[i]._links.self.href);
      return;
    }
  }
  console.log(`Error: episode not found`); // Error statement
}

async function fetchEpisodes(url) {
  let jsonData = [];    
  await fetch(convertToHttps(url) + "/episodes")
    .then(response => response.json())
    .then(json => jsonData = json)
    .catch(error => console.log(`Error: ${error}`)); // Error statement
  
  makePageForEpisodes(jsonData);
  return jsonData;
}

function convertToHttps(url) {
  return url.replace("http://", "https://");
}

function makePageForEpisodes(episodeList) {
  rootElem.innerHTML = "";
  episodeSelectorElem.innerHTML = "";

  epNumSpan.textContent = `${episodeList.length}/${episodeList.length}`;
  for(let i = 0; i < episodeList.length; ++i) {
    rootElem.appendChild(createEpisodeElement(episodeList[i]));
    episodeSelectorElem.innerHTML += 
      `<option value="#${episodeList[i].id}">
      S${formatNumber(episodeList[i].season)}E${formatNumber(episodeList[i].number)} - ${episodeList[i].name}
      </option>`
  }
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
  let episodeDiv = document.createElement("div");
  episodeDiv.setAttribute("class", "episode");
  episodeDiv.setAttribute("id", episode.id);

  let episodeHeader = document.createElement("h2");
  episodeHeader.innerHTML = `${episode.name} - S${formatNumber(episode.season)}E${formatNumber(episode.number)}`;
  episodeDiv.appendChild(episodeHeader);

  let episodeImage = document.createElement("img");
  if(episode.image === null){
    episodeImage.setAttribute("src", "image_not_found.png");
  }
  else {
    episodeImage.setAttribute("src", convertToHttps(episode.image.medium));
  }
  episodeDiv.appendChild(episodeImage);

  let episodeSummary = document.createElement("p");
  episodeSummary.innerHTML = episode.summary;
  episodeDiv.appendChild(episodeSummary);

  return episodeDiv;
}


/* FOR SEARCHING: */

function displayFoundEpisodes() {
  const episodeList = allEpisodes;
  rootElem.innerHTML = "";

  let keyword = searchElem.value;
  let foundEpisodes = searchEpisodes(keyword, episodeList);

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
  let newEpisodeList = [];

  for(let i = 0; i < episodeList.length; ++i) {
    let episodeDescription = episodeList[i].name.toLowerCase() + episodeList[i].summary.toLowerCase();
    if(episodeDescription.includes(keyword)) {
      newEpisodeList.push(episodeList[i])
    }
  }
  return newEpisodeList;
}