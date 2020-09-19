/* SETUP: */

const showListingElem = document.getElementById("show-listing");
const showNumSpan = document.getElementById("show-num");
const episodeListingElem = document.getElementById("episode-listing");
const epNumSpan = document.getElementById("ep-num");
const returnButtonElem = document.getElementById("return-button");

const showSelectorElem = document.getElementById("show-selector");
const showSearchElem = document.getElementById("show-search");
const episodeSelectorElem = document.getElementById("episode-selector");
const episodeSearchElem = document.getElementById("episode-search");

const rootElem = document.getElementById("root");

const allShows = getShows();
let allEpisodes = [];


async function setup() {
  makePageForShows();

  episodeSearchElem.addEventListener("input", displayFoundEpisodes);
  showSearchElem.addEventListener("input", displayFoundShows);

  showSelectorElem.addEventListener("input", async function() {
    for (let i = 0; i < allShows.length; ++i) {
      if(allShows[i].id == showSelectorElem.value) {
        allEpisodes = await fetchEpisodes(allShows[i]._links.self.href);
        return;
      }}
    console.log(`Error: show not found`); // Error statement
  });

  episodeSelectorElem.onchange = function() {
    window.location.href = this.value;
  };

  returnButtonElem.addEventListener("click", makePageForShows);
}

window.onload = setup;


/* FOR GENERATING SHOW LIST: */

function sortShows(show_a, show_b) {
  let a_name = show_a.name.toLowerCase();
  let b_name = show_b.name.toLowerCase();

  if(a_name > b_name) return 1;
  if(a_name < b_name) return -1;
  return 0;
}

function getShows() {
  let showArray = getAllShows();
  showArray.sort(sortShows);

  for (let i = 0; i < showArray.length; ++i) {
    showSelectorElem.innerHTML += `<option value="${showArray[i].id}">${showArray[i].name}</option>`;
  } 
  return showArray;
}

function makePageForShows() {
  rootElem.innerHTML = "";
  showListingElem.style.display = "flex";
  episodeListingElem.style.display = "none";
  returnButtonElem.style.display = "none";

  showNumSpan.textContent = `${allShows.length}/${allShows.length}`;
  for(let i = 0; i < allShows.length; ++i) {
    rootElem.appendChild(createShowElement(allShows[i]));
  }
  window.scrollTo(0, 0);
} 


/* FOR GENERATING EPISODE LIST: */

async function fetchEpisodes(url) {
  let jsonData = [];    
  await fetch(convertToHttps(url) + "/episodes")
    .then(response => response.json())
    .then(json => jsonData = json)
    .catch(error => console.log(`Error: ${error}`)); // Error statement
  
  makePageForEpisodes(jsonData);
  return jsonData;
}

function makePageForEpisodes(episodeList) {
  rootElem.innerHTML = "";
  episodeSelectorElem.innerHTML = "";
  showListingElem.style.display = "none";
  episodeListingElem.style.display = "flex";
  returnButtonElem.style.display = "block";

  epNumSpan.textContent = `${episodeList.length}/${episodeList.length}`;
  for(let i = 0; i < episodeList.length; ++i) {
    rootElem.appendChild(createEpisodeElement(episodeList[i]));
    episodeSelectorElem.innerHTML += 
      `<option value="#${episodeList[i].id}">
      S${formatNumber(episodeList[i].season)}E${formatNumber(episodeList[i].number)} - ${episodeList[i].name}
      </option>`
  }
  window.scrollTo(0, 0);
}

function convertToHttps(url) {
  return url.replace("http://", "https://");
}


/* FOR GENERATING INDIVIDUAL SHOW AND EPISODE ELEMENTS: */

function createShowElement(show) {
  let showDiv = document.createElement("div");
  showDiv.setAttribute("class", "show");
  showDiv.setAttribute("id", show.id);

  let showHeader = document.createElement("h1");
  showHeader.innerHTML = show.name;
  showDiv.appendChild(showHeader);

  showHeader.addEventListener("click", async function() {
    for (let i = 0; i < allShows.length; ++i) {
      if(allShows[i].id == showDiv.id) {
        allEpisodes = await fetchEpisodes(allShows[i]._links.self.href);
        showSelectorElem.value = showDiv.id;
        return;
      }}
    console.log(`Error: show not found`); // Error statement
  });

  let showDetails = document.createElement("div");
  showDetails.setAttribute("class", "show-details");
  let imageAndDescription = document.createElement("div");
  imageAndDescription.setAttribute("class", "image-and-description");
  showDetails.appendChild(imageAndDescription);
  showDiv.appendChild(showDetails);

  let showImage = createImageElement(show.image, "image_not_found_2.png");
  imageAndDescription.appendChild(showImage);

  let showSummary = document.createElement("p");
  showSummary.innerHTML = show.summary;
  imageAndDescription.appendChild(showSummary);

  let showAttributes = createShowAttributeElement(show);
  showDetails.appendChild(showAttributes);
  
  return showDiv;
}

function createEpisodeElement(episode) {
  let episodeDiv = document.createElement("div");
  episodeDiv.setAttribute("class", "episode");
  episodeDiv.setAttribute("id", episode.id);

  let episodeHeader = document.createElement("h2");
  episodeHeader.innerHTML = `${episode.name} - S${formatNumber(episode.season)}E${formatNumber(episode.number)}`;
  episodeDiv.appendChild(episodeHeader);

  let episodeImage = createImageElement(episode.image, "image_not_found.png");
  episodeDiv.appendChild(episodeImage);

  let episodeSummary = document.createElement("p");
  episodeSummary.innerHTML = episode.summary;
  episodeDiv.appendChild(episodeSummary);

  return episodeDiv;
}

function createImageElement(image, placeholder) {
  let imageElem = document.createElement("img");
  
  if(image === null) {
    imageElem.setAttribute("src", placeholder);
  }
  else {
    imageElem.setAttribute("src", convertToHttps(image.medium));
  }
  return imageElem;
}

function createShowAttributeElement(show) {
  let showAttributes = document.createElement("ul");

  let rating = document.createElement("li");
  rating.innerHTML = `<b>Rated:</b> ${show.rating.average}`;
  showAttributes.appendChild(rating);

  let genres = document.createElement("li");
  genres.innerHTML = `<b>Genres:</b> ${show.genres.toString().replace(/,/g, " | ")}`;
  showAttributes.appendChild(genres);

  let status = document.createElement("li");
  status.innerHTML = `<b>Status:</b> ${show.status}`;
  showAttributes.appendChild(status);

  let runtime = document.createElement("li");
  runtime.innerHTML = `<b>Runtime:</b> ${show.runtime}`;
  showAttributes.appendChild(runtime);

  return showAttributes;
}

function formatNumber(number) {
  if (number < 10) {
    return "0" + String(number);
  }
  else {
    return String(number);
  }
}


/* FOR SEARCHING: */

function displayFoundEpisodes() {
  const episodeList = allEpisodes;
  rootElem.innerHTML = "";

  let keyword = episodeSearchElem.value;
  let foundEpisodes = searchItems(keyword, episodeList);

  epNumSpan.textContent = `${foundEpisodes.length}/${episodeList.length}`;
  for(let i = 0; i < foundEpisodes.length; ++i) {
    rootElem.appendChild(createEpisodeElement(foundEpisodes[i]));
  }
}

function displayFoundShows() {
  // global all shows used
  rootElem.innerHTML = "";

  let keyword = showSearchElem.value;
  let foundShows = searchItems(keyword, allShows);

  showNumSpan.textContent = `${foundShows.length}/${allShows.length}`;
  for(let i = 0; i < foundShows.length; ++i) {
    rootElem.appendChild(createShowElement(foundShows[i]));
  }
}

function searchItems(keyword, itemList) {
  if(keyword.length === 0) {
    return itemList;
  }

  keyword = keyword.toLowerCase();
  let newItemList = [];

  for(let i = 0; i < itemList.length; ++i) {
    let itemAttributes = "";
    if(itemList[i].hasOwnProperty("genres")){
      itemAttributes = itemList[i].genres.toString().toLowerCase();
      console.log(itemAttributes);
    } // more attributes can be added if needed

    let itemDescription = itemList[i].name.toLowerCase() + itemList[i].summary.toLowerCase() + itemAttributes;
    if(itemDescription.includes(keyword)) {
      newItemList.push(itemList[i])
    }
  }
  return newItemList;
}