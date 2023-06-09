function generateMovieHTML(movie) {

    let htmlD = `
          <div id="movie-${movie.id}" class="carousel-item" data-bs-interval="3000">
            <div class="card mx-auto my-1 bg-light bg-opacity-10" style="width: 18rem;">
                <div id="poster"></div>
                <div class="card-body border border-top-0 rounded-bottom border-white">
                    <h5 class="card-title text-light movieTitle">${movie.title}</h5>
                    <p class="card-text text-light">Rating: ${movie.rating}</p>
                    <button type="button" id="btnE-${movie.id}" class="btn btn-light text-light bg-transparent" data-bs-toggle="modal" data-bs-target="#exampleModal" onclick="movEdt(this.id)">Edit Movie</button>
                    <button id="btnD-${movie.id}" class="btn btn-light text-light bg-transparent delete-movie" data-id="${movie.id}" onclick="movDel(this.id)">Delete Movie</button>
                </div>
            </div>
          </div>
      `;
    return htmlD
}

const moviesURL = 'https://excessive-sulfuric-narwhal.glitch.me/movies';


function loadMovies() {
    $.ajax({
        url: moviesURL,
        type: 'GET',
        success: function(response) {
            console.log(response)
            var moviesHTML = '';

            response.forEach(function(movie) {
                moviesHTML += generateMovieHTML(movie);
            });

            setTimeout(() => {
                $('#loading').remove();
            }, "3000");
            setTimeout(() => {
                $('#movies-container').html(moviesHTML);
                $('#movie-1').addClass('active');
                getPoster()
            }, "3000");
        }
    });
}

function loadMoviesFast() {
    $.ajax({
        url: moviesURL,
        type: 'GET',
        success: function(response) {
            var moviesHTML = '';

            response.forEach(function(movie) {
                moviesHTML += generateMovieHTML(movie);
            });
            $('#movies-container').html(moviesHTML);
            $('#movie-1').addClass('active');
            getPoster()
        }
    });
}

$('#add-movie-form').submit(function(event) {
    event.preventDefault();

    var title = $('#title').val();
    var rating = parseInt($('#rating').val());

    $.ajax({
        url: moviesURL,
        type: 'POST',
        data: { title: title, rating: rating },
        success: function(response) {
            var movieHTML = generateMovieHTML(response);
            $('#movies-container').append(movieHTML);
            $('#add-movie-form')[0].reset();
        }
    });
});

function movEdt(id){

    var movieId = id.replace('btnE-', '');
    console.log(movieId);
    $.ajax({
        url: `${moviesURL}/${movieId}`,
        type: 'GET',
        success: function(response) {
            var movie = response;

            $('#edit-movie-form input[name="title"]').val(movie.title);
            $('#edit-movie-form input[name="rating"]').val(movie.rating);
            $('#edit-movie-form input[name="movieId"]').val(movie.id);

        }
    });

}

$('#edit-movie-form').submit(function(event) {
    event.preventDefault();

    var movieId = $('#edit-movie-form input[name="movieId"]').val();
    var title = $('#edit-movie-form input[name="title"]').val();
    var rating = parseInt($('#edit-movie-form input[name="rating"]').val());

    $.ajax({
        url: `${moviesURL}/${movieId}`,
        type: 'PUT',
        data: { title: title, rating: rating },
        success: function(response) {
            var updatedMovieHTML = generateMovieHTML(response);
            $('.movie[data-id="' + movieId + '"]').replaceWith(updatedMovieHTML);

            // $('#form-show').hide();
            loadMoviesFast()
        }
    });
});

function movDel(id) {
    var movieId = id.replace('btnD-', '');

    $.ajax({
        url: `${moviesURL}/${movieId}`,
        type: 'DELETE',
        success: function() {
            $('.movie[data-id="' + movieId + '"]').remove();
            loadMoviesFast()
        }
    });
}


function getPoster(){
    $('.movieTitle').each(function (){
        let film = $(this).text()
        console.log(film)

        $.getJSON("https://api.themoviedb.org/3/search/movie?api_key=" + poasterKey + "&query=" + film, function(json) {
            console.log(json)
            if (json.results[0].original_title === film){
                $('#poster').html(`<img class="w-100 border border-light rounded-top" id="thePoster" src="http://image.tmdb.org/t/p/w500/${json.results[0].poster_path}" class="img-responsive" >`);
            } else {
                $('#poster').html(`<img class="w-100 border border-light rounded-top" id="thePoster" src="img/rick.jpg"  class="img-responsive" />`);
            };
        })
    });
}



loadMovies();