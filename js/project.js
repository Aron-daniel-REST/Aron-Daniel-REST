function generateMovieHTML(movie) {
    return `
        <div id="movie-${movie.id}"  class="movie">
          <h3>${movie.title}</h3>
          <p>Rating: ${movie.rating}</p>
          <button class="edit-movie" data-id="${movie.id}">Edit</button>
          <button id="btn-${movie.id}" class="delete-movie" data-id="${movie.id}" onclick="movDel(this.id)">Delete</button>
        </div>
      `;
}

const moviesURL = 'https://excessive-sulfuric-narwhal.glitch.me/movies';

function loadMovies() {
    $.ajax({
        url: moviesURL,
        type: 'GET',
        success: function(response) {
            var moviesHTML = '';

            response.forEach(function(movie) {
                moviesHTML += generateMovieHTML(movie);
            });

            $('#movies-container').html(moviesHTML);
            $('#loading').remove();
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

$(document).on('click', '.edit-movie', function() {
    var movieId = $(this).data('id');

    $.ajax({
        url: `${moviesURL}/${movieId}`,
        type: 'GET',
        success: function(response) {
            var movie = response;

            $('#edit-movie-form input[name="title"]').val(movie.title);
            $('#edit-movie-form input[name="rating"]').val(movie.rating);
            $('#edit-movie-form input[name="movieId"]').val(movie.id);

            $('#edit-movie-form').show();
        }
    });
});

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

            $('#edit-movie-form').hide();
        }
    });
});

function movDel(id) {
    var movieId = id.replace('btn-', '');

    $.ajax({
        url: `${moviesURL}/${movieId}`,
        type: 'DELETE',
        success: function() {
            $('.movie[data-id="' + movieId + '"]').remove();
            loadMovies()
        }
    });
}






loadMovies();


