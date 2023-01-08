// DOM STUFF

// AREA MADE FOR DIV AND MACRO ESTRUCTURES
let body = document.body;
let header = document.querySelector('header');
let pagTitle = document.querySelector('.header__title');
let moviesContainer = document.querySelector('.movies-container');
let modalContainer = document.querySelector('.modal__body');
let highlightContainer = document.querySelector('.highlight');

// MOVIES DISPLAY
let movies = document.querySelector('.movies');
let movieRating = document.querySelector('.movie_rating');
let inputSearch = document.querySelector('.input');

// MODAL STUFF
let modal = document.querySelector('.modal');
let modalTitle = document.querySelector('.modal__title');
let modalImg = document.querySelector('.modal__img');
let modalDescription = document.querySelector('.modal__description');
let modalAverage = document.querySelector('.modal__average');
let modalGenres = document.querySelector('.modal__genre');
let modalClose = document.querySelector('.modal__close');

// DAILY FILM STUFF
let highlightImg = document.querySelector(".highlight__video");
let highlightTitle = document.querySelector(".highlight__title");
let highlightRate = document.querySelector(".highlight__rating");
let highlightGenres = document.querySelector(".highlight__genres");
let highlightLaunch = document.querySelector(".highlight__launch");
let highlightDescription = document.querySelector(".highlight__description");
let highlightVideo = document.querySelector(".highlight__video-link");

// BUTTONS
let logo = document.querySelector('.logo');
let leftBtn = document.querySelector('.btn-prev');
let rightBtn = document.querySelector('.btn-next');
let themeBtn = document.querySelector('.btn-theme');

// URL VARIABLES
let moviesId = {};
let searchMode = false;
let aux = null;

// CREATOR OF VARIABLES USED FOR CREATING THE POSTERS FILMS
let movie = []
for (let i = 0; i < 6; i++) {
    if (i === 0) {
        movie[i] = document.querySelector('.movie');
    } else {
        movie[i] = document.querySelector('.movie').cloneNode(true);
    }
}

// POSTER GENERATOR
let page = 1;

function getMovie() {
    let url = (page === 1 ? `https://tmdb-proxy.cubos-academy.workers.dev/3/discover/movie?language=pt-BR&include_adult=false` : `https://tmdb-proxy.cubos-academy.workers.dev/3/discover/movie?language=pt-BR&include_adult=false&page=${page}`);
    axios.get(url)
        .then(response => {
            for (let i = 0; i < movie.length; i++) {
                poster = response.data.results[i].poster_path;
                title = response.data.results[i].title;            
                votes = response.data.results[i].vote_average;
                votes = Number(votes).toFixed(0);

                moviesId[title] = response.data.results[i].id; /* USED TO GET ALL MOVIES ID! 
                                                                WILL BE USED IN THE FUTURE TO GENERATE MODALS */
                movie[i].style.backgroundImage = "url(" + poster + ")";
                movie[i].children[0].children[0].textContent = title;
                movie[i].children[0].children[1].textContent = votes;
                /* THIS KIND OF DATA MANIPULATION ABOVE SEEMS MESSY, 
                BUT THATS THE ONLY FAST AND CLEAN WAY TO DO IT ->IN THIS CASE ONLY<-
                */

                let star = document.createElement('img');
                star.src = "../assets/estrela.svg";
                star.alt = "Estrela"               
                movie[i].children[0].children[1].appendChild(star);   /* USED TO DISPLAY THE STAR NEAR THE RATING
                                                        TEXTCONTENT WAS DELETING THE IMG TAG INSIDE THE SPAN*/
                


                movie[i].children[0].classList.remove('loading');
                if (!(i === 0)) {
                    movies.after(movie[i]);
                }
            }
        })
        .catch(error => console.log(error))
}
// MOVIE SEARCHER
function searchMovie(movieName) {
    let url = (page === 1 ? `https://tmdb-proxy.cubos-academy.workers.dev/3/search/movie?language=pt-BR&include_adult=false&query=${movieName}` : `https://tmdb-proxy.cubos-academy.workers.dev/3/search/movie?language=pt-BR&include_adult=false&query=${movieName}&page=${page}`);
    axios.get(url)
        .then(response => {
            for (let i = 0; i < movie.length; i++) {
                poster = response.data.results[i].poster_path;
                title = response.data.results[i].title;
                votes = response.data.results[i].vote_average;
                votes = Number(votes).toFixed(0);

                moviesId[title] = response.data.results[i].id;

                movie[i].style.backgroundImage = "url(" + poster + ")";
                movie[i].children[0].children[0].textContent = title;
                movie[i].children[0].children[1].innerHTML = votes;

                let star = document.createElement('img');
                star.src = "../assets/estrela.svg";
                star.alt = "Estrela"               
                movie[i].children[0].children[1].appendChild(star); 

                if (!(i === 0)) {
                    movies.after(movie[i]);
                }

            }
        })
        .catch(error => console.log(error))

}

// CONFIRM THE VALUE SEARCHED

inputSearch.addEventListener('keyup', (e) => {
    let text = inputSearch.value;
    aux = text;
    searchMode = true;  // HAD TO DO IT LIKE THIS, NEED TO SWITCH THE DATA THAT THE SIDE BUTTONS WAS CATCHING!
    if (e.keyCode === 13) {
        if (!text) {
            page = 1;
            searchMode = false;
            return getMovie();
        } else {
            for (let i = 0; i < movie.length; i++) {
                movie[i].style.backgroundImage = null
                movie[i].children[0].children[0].textContent = null;
                movie[i].children[0].children[1].innerHTML = null;
            }
            searchMode = true;
            page = 1;
            return searchMovie(text);
        }
    }
})

getMovie(); /* CALLING THIS FUNCTION HERE, MOVING IT MAY CAUSE BUGS! */

// SIDE BUTTONS
leftBtn.addEventListener('click', () => {
    if (page === 1) {
        return
    }
    page--;
    return (searchMode === true ? searchMovie(aux) : getMovie())
})
rightBtn.addEventListener('click', () => {
    if (page === 3) {
        return
    }
    page++;
    return (searchMode === true ? searchMovie(aux) : getMovie())
});

// DAILY MOVIE 

function dayMovie() {
    let url = `https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969?language=pt-BR`;
    let urlTrailer = `https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969/videos?language=pt-BR`;

    axios.get(url)
        .then(response => {
            poster = response.data.backdrop_path
            title = response.data.title;
            votes = response.data.vote_average;
            votes = Number(votes).toFixed(1);
            rlsDate = response.data.release_date;
            genres = response.data.genres;
            description = response.data.overview;

            genText = [];
            for (const item of genres) {
                genText.push(item.name);
            }

            highlightImg.style.backgroundImage = "url(" + poster + ")";
            highlightImg.style.backgroundSize = "cover";
            highlightTitle.textContent = title;
            highlightRate.textContent = votes;
            highlightGenres.textContent = genText + " /";

            highlightLaunch.textContent = new Date(rlsDate).toLocaleDateString("pt-BR", {
                year: "numeric",
                month: "long",
                day: "numeric",
                timeZone: "UTC",
            });

            highlightDescription.textContent = description;
        })
        .catch(error => console.log(error))
    //TRAILER API DATA
    axios.get(urlTrailer)
        .then(response => {
            trailer = response.data.results[0].key;
            highlightVideo.href = `https://www.youtube.com/watch?v=${trailer}`;
        })
        .catch(error => console.log(error))
}

dayMovie();

// MODAL
for (let i = 0; i < movie.length; i++) {
    movie[i].addEventListener('click', () => {
        let title = movie[i].children[0].children[0].textContent;
        let id = moviesId[title];
        let url = `https://tmdb-proxy.cubos-academy.workers.dev/3/movie/${id}?language=pt-BR`

        modal.classList.remove("hidden");

        axios.get(url)
            .then(response => {
                poster = response.data.backdrop_path
                title = response.data.title;
                votes = response.data.vote_average;
                votes = Number(votes).toFixed(1);
                description = response.data.overview;

                genres = response.data.genres;
                let tag = [];
                for (let i = 0; i < genres.length; i++) {
                    tag[i] = document.createElement("span");
                    tag[i].textContent = genres[i].name;
                    modalGenres.appendChild(tag[i]);
                }

                modalImg.src = `${poster}`;
                modalTitle.textContent = title;
                modalAverage.textContent = votes;
                modalDescription.textContent = description;
            })
            .catch(error => console.log(error))
    })
}
modalClose.addEventListener('click', () => {
    modal.classList.add("hidden");
    // USED TO REMOVE SAVED ELEMENTS INSIDE THE DOM, FROM THE MODAL OPENED BEFORE!
    while (modalGenres.firstChild) {
        modalGenres.removeChild(modalGenres.firstChild);
    }
})

localStorage.setItem("light", "on");
themeBtn.addEventListener("click", () => {
    if (localStorage.getItem("light") === "on" || !localStorage.getItem("light")) {
        pagTitle.style.color = "var(--background)";
        header.style.backgroundColor = "var(--text-color)";
        header.style.transition = "all 2s";                         //BACKGROUND AND MACRO STYLISH
        body.style.backgroundColor = "var(--text-color)";
        body.style.transition = "all 2s";

        //DIV STYLSH BELOW
        moviesContainer.style.backgroundColor = "var(--bg-secondary-dark)";

        highlightContainer.style.backgroundColor = "var(--bg-secondary-dark)";
        highlightTitle.style.color = "var(--background)";
        highlightDescription.style.color = "var(--background)";
        highlightGenres.style.color = "var(--background)";
        highlightLaunch.style.color = "var(--background)";

        //ICONS AND DETAILS STYLISH BELOW
        logo.src = "../assets/logo.svg";

        leftBtn.src = "../assets/arrow-left-light.svg";
        rightBtn.src = "../assets/arrow-right-light.svg";

        inputSearch.style.color = "var(--background)";

        modalContainer.style.backgroundColor = "var(--bg-secondary-dark)";
        modalTitle.style.color = "var(--background)";
        modalDescription.style.color = "var(--background)";
        modalClose.src = "../assets/close.svg";


        localStorage.setItem("light", "off");

        themeBtn.src = "../assets/dark-mode.svg";
        return
    }
    if (localStorage.getItem("light") === "off" || !localStorage.getItem("light")) {
        pagTitle.style.color = "var(--text-color)";
        header.style.backgroundColor = "var(--background)";
        body.style.backgroundColor = "var(--background)";

        moviesContainer.style.backgroundColor = "var(--bg-secondary)";

        highlightContainer.style.backgroundColor = "var(--bg-secondary)";
        highlightTitle.style.color = "var(--text-color)";
        highlightDescription.style.color = "var(--text-color)";
        highlightGenres.style.color = "var(--text-color)";
        highlightLaunch.style.color = "var(--text-color)";

        logo.src = "../assets/logo-dark.png";

        leftBtn.src = "../assets/arrow-left-dark.svg";
        rightBtn.src = "../assets/arrow-right-dark.svg";

        inputSearch.style.color = "var(--input-color)";

        modalContainer.style.backgroundColor = "var(--bg-secondary)";
        modalTitle.style.color = "var(--text-color)";
        modalDescription.style.color = "var(--text-color)";
        modalClose.src = "../assets/close-dark.svg";


        localStorage.setItem("light", "on")
        themeBtn.src = "../assets/light-mode.svg";
        return
    }

})

pagTitle.addEventListener("click", () => {
    page = 1;
    searchMode = false;
    return getMovie();
})