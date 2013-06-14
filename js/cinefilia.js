$(document).ready(function(){

  var startSlider = function() {
    window.postersSwipe = new Swipe(document.getElementById('slider'), {
      startSlide: 0,
      speed: 400,
      auto: 3000,
      continuous: true,
      disableScroll: false,
      stopPropagation: false
    }); 
  }

  // Criar posters
  var populatePosters = function(){
    $('#posters-holder').html('');
    $.each(window.moviesData, function(id, movie) {
      $('<div class="movie-poster"><img src="' + movie.img + '"/></div>').appendTo('#posters-holder')
    });
    startSlider();
  };

  $(window).hashchange(function() {
    if (location.hash == "#main_page" || location.hash == "") {
      populatePosters();
    }
  }); 

  // Popula a lista de filmes
  var populateMoviesList = function() {
    $('#movies_list-mp').html('');
    $.each(window.moviesData, function(id, movie) {
      $('<li><a class="retangular-movie-poster" href="#movie_details"><img src="' + movie.img + '"/><h1>' + movie.name + '</h1><p><span class="ui-btn-up-a cinefilia-bubble">' + movie.rat + '</span></p></a></li>').appendTo('#movies_list-mp')
    });
  }

  // Popula a lista de cinemas
  var populateCinemasList = function() {
    $('#cinemas_list-mp').html('');
    $.each(window.cinemasData, function(id, cinema) {
      $('<li><a href="#cinema_details"><img src="' + cinema.logo + '"/><h1>' + cinema.name + '</h1><p>' + cinema.addr + '</p></a></li>').appendTo('#cinemas_list-mp')
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
  
  // Carregar informações dos cinemas
  $.ajax({
    url: 'http://www.students.ic.unicamp.br/~ra108231/cinefilia_supreme_api/cinemas.json',
    dataType: 'jsonp',
    jsonpCallback: 'cineffiliacinemascache',
    success: function(data){
      window.cinemasData = data;
      populateCinemasList();
    }
  });

});
