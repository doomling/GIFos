// Constantes útiles

const apiKey = 'JQhP1sBxi7d1SKpBsMlFDJYPGUobpcpK';
const apiBaseUrl = 'http://api.giphy.com/v1/gifs/';

// Búsqueda

// Búsquedas sugeridas

const searchBar = document.getElementById('search-bar')
const searchButton = document.getElementById('search-button')
const suggestedTopics = ['Jonathan Van Ness', 'Sailor Mercury', 'Vaporwave', 'Glitter']
const suggestionWrapper = document.getElementsByClassName('search-suggestion-wrapper')[0]
const dropdown = document.getElementById('dropdown')
const light = document.getElementById('light')
const dark = document.getElementById('dark')

searchBar.addEventListener('input', event => {
    
    if (searchBar.value) {
        searchButton.classList.remove('button-disabled')
        searchButton.classList.add('button-active')
    } else {
        searchButton.classList.remove('button-active')
        searchButton.classList.add('button-disabled')
    }

    suggestionWrapper.classList.remove('hidden')
})

suggestionWrapper.addEventListener('mousedown', e => {
    searchAndAppendGifs(e.target.dataset.search)
    searchBar.value = e.target.dataset.search
    suggestionWrapper.classList.add('hidden');
})

searchBar.addEventListener('blur', () => {
    suggestionWrapper.classList.add('hidden');
})

// dropdown de temas

dropdown.addEventListener('click', () => {
    document.getElementsByClassName('header-dropdown-container')[0].classList.toggle('hidden')
})

light.addEventListener('click', () => {
    document.getElementsByTagName('body')[0].classList.add('light-theme')
    document.getElementsByTagName('body')[0].classList.remove('dark-theme')
    document.getElementsByClassName('header-dropdown-container')[0].classList.toggle('hidden')
})

dark.addEventListener('click', () => {
    document.getElementsByTagName('body')[0].classList.remove('main-theme')
    document.getElementsByTagName('body')[0].classList.add('dark-theme')
    document.getElementsByClassName('header-dropdown-container')[0].classList.toggle('hidden')
})

// Barra de búsqueda

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

        textBox.scrollIntoView();
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

// Búsquedas recomendadas (cards)

const cardWrapper = document.getElementsByClassName('cards-wrapper')[0]

function suggestedCards (topics) {

    topics.forEach(topic => {
        getSearchResults(topic).then(result => {
            const cardBox = document.createElement('div')
            cardBox.classList.add('box')
            cardBox.classList.add('card')
            cardBox.innerHTML = `<div class="box-header">
                                    <span>#${topic}</span>
                                    <div class="flex-center-content">
                                        <img class="close-button" src="./../../public/images/close.svg"/>
                                    </div>
                                </div>
                                <div class="card-content">
                                    <img src="${result.data[0].images.fixed_height.url}" class="card-img" data-search="${topic}"/>
                                    <div class="card-see-more button" data-search="${topic}"><div class="card-see-more-text" data-search="${topic}">Ver más...<div></div>
                                </div>`

            cardWrapper.appendChild(cardBox)
        })
    })
}

window.addEventListener('load', () => {
    suggestedCards(suggestedTopics)

})

cardWrapper.addEventListener('click', event => {
    if (event.target !== event.currentTarget) {
        const search = event.target.dataset.search
        searchBar.value = search
        searchAndAppendGifs(search)
    }
    event.stopPropagation();
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