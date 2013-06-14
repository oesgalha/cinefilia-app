$(document).ready(function(){

  // Criar posters
  var populatePosters = function(){
    $('#posters-holder').html('');
    $.each(window.moviesData, function(id, movie) {
      $('<div class="movie-poster"><img src="' + movie.img + '"/></div>').appendTo('#posters-holder')
    });
    window.postersSwipe = new Swipe(document.getElementById('slider'), {
      startSlide: 0,
      speed: 400,
      auto: 3000,
      continuous: true,
      disableScroll: false,
      stopPropagation: false
    }); 
  };

  var populateMoviesList = function() {
    $('#movies_list-mp').html('');
    $.each(window.moviesData, function(id, movie) {
      $('<li><a href="#movie_details"><img src="' + movie.img + '"/>' + movie.name + '</a></li>').appendTo('#movies_list-mp')
    });
  }

  // Carregar informações dos filmes
  $.ajax({
    url: 'http://www.students.ic.unicamp.br/~ra108231/cinefilia_supreme_api/movies.json',
    dataType: 'jsonp',
    jsonpCallback: 'cineffiliamoviescache',
    success: function(data){
      window.moviesData = data;
      populatePosters();
      populateMoviesList();
    }
  });
});
