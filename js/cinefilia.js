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
    url: 'http://192.168.0.13/helper-cinefilia/movies.json',
    dataType: 'jsonp',
    jsonpCallback: 'cineffiliamoviescache',
    success: function(data){
      window.moviesData = data;
      populatePosters();
      populateMoviesList();
      startTest();
    }
  });
  
  // Carregar informações dos cinemas
  $.ajax({
    url: 'http://192.168.0.13/helper-cinefilia/cinemas.json',
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
	var other = {o2d:false, o3d:false, othx:false, opre:false};
		
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
			
  $('[name="exit"]').click(function(){
    navigator.app.exitApp()
  })
    
  $("#src").click(function(){
    //filtra os filmes
    clearSearch();
    var movieName = $("#movieName").val()
    var initialList = new Array();
    
    var search_language = ((language[ldub] != language[lleg])  || (language[ldub] != language[lnac]) || (language[ldub] != language[lnac]))
    var search_dimension = (other[o2d] != other[o3d])
    
    var search_language_array = new Array();
    if (search_language){
      if (language[ldub]) search_language_array.push('DUB');
      if (language[lleg]) search_language_array.push('LEG');
      if (language[lnac]) search_language_array.push('NAC');
    }
    
    var required_array = Array()
    if ((search_dimension)){
      other[o2d] ? required_array.push('2D') : required_array.push('3D');
    }
    if (other[othx]) required_array.push('THX');
    if (other[opre]) required_array.push('PRE');
    
    $.each(window.moviesData, function(id, movie) {
      if ((movieName!='' && (movie.name.indexOf(movieName) != -1) && (movie.rat <= maxRating))
        ||(movieName=='' && (movie.rat <= maxRating))){
        initialList.push(movie)
      }
    })
    
    var show = false
    for (movie in initialList){
      //verifica se tem um dos idiomas de search_language_array
      for (each in search_language_array){
        if (movie.lang == each)
          show = true;
      }
      
      if (show){
        //verifica se tem todos de required_array
        for (each in required_array){
          if (!movie.each)
            show = false;
        }
        if (show){
          addMoviesToSearchList(movie);
        }
      }
    }
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

var startTest = function() {
      
			$('body').imagesLoaded(function($images, $proper, $broken ) {

				// see console output for debug info
				ImgCache.options.debug = true;
				ImgCache.options.usePersistentCache = true;
	
				ImgCache.init(function() {
					// 1. cache images
					for (var i = 0; i < $proper.length; i++) {
						ImgCache.cacheFile($($proper[i]).attr('src'));
					}
					// 2. broken images get replaced
					for (var i = 0; i < $broken.length; i++) {
						ImgCache.useCachedFile($($broken[i]));
					}

				});
			});
		};

if (typeof(cordova) !== 'undefined') {
  // cordova test
  document.addEventListener('deviceready', startTest, false);
} else {
  // normal browser test
  $(document).ready(startTest);
}
