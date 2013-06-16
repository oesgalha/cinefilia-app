$(document).ready(function(){

  // (Re)Iniciar o slider de posters
 
  var startSlider = function() {
    if (window.postersSwipe != null) {
      window.postersSwipe.kill;
    }
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
      startSlider();
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
  
  //coisas em desenvolvimento pra busca ... CAN'T TOUCH DIS XD
  //se tiver atrapalhando aí no seu, comente essa parte
  var maxRating = 18;
	var language = {ldub:false, lleg:false, lnac:false};
	var other = {o2d:false, o3d:false, othx:false};
		
  $(":radio").click(this, function()  {
      maxRating = this.id
  });  
    
  $(":checkbox").click(this, function() {
		var type = this.id.substring(0,1)
		var type2 = this.id
				
		switch(type){	
      case 'l':
        language[type2] = !language[type2]
        break;
      case 'o':
        other[type2] = !other[type2]
        break;
      }
		})
			
  $("#src").click(function(){
    //filtra os filmes
    clearSearch();
    var movieName = $("#movieName").val()
    
    $.each(window.moviesData, function(id, movie) {
      if (movie.name.indexOf(movieName) != -1){
        addMoviesToSearchList(movie);
      }
      else if (movie.rat <= maxRating){
        addMoviesToSearchList(movie);
      }
    })
    
    //verifica nome do filme
    //verifica classificação indicativa
    //verifica outros detalhes
  })
  
  //reseta lista de busca
  var clearSearch = function() {
    $('#movies_search_list-mp').html('');
  }
  
  // Adiciona filme a lista de busca
  var addMoviesToSearchList = function(movie) {
    $('<li><a class="retangular-movie-poster" href="#movie_details"><img src="' + movie.img + '"/><h1>' + movie.name + '</h1><p><span class="ui-btn-up-a cinefilia-bubble">' + movie.rat + '</span></p></a></li>').appendTo('#movies_search_list-mp')
  };
    
    
  // end of cruel dragons
  

});
