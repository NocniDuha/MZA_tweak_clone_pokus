// ==UserScript==
// @name         MZA tweak
// @version      0.6.4.1
// @downloadURL  https://github.com/rasasak/MZA_tweak/raw/main/MZA_tweak.user.js
// @updateURL    https://github.com/rasasak/MZA_tweak/raw/main/MZA_tweak.user.js
// @description  Malá vylepšení pro web MZA...
// @author       Rasasak
// @match        https://www.mza.cz/actapublica/matrika/detail/*
// @match        https://www.mza.cz/scitacioperaty/digisada/*
// @icon         https://www.mza.cz/actapublica/assets/favicon/android-chrome-192x192.png
// @require      http://code.jquery.com/jquery-latest.js
// @grant        unsafeWindow
// ==/UserScript==


$(document).ready(function() {
   // dates in header
   var birth = $('#matrikaHeader .row div:nth-child(3) p strong').text()
   var married = $('#matrikaHeader .row div:nth-child(4) p strong').text()
   var died = $('#matrikaHeader .row div:nth-child(5) p strong').text()

   $('.card-header .nav').append(`<li class="nav-item pl-5">
                                   <ul class="nav">
                                     <li class="nav-item px-3">
                                       <span class="small font-italic">Narození od-do</span><br>
                                       <span class="font-weight-bolder">`+birth+`</span>
                                     </li>
                                     <li class="nav-item px-3">
                                       <span class="small font-italic">Oddaní od-do</span><br>
                                       <span class="font-weight-bolder">`+married+`</span>
                                     </li>
                                     <li class="nav-item px-3">
                                       <span class="small font-italic">Zemřelí od-do</span><br>
                                       <span class="font-weight-bolder">`+died+`</span>
                                     </li>
                                   </ul>
                                 </li>`)

    //delete minimap
    g_viewer.navigator.element.style.display = "none"

    //dezoomify button
    $('#seadragon-toolbar .form-group').after(`<a onclick="dezoomify()" id="download" type="button" class="btn btn-light mr-1" title="Stáhnout (Dezoomify)" style="display: inline-block; position: relative;">
                                                 <i class="fas fa-cloud-download-alt"></i>
                                               </a>`)
    //preserve button
    $('#seadragon-toolbar .form-group').after(`<a onclick="preserve()" id="preserve" type="button" class="btn btn-light mr-1" title="Zachovat Zoom" style="display: inline-block; position: relative;"></a>`)

    if (g_viewer.preserveViewport == false){
        $('#preserve').append(`<i id=preserve_icon class="fas fa-fw fa-lock-open"></i>`)
    }else{
        $('#preserve').append(`<i id=preserve_icon class="fas fa-fw fa-lock"></i>`)
    }


    // normalize
    if (window.location.href.indexOf("scitacioperaty/digisada/detail") > -1) {
          $('.nav-pills').prepend(`<li class="nav-item">
				        <a class="nav-link" href="https://www.mza.cz/scitacioperaty/digisada/search">
                                            <i class="fas fa-arrow-circle-left"></i> Zpět na vyhledávání
                                        </a>
			                       </li>`)
            $("main .container-fluid .row").first().remove()

            $("#zoom-in").empty()
            $("#zoom-in").append('<i class="fas fa-search-plus"></i>')

            $("#zoom-out").empty()
            $("#zoom-out").append('<i class="fas fa-search-minus"></i>')

            $("#home").empty()
            $("#home").append('<i class="fas fa-home"></i>')

            $("#full-page").empty()
            $("#full-page").append('<i class="fas fa-arrows-alt"></i>')

            $("#prev-image").empty()
            $("#prev-image").append('<i class="fas fa-angle-double-left"></i>')

            $("#next-image").empty()
            $("#next-image").append('<i class="fas fa-angle-double-right"></i>')
    }


});

if(!unsafeWindow.dezoomify)
{
    unsafeWindow.dezoomify = dezoomify;
}

function dezoomify(){
    var dezoomify_url = g_viewer.tileSources[g_viewer.currentPage()]
    dezoomify_url = "https://dezoomify.ophir.dev/#"+dezoomify_url
    window.open(dezoomify_url, '_blank');
}


if(!unsafeWindow.preserve)
{
    unsafeWindow.preserve = preserve;
}

function preserve(){
    if (g_viewer.preserveViewport == false){
        g_viewer.preserveViewport = true
        $('#preserve_icon').attr('class', 'fas fa-fw fa-lock')
    }else{
        g_viewer.preserveViewport = false
        $('#preserve_icon').attr('class', 'fas fa-fw fa-lock-open')
    }
}
