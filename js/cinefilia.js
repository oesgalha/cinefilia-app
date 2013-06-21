$(document).ready(function(){

  // Remover transição
  $.mobile.defaultPageTransition = 'none';

  window.moviesList = new Array();

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

  // Redimensionar os posters
  var resizePosters = function() {
    $('.movie-poster>img').width('auto');
    $('.movie-poster>img').height($(window).height() - 120);
    $('#mini-poster').width($(window).width() / 2 - 32);
  }

  $(window).on("orientationchange", function(event) {
    window.setTimeout(resizePosters, 500);
  });

  // Criar posters
  var populatePosters = function(){
    $('#posters-holder').html('');
    $.each(window.moviesData, function(id, movie) {
      $('<div class="movie-poster"><img src="' + movie.img + '"/></div>').appendTo('#posters-holder');
    });
    resizePosters();
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
      window.moviesList[movie.id] = movie;
      window.moviesList[movie.id].horarios = new Array();
      $('<li><a class="retangular-movie-poster" href="#movie_details" onclick="selectMovie(' + movie.id + ')"><img src="' + movie.img + '"/><h1>' + movie.name + '</h1><p><span class="ui-btn-up-a cinefilia-bubble">' + movie.rat + '</span></p></a></li>').appendTo('#movies_list-mp');
    });
  }

  // Popula a lista de cinemas
  var populateCinemasList = function() {
    $('#cinemas_list-mp').html('');
    $.each(window.cinemasData, function(id, cinema) {
      $('<li><a href="#cinema_details"><img src="' + cinema.logo + '"/><h1>' + cinema.name + '</h1><p>' + cinema.addr + '</p></a></li>').appendTo('#cinemas_list-mp');
    });
  }
  
  
  // Popula a lista de favoritos
  var populateFavsList = function() {
    $('#favs_list-mp').html('');
    $('<li data-role="list-divider">Filmes</li>').appendTo('#favs_list-mp');
    $.each(window.moviesData, function(id, movie) {
      window.moviesList[movie.id] = movie;
      $('<li><a href="#movie_details" onclick="selectMovie(' + movie.id + ')"><img src="' + movie.img + '"/><h1>' + movie.name + '</h1><p><span class="ui-btn-up-a cinefilia-bubble">' + movie.rat + '</span></p></a></li>').appendTo('#favs_list-mp');
    });
    $('<li data-role="list-divider">Cinemas</li>').appendTo('#favs_list-mp');
    $.each(window.cinemasData, function(id, cinema) {
      $('<li><a href="#cinema_details"><img src="' + cinema.logo + '"/><h1>' + cinema.name + '</h1><p>' + cinema.addr + '</p></a></li>').appendTo('#favs_list-mp');
    });
  }
  
  // Popula a lista de cinemas
  var populateSessionsList = function() {
    $.each(window.cinemasData, function(idCinema, cinema) {
      $.each(cinema.salas, function(idSala, sala) {
        $.each(sala, function(idDia, dia) {
          $.each(dia, function(idSessao, sessao) {
            $.each(sessao.info, function(idInfo, detalhe) {
                window.moviesList[sessao.filme][detalhe] = true;
            });
            temp = {'cinema':idCinema, 'sala':idSala, 'data':idDia, 'hora':idSessao, 'det':sessao.info};
            window.moviesList[sessao.filme].horarios.push(temp);
          });
        });
      });
    });
  }
  
  // Carregar informações dos filmes
  $.ajax({
    url: 'http://cinefilia.freetzi.com/json/movies.json',
    dataType: 'jsonp',
    jsonpCallback: 'cineffiliamoviescache',
    async: false,
    success: function(data){
      window.moviesData = data;
      populatePosters();
      populateMoviesList();
      startTest();
      localStorage.moviesData = JSON.stringify(data);
      loadCinemas();
    },
    error: function(){
      window.moviesData = JSON.parse(localStorage.moviesData);
      populatePosters();
      populateMoviesList();
      startTest();
      loadCinemas();
    }
  });
  
  
  var loadCinemas = function(){
    // Carregar informações dos cinemas
    $.ajax({
      url: 'http://cinefilia.freetzi.com/json/cinemas.json',
      dataType: 'jsonp',
      jsonpCallback: 'cineffiliacinemascache',
      async: false,
      success: function(data){
        window.cinemasData = data;
        populateCinemasList();
        populateSessionsList();
        localStorage.cinemasData = JSON.stringify(data);
        populateFavsList();
      },
      error: function(){
        window.cinemasData = JSON.parse(localStorage.cinemasData);
        populateCinemasList();
        populateSessionsList();
        populateFavsList();
      }
    });
  }
  //coisas em desenvolvimento pra busca ... CAN'T TOUCH DIS XD
  //se tiver atrapalhando aí no seu, comente essa parte
  var maxRating = 18;
	var language = {ldub:false, lleg:false, lnac:false};
	var other = {o2d:false, o3d:false, othx:false, opre:false};
		
  $(":radio").click(this, function()  {
      maxRating = this.id;
  });  
    
  $(":checkbox").click(this, function() {
		var type = this.id.substring(0,1);
		var type2 = this.id;
				
		switch(type){	
      case 'l':
        language[type2] = !language[type2];
        break;
      case 'o':
        other[type2] = !other[type2];
        break;
    }
	});
			
  // Listener app startado
  document.addEventListener("deviceready", onDR, false);

  var onDR = function(){
    // App startado
    document.addEventListener("backbutton", backKeyDown, true);
    $('[name="exit"]').click(function(){
      navigator.app.exitApp();
    });
  }

  var backKeyDown = function() { 
    if (location.hash == "#main_page" || location.hash == "") {
      navigator.app.exitApp();
    }
  }
  
  $("#src").click(function(){
    //filtra os filmes
    clearSearch();
    var movieName = $("#movieName").val();
    var initialList = new Array();
    
    var search_language = ((language.ldub != language.lleg)  || (language.ldub != language.lnac) || (language.lleg != language.lnac));
    var search_dimension = (other.o2d != other.o3d);
    
    var search_language_array = new Array();
    if (search_language){
      if (language.ldub) search_language_array.push('DUB');
      if (language.lleg) search_language_array.push('LEG');
      if (language.lnac) search_language_array.push('NAC');
    }
    
    var required_array = new Array();
    if ((search_dimension)){
      other.o2d ? required_array.push('2D') : required_array.push('3D');
    }
    if (other.othx) required_array.push('THX');
    if (other.opre) required_array.push('PRE');
    
    $.each(window.moviesData, function(id, movie) {
      if ((movieName!='' && (movie.name.toUpperCase().indexOf(movieName.toUpperCase()) != -1) && (movie.rat <= maxRating))||(movieName=='' && (movie.rat <= maxRating))) {
        initialList.push(movie);
      }
    });
    
    $.each(initialList, function(idMovie, movie) {
      show = false;
      //verifica se tem um dos idiomas de search_language_array
      if (search_language_array.length>0){
        for (each in search_language_array){
          if (movie[search_language_array[each]] != undefined && movie[search_language_array[each]]) {
            show = true;
          }
        }
      }
      else {show = true;}  
      
      if (show){
        //verifica se tem todos de required_array
        for (each in required_array){
          if (movie[required_array[each]] == undefined || !movie[required_array[each]]) {
            show = false;
          }
        }
        if (show){
          addMoviesToSearchList(movie);
        }
      }
    });
  });
  
  //reseta lista de busca
  var clearSearch = function() {
    $('#movies_search_list-mp').html('');
  }
  
  // Adiciona filme a lista de busca
  var addMoviesToSearchList = function(movie) {
    $('<li><a class="retangular-movie-poster" href="#movie_details" onclick="selectMovie(' + movie.id + ')"><img src="' + movie.img + '"/><h1>' + movie.name + '</h1><p><span class="ui-btn-up-a cinefilia-bubble">' + movie.rat + '</span></p></a></li>').appendTo('#movies_search_list-mp');
    if ($('#movies_search_list-mp').hasClass('ui-listview')) {
      $('#movies_search_list-mp').listview('refresh');
    }
  };
    
  // end of cruel dragons
  window.selectMovie = function(id) {
    window.selectedMovieId = id;
    var movie = window.moviesList[id];
    $('#movie-title').html(movie.name);
    $('#mini-poster').attr('src', movie.img);
    $('#categorias').html(movie.cat.join(", "));
    $('#director').html(movie.dir.join(", "));
    $('#stars').html(movie.actors.join(", "));
    $('#rating').html(movie.rat);
    $('#sinopse').html(movie.sinopse);

    $('#movie_cinemas_list').html('');

    var cinemas = new Array();
    $.each(movie.horarios, function(id, horario) {
      cinemas.push(horario.cinema);
    });
    cinemas = cinemas.filter(function(elem, pos) {
      return cinemas.indexOf(elem) == pos;
    });

    if (cinemas.length > 0) {
      $('<li data-role="list-divider">Em cartaz nos seguintes cinemas:</li>').appendTo('#movie_cinemas_list');
      for (i = 0; i < cinemas.length; i++) {
        var cinema = window.cinemasData[cinemas[i]];
        $('<li><a name="exhibition" href="#movie_cinema" onclick="moviesCinemas('+id+','+cinemas[i]+')"><img src="' + cinema.logo + '"/><h1>' + cinema.name + '</h1></a></li>').appendTo('#movie_cinemas_list');
      }
      if ($('#movie_cinemas_list').hasClass('ui-listview')) {
        $('#movie_cinemas_list').listview('refresh');
      }
    }
  }
  
    // preenche dados da pagina movie_cinema
  window.moviesCinemas = function(movie, cinema){

    //obtem filme e obtem cinema pelo clique
    var filme_clicado = movie;
    var cinema_clicado = cinema;
    var lista = new Array();
    var datas = new Array();
    
    $.each(window.moviesList[filme_clicado].horarios, function (id, sessao) {
      if (sessao.cinema == cinema_clicado){
          datas[sessao.data] = true;
          lista.push(sessao);
      }
    });
    
    $('#exhibitions_list-mp').html('');
    for (data in datas){
      $('<li data-role="list-divider">'+data+'</li>').appendTo('#exhibitions_list-mp');
      $.each(lista, function(idL, exibicao){
        if (exibicao.data == data){
          var detalhes = '';
          $.each(exibicao.det, function(idD, detalhe){
            detalhes += '<span class="ui-btn-up-a cinefilia-bubble">' + detalhe + '</span>'
          });
          $('<li><h1>' + exibicao.hora+' - Sala '+exibicao.sala+' - '+detalhes+'</h1>').appendTo('#exhibitions_list-mp');
        }
      });
    }
    if ($('#exhibitions_list-mp').hasClass('ui-listview')) {
      $('#exhibitions_list-mp').listview('refresh');
    }
  }
  
  
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






