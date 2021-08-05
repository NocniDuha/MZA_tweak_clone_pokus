// ==UserScript==
// @name         Actapublica tweak
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Make Actapublica great... again?
// @author       Rasasak
// @match        https://www.mza.cz/actapublica/matrika/detail/*
// @match        https://www.mza.cz/scitacioperaty/digisada/*
// @icon         https://www.mza.cz/actapublica/assets/favicon/android-chrome-192x192.png
// @require http://code.jquery.com/jquery-latest.js
// ==/UserScript==

$(document).ready(function() {
    // dates in header
   var birth = $('#matrikaHeader .row div:nth-child(3) p strong').text()
   var married = $('#matrikaHeader .row div:nth-child(4) p strong').text()
   var died = $('#matrikaHeader .row div:nth-child(5) p strong').text()

  $('.card-header .nav').append('<li class="nav-item pl-5 pr-3"><span class="small font-italic">Narození od-do</span><br><span class="font-weight-bolder">'+birth+'</span></li>')
  $('.card-header .nav').append('<li class="nav-item px-3"><span class="small font-italic">Oddaní od-do</span><br><span class="font-weight-bolder">'+married+'</span></li>')
  $('.card-header .nav').append('<li class="nav-item px-3"><span class="small font-italic">Zemřelí od-do</span><br><span class="font-weight-bolder">'+died+'</span></li>')

    //delete minimap
    $("[id^='navigator-']").remove()
});
