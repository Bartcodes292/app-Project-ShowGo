/* global $ ScrollMagic */
const history = document.getElementById('history');
const wrapper = document.querySelector('.wrapper');
let historyEmpty = true;

document.addEventListener("DOMContentLoaded", (e) => {
  fetchHistory();
  document.getElementById('search-bar').addEventListener('click', (e) => {
    if(!historyEmpty){
      wrapper.classList.add('show');
    }
  })
  document.getElementById('search-bar').addEventListener('keyup', (e) => {
    let artistQuery = document.getElementById('search-bar').value
    const results = document.getElementsByTagName('li');
    if (artistQuery === '') {
      history.replaceChildren('');
      fetchHistory();
    }
    {
      for(var i = 0; i <= results.length-1; i++){
        if(!compareSearch(artistQuery, results[i].innerText)){
          results[i].remove();
          i = -1;
        }
      }
    }
  })
// Search-bar click to pass value to API calls and render results and init ScrollMagic and Accordian
  document.getElementById('search').addEventListener('click', function () {
    let artistQuery = document.getElementById('search-bar').value
    var resultsContainerEl = document.getElementById('results-container')
    resultsContainerEl.innerHTML = ''
    count = 2
    callTastedive()
    wrapper.classList.remove('show');
    if(!historyEmpty){
      const results = document.getElementsByTagName('li');
      let inHistory = false;
      for(var i = 0; i <= results.length-1; i++){
        if(results[i].textContent === artistQuery){
          inHistory = true;
        }
      }
      if(!inHistory){
        rememberSearch(artistQuery);
      }
    } else {
      historyEmpty = false;
      rememberSearch(artistQuery)
    }
    document.getElementById('search-bar').value = '';
    history.replaceChildren('');
      fetchHistory();
      historyEmpty = false;
   })
  /// TasteDive API call
  function callTastedive () {
    var tastedive = 'https://tastedive.com/api/similar?q='
    var artistQuery = document.getElementById('search-bar').value
    var infoType = '&type=music&info=1'
    var apiKey = '&k=323666-showGo-XUMS94RP'
    var makeCall = tastedive + artistQuery + infoType + apiKey
    $.ajax({
      url: makeCall,
      method: 'GET',
      dataType: 'jsonp'
    })
      .then(function (response) {
        var infoTastedive = response.Similar.Info[0]
        const infoContainerEl = document.getElementById('info-container')
        console.assert(infoContainerEl, '#info-container element not found! might want to look into that')
        infoContainerEl.innerHTML = createFirstResultCard(infoTastedive)
        initAccordian()
      })
    // make BandsinTown API Call
    getRelatedArtistEvents()
  }
  // BandsinTown API Call
  
  function getRelatedArtistEvents () {
    var bandsintown = 'http://rest.bandsintown.com/artists/'
    var artistQuery = document.getElementById('search-bar').value
    var infoType = '/events?'
    var apiKey = 'app_id=c283929e0751cf243b17ca899c564814'
    var makeCall = bandsintown + artistQuery + infoType + apiKey
    $.ajax({
      url: makeCall,
      method: 'GET',
      dataType: 'jsonp',
      error: function (reason, xhr) {
        console.log('error in processing your request', reason)
      }
    })
      .then(function (response) {
        for (var i = 0; i <= 3; i++) {
          var bandsintownResults = response[i]
          document.getElementById('upcoming').innerHTML = createUpcomingShowInfo(bandsintownResults)
        }
      })
  }
  // Render first card
  function createFirstResultCard (input) {
    return `
      <div class="tile is-dark notification is-child box band-listing">
      <h2 class="title is-4 tile-header">${input.Name}</h2>
      <div class="tile-body" style="max-height: 0px">
        <div class="columns">
          <div class="column">
              <h3 class="title is-5 has-text-info">Artist Bio</h3>
              <p>${input.wTeaser}</p>
          </div>
          <div class="column">
              <iframe width="560" height="315" src="${input.yUrl}" frameborder="0"
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
          </div>
        </div>
        <h3 class="title is-5 has-text-info">Upcoming Shows</h3>
        <div id="upcoming" class="tile is-ancestor"></div>
      </div>
      </div>
    `
  }
  function createUpcomingShowInfo (input) {
    return `
        <div>
        <a href="${input.url}"><div class="tile is-parent">
          <div class="tile is-child box button is-info is-inverted is-outlined">
            <p>${input.datetime}<br/>${input.venue.name}<br/>${input.venue.city}</p>
          </div></a>
        </div>
    `
  }
  /// Accordion Toggle
  function initAccordian () {
    var header = document.getElementsByClassName('tile-header')
    for (var i = 0; i < header.length; i++) {
      header[i].addEventListener('click', function () {
        var content = this.nextElementSibling
        if (content.style.maxHeight !== '0px') {
          content.style.maxHeight = '0px'
          this.style.marginBottom = '0'
          this.parentNode.removeAttribute('style')
        } else {
          hideAll()
          content.style.maxHeight = content.scrollHeight + 'px'
          this.style.marginBottom = '1.5rem'
          this.parentNode.style.backgroundColor = 'hsl(0, 0%, 29%)'
        }
      })
    }
    function hideAll () {
      for (i = 0; i < header.length; i++) {
        var content = header[i].nextElementSibling
        content.style.maxHeight = '0'
        header[i].style.marginBottom = '0'
        header[i].parentNode.removeAttribute('style')
      }
    }
  }
  function reinitAccordian () {
    var header = document.getElementsByClassName('tile-header2')
    for (var i = 0; i < header.length; i++) {
      header[i].addEventListener('click', function () {
        var content = this.nextElementSibling
        if (content.style.maxHeight !== '0px') {
          content.style.maxHeight = '0px'
          this.style.marginBottom = '0'
          this.parentNode.removeAttribute('style')
        } else {
          hideAll()
          content.style.maxHeight = content.scrollHeight + 'px'
          this.style.marginBottom = '1.5rem'
          this.parentNode.style.backgroundColor = 'hsl(0, 0%, 29%)'
        }
      })
    }
    function hideAll () {
      for (i = 0; i < header.length; i++) {
        var content = header[i].nextElementSibling
        content.style.maxHeight = '0'
        header[i].style.marginBottom = '0'
        header[i].parentNode.removeAttribute('style')
      }
    }
  }
  // Init ScrollMagic Controller
  var count = 0
  var controller = new ScrollMagic.Controller()
  // Define ScrollMagic Scene
  new ScrollMagic.Scene({
    triggerElement: '.container #loader',
    triggerHook: 'onEnter'
  })
    .addIndicators()
    .addTo(controller)
    .on('enter', function (event) {
      if ((!$('#loader').hasClass('active')) && count < 3) {
        $('#loader').addClass('active')
        setTimeout(addResults, 1000, 2)
      }
    })
  // Function to add in new search results
  function addResults (amount) {
    var tastedive = 'https://tastedive.com/api/similar?q='
    var artistQuery = document.getElementById('search-bar').value
    var infoType = '&type=music&info=1'
    var apiKey = '&k=323666-showGo-XUMS94RP'
    var makeCall = tastedive + artistQuery + infoType + apiKey
    $.ajax({
      url: makeCall,
      method: 'GET',
      dataType: 'jsonp'
    })
      .then(function (response) {
        var tastediveAPIArray = response.Similar.Results
        var resultsContainerEl = document.getElementById('results-container')
        resultsContainerEl.innerHTML = renderNextResultsCards(tastediveAPIArray)
        reinitAccordian()
      })
    $('#loader').removeClass('active')
    count += 1
  }
  // Set the initial number of results to appear on the page
  addResults(1)
  
  function renderNextResultsCards (tastediveAPIArray) {
    // console.log(tastediveAPIArray)
    return tastediveAPIArray.map(createResultCard).join('')
  }
  function createResultCard (input) {
    return `
      <div class="tile is-dark notification is-child box band-listing">
      <h2 class="title is-4 tile-header2">${input.Name}</h2>
      <div class="tile-body" style="max-height: 0px">
        <div class="columns">
          <div class="column">
              <h3 class="title is-5 has-text-info">Artist Bio</h3>
              <p>${input.wTeaser}</p>
          </div>
          <div class="column">
              <iframe width="560" height="315" src="${input.yUrl}" frameborder="0"
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
          </div>
        </div>
      </div>
      </div>
    `}
  })
  function rememberSearch(input) { 
    if(input !== ""){
    const obj = {
      artist : input
    }
    const li = document.createElement('li');
    li.innerText = input;
    fetch("http://localhost:3000/searched", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(obj), 
      })
    .then(resp => resp.json())
    .then(json => {
      history.append(li);
    })
    }
  }
  function fetchHistory() {
    fetch("http://localhost:3000/searched")
  .then(resp => resp.json())
  .then(json => {
    if(json.length >= 1) {
      json.forEach(artist => {
        historyEmpty = false;
        const li = document.createElement('li');
        li.textContent = artist.artist;
        li.addEventListener('click', (e) => {
          document.getElementById('search-bar').value = e.target.innerText;
        })
        history.append(li);
      })
    } else {
      historyEmpty = true;
    }
  })
  }
  function compareSearch(input, searched) {
    const inp = input.length;
    let s = '';
    if(inp === 1) {
      s += searched[0];
    }
    else {
    for(var i = 0; i <= inp-1; i++) {
      s += searched[i];
    }
    }
    if(input === s) {
      return true;
    }
    else {
      return false;
    }
  }
