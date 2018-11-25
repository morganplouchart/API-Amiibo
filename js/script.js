$(document).ready(function(){
  $('.sidenav').sidenav();
  $('.showAmiiboSearch').html("<div></div>");
  $('.showAmiibo').html("<div></div>");
  amiiboName();
  amiiboGameSerie();
  $('.modal').modal();
  $('.inventaire').css('display','none');
  $('.count').css('display','none');
  //$('#modal1').modal('open');
  $( window ).scroll(function() {
      console.log("scroll");
  });
});

let SearchItems = [];
let ajoutItems = [];
let ajoutTitle = [];

$(document).on('change','.checkGameseries',function(){
  amiiboName();
});

function filterAmiibo(filterShowAmiibo){

let arrayfilterAmiibo = [];
let amiiboToReturn = [];

let checkBox = $('.GameSerieParent');

for (var i = 0; i < checkBox.length; i++) {
  //debugger;
  if ($(checkBox[i]).find('.checkGameseries:checked').length > 0){
      arrayfilterAmiibo.push($(checkBox[i]).find('.GameSerieOneAmiibo').html());
  }
}

for (var i = 0; i < filterShowAmiibo.length; i++) {
  let filters = filterShowAmiibo[i].amiiboSeries;
  if($.inArray(filters,arrayfilterAmiibo) != -1)
  {
    amiiboToReturn.push(filterShowAmiibo[i]);
  }
}
  return amiiboToReturn;
}

function panier() {
  localStorage.setItem("Ajout", JSON.stringify(ajoutItems[ajoutItems.length - 1]));
  localStorage.setItem("Title", JSON.stringify(ajoutTitle[ajoutTitle.length - 1]));

  if (ajoutItems[ajoutItems.length - 1]) {

    let imagesURL = localStorage.getItem("Ajout").replace(/[\]"\[\\]/g,"");
    let titleURL = localStorage.getItem("Title").replace(/[\]"\[\\]/g,"");
    let qte = 0;

    document.cookie = titleURL;
    document.cookie = imagesURL;

    $('.ItemsIn').append("<tr class='delete'><td class='itemRemove'>" + titleURL + "</td><td class='imgRemove'>" + imagesURL + "<td class='qte'></td>" + qte + "</td><td style='display:flex;' ><button class='add'><i class=' material-icons'>exposure_plus_1</i></button><button class='sup'><i class=' material-icons'>exposure_neg_1</i></button><button class='itemdelete'><i class=' material-icons'>do_not_disturb_alt</i></button></td></tr>");

    $('.validPanier').html("<button>Valider le panier</button>");

    $('.add').on("click", function(){
      $(this).parent().parent().children()[2].innerHTML = ++qte;
    });
    $('.sup').on("click", function(){
      $(this).parent().parent().children()[2].innerHTML = --qte;
    });

    if ($('.delete').length > 1) {
      $('.ItemsIn').css('overflow-y', 'scroll');
    }
    let countItems = $('.delete').length;
    $('.count').text(countItems);

    $('.btn').on("click", function(){
      if (countItems > 0) {
        $('.inventaire').css('display', 'block');
      }else{
        $('.inventaire').css('display', 'none');
      }
    })

    $('.close').on("click", function(){
      $('.inventaire').css('display', 'none');
    });

    $('.itemdelete').on("click",function() {

      $(this).parent().parent().remove();
      $('.count').text(--countItems);
      if (countItems == 0) {
        countItems = 0;
        ajoutTitle = [];
        ajoutItems = [];
        if ($('.delete').length <= 0) {
          $('.inventaire').css('display','none');
        }
        $('.count').text(countItems);
      }
    });

  }

  $('.panier a').css('padding','0px 30px 0px 20px');
  $('.count').css('display','block');
}

//Amiibo name

const amiiboName = function showAmiibo(){
  let Chargement;
  Chargement = true;
  return new Promise(function(reject) {
    if (Chargement) {
      $.get(`http://www.amiiboapi.com/api/amiibo`, function(data){
        let showAmiibo = data.amiibo;
        showAmiibo = filterAmiibo(showAmiibo);
        $('.showAmiibo').empty();
        if(showAmiibo.length == 0){
          showAmiibo = data.amiibo;
        }
        let id = 0;
        showAmiibo.forEach(function(showOneAmiibo) {
          $('.showAmiibo').append("<div class='col s6 m2 animate'><li><p class='title'>" + showOneAmiibo.character + "</p><a href="+ showOneAmiibo.image +" target='_blank'><img class='img' src=" + showOneAmiibo.image + "></a><button id=" + (id++) + " class='ajout' ><i class='small material-icons'>add_circle_outline</i></button></li></div>");
          //debugger;
        });
        $('.ajout').click(function() {
          let images = $(this).parent()[0].querySelector('a').innerHTML;
          let title = $(this).parent()[0].querySelector('p').innerHTML;
          ajoutTitle.push(title);
          ajoutItems.push(images);
          panier();
        });
      })
    } else {
      reject("Chargement de l'application impossible");
    }
  });

}


//Amiibo GAME series
const amiiboGameSerie = function showAmiiboGameSerie(){
  let Chargement;
  Chargement = true;
  return new Promise(function(reject) {
    if (Chargement) {
      $.get(`http://www.amiiboapi.com/api/amiiboseries`, function(data){
        let GameSerieAmiibo = data.amiibo;
        GameSerieAmiibo.forEach(function(GameSerieOneAmiibo) {
          $('#gameSeries').append("<li class='GameSerieParent'><label><input type='checkbox' class='checkGameseries' /><span class='GameSerieOneAmiibo' style='color:#333;'>"+ GameSerieOneAmiibo.name +"</span></label></li>");
        });
      })
      .then(function() {
      })
    } else {
      reject("Chargement de l'application impshowAmiiboossible");
    }
  });

}


//Amiibo Search
const amiiboSearch = function shoclasswAmiibo(resultSearch){
  let Chargement;
  Chargement = true;
  return new Promise(function(reject) {
    if (Chargement) {
      $.get(`http://www.amiiboapi.com/api/amiibo/?character=${resultSearch}`,function(data){
        let id = 1;
        let showAmiiboSearch = data.amiibo;
        showAmiiboSearch.forEach(function(showOneSearchAmiibo) {
          $('.showAmiiboSearch').append("<div class='col s6 m2'><ul><li><p class='title'>" + showOneSearchAmiibo.amiiboSeries + "</p><a class='img' href="+ showOneSearchAmiibo.image +" target='_blank'><img src=" + showOneSearchAmiibo.image + "></a><button id=" + (id++) + " class='ajout' ><i class='small material-icons'>add_circle_outline</i></button></li></ul></div>");
        });
        $('.ajout').click(function() {
          let images = $(this).parent()[0].querySelector('a').innerHTML;
          let title = $(this).parent()[0].querySelector('p').innerHTML;
          ajoutTitle.push(title);
          ajoutItems.push(images);
          panier();
        });
      })
    } else {
      reject("Chargement de l'application impossible");
    }
  });
}

// Permet une recherche dynamique lettre par lettre.
$( "#search" ).keyup(function(event){
  const resultSearch = $('#search').val();
  event.preventDefault();
  amiiboSearch(resultSearch);
  $('.showAmiibo').css("display","none");
  SearchItems.push(resultSearch);
  localStorage.setItem("Search", JSON.stringify(SearchItems));
  if ($('#search').val() == "") {
    $('.showAmiiboSearch').html("<div></div>");
    $('.showAmiibo').html("<div></div>");
    $('.showAmiibo').css("display","block");
    amiiboName();
  }
});


const onClick = function inputClick(){
  $('.showAmiibo').css("display","block");
}
