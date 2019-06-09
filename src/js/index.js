const apiKey = 'JQhP1sBxi7d1SKpBsMlFDJYPGUobpcpK';
const apiBaseUrl = 'http://api.giphy.com/v1/gifs/';

// search functionality

// suggested search

const searchBar = document.getElementById('search-bar')
const searchButton = document.getElementById('search-button')
const suggestedTopics = ['jonathanVanness', 'sailormercury', 'vapowave', 'glitter']

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
            console.log(data)
            return data
        })
        .catch((error) => {
            return error
        })
    return found
}

function searchAndAppendGifs(value) {

    const previousContainer = document.getElementById('results');
    const textBox = document.getElementById('results-text')

    if (previousContainer) {
        previousContainer.innerHTML = "";
    }
    
    textBox.innerHTML = value
    getSearchResults(value).then(results => {

      const container = document.getElementById('results')

        if (results.data.length > 0) {
            results.data.map(result => {
                const img = document.createElement('img')
                img.src = result.images.fixed_height.url;
                img.classList.add('results-thumb');
                container.appendChild(img);
            });
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

function suggestedCards (topics) {

    topics.forEach(topic => {
        getSearchResults(topic).then(result => {
            const cardBox = document.createElement('div')
            cardBox.classList.add('box')
            cardBox.classList.add('card')
            cardBox.innerHTML = `<div class="box-header">
                                    <span>#${result.data[0].title}</span>
                                    <div class="flex-center-content">
                                        <img class="close-button" src="./../../public/images/close.svg"/>
                                    </div>
                                </div>
                                <div class="card-content">
                                    <img src="${result.data[0].images.fixed_height.url}" class="card-img"/>
                                </div>`

            document.getElementsByClassName('cards-wrapper')[0].appendChild(cardBox)
        })
    })
}

window.addEventListener('load', () => {
    suggestedCards(suggestedTopics)
})

// Trending

function getTrends() {
    const found = fetch(apiBaseUrl + 'trending?api_key=' + apiKey) 
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
        const container = document.getElementById('results')
        
        results.data.forEach(result => {
            const img = document.createElement('img')
            img.src = result.images.fixed_height.url;
            img.classList.add('results-thumb');
            container.appendChild(img);
        })
    })   
})
