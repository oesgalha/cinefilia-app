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
  var rating = {rL:false, r10:false, r12:false, r14:false, r16:false, r18:false};
	var language = {ldub:false, lleg:false, lnac:false};
	var other = {o2d:false, o3d:false, othx:false};
		
  $(":checkbox").click(this, function(event) {
		var type = this.id.substring(0,1)
		var type2 = this.id
				
		switch(type){	
      case 'r':
        rating[type2] = !rating[type2]
        break;
      case 'l':
        language[type2] = !language[type2]
        break;
      case 'o':
        other[type2] = !other[type2]
        break;
      }
		})
			
  $("#src").click(function(){
    for (each in rating){
      alert(each+' : '+rating[each]);
    }
    for (each in language){
      alert(each+' : '+language[each]);
    }
    for (each in other){
      alert(each+' : '+other[each]);
    }
  })
  
  // end of cruel dragons
  

});
