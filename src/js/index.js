const apiKey = 'JQhP1sBxi7d1SKpBsMlFDJYPGUobpcpK';
const apiBaseUrl = 'http://api.giphy.com/v1/gifs/';

// search functionality

const searchBar = document.getElementById('search-bar')
const searchButton = document.getElementById('search-button')

searchBar.addEventListener('input', event => {
    
    if (searchBar.value) {
        searchButton.classList.remove('button-disabled')
        searchButton.classList.add('button-active')
    } else {
        searchButton.classList.remove('button-active')
        searchButton.classList.add('button-disabled')
    }
});

function getSearchResults(search) {
    const found = fetch(apiBaseUrl + 'search?q=' + search + '&api_key=' + apiKey) 
        .then((response) => {
           return response.json()
        }).then(data => {
            return data
        })
        .catch((error) => {
            return error
        })
    return found
}

function searchAndAppendGifs(value) {

    const gallery = document.getElementById('gallery');
    const previousContainer = document.getElementById('results');

    if (previousContainer) {
        gallery.removeChild(previousContainer)
    }
    
    getSearchResults(value).then(results => {

      const container = document.createElement('div')
      container.id = 'results'
      container.classList.add('results-container')
      gallery.appendChild(container)

        if (results.data.length > 0) {
            results.data.map(result => {
                const img = document.createElement('img')
                img.src = result.images.fixed_height.url;
                img.classList.add('results-thumb');
                container.appendChild(img);
            })
        } else {
            const error = document.createElement('span')
            error.id = 'search-error'
            error.innerHTML = 'No se encontraron resultados para tu búsqueda'
            container.appendChild(error)
        }

    })
}

searchButton.addEventListener('click', event => {
    searchAndAppendGifs(searchBar.value)
    
})

searchBar.addEventListener('keydown', (event) => {
    if (event.keyCode === 13) {
        searchAndAppendGifs(searchBar.value)
    }
})

// Trending

function getTrends() {
    const found = fetch(apiBaseUrl + 'trending?api_key=' + apiKey + '&limit=4') 
        .then((response) => {
           return response.json()
        }).then(data => {
            return data
        })
        .catch((error) => {
            return error
        })
    return found
}

window.addEventListener('load', () => {

    getTrends().then(results => {
        results.data.map(result => {

            const cardBox = document.createElement('div')
            cardBox.classList.add('box')
            cardBox.classList.add('card')
            cardBox.innerHTML = `<div class="box-header">
                                    <span>${result.title}</span>
                                    <div class="flex-center-content">
                                        <img class="close-button" src="./../../public/images/close.svg"/>
                                    </div>
                                </div>
                                <div class="card-content">
                                    <img src="${result.images.fixed_height.url}" class="card-img"/>
                                </div>`

            document.getElementsByClassName('cards-wrapper')[0].appendChild(cardBox)

        })   
    })
})
