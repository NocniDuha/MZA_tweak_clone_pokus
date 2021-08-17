// ==UserScript==
// @name         MZA tweak
// @version      0.6.5
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
	var birth = $('#matrikaHeader .row div:nth-child(3) p strong').text();
	var married = $('#matrikaHeader .row div:nth-child(4) p strong').text();
	var died = $('#matrikaHeader .row div:nth-child(5) p strong').text();

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
				      </li>`);

	//delete minimap
	unsafeWindow.g_viewer.navigator.element.style.display = "none";

	//toolbar for buttons  
	let toolbar = document.querySelector('#seadragon-toolbar .form-group');

	//dezoomify button  
	let btnDezoomify = document.createElement('a');
	btnDezoomify.setAttribute('id','dezoomify');
	btnDezoomify.setAttribute('type','button');
	btnDezoomify.setAttribute('class','btn btn-light mr-1');
	btnDezoomify.setAttribute('title','Stáhnout (Dezoomify)');
	btnDezoomify.setAttribute('style','display: inline-block; position: relative;');

	let icnDezoomify = document.createElement('i');
	icnDezoomify.setAttribute('class','fas fa-cloud-download-alt');

  	toolbar.after(btnDezoomify);
  	btnDezoomify.append(icnDezoomify);

	btnDezoomify.onclick = () => {
		var dezoomify_url = unsafeWindow.g_viewer.tileSources[unsafeWindow.g_viewer.currentPage()];
		dezoomify_url = "https://dezoomify.ophir.dev/#"+dezoomify_url;
		console.log("DZI: "+dezoomify_url);
		window.open(dezoomify_url, '_blank');      
	};
  

	//preserve button
	let btnPreserve = document.createElement('a');
	btnPreserve.setAttribute('id','preserve');
	btnPreserve.setAttribute('type','button');
	btnPreserve.setAttribute('class','btn btn-light mr-1');
	btnPreserve.setAttribute('title','Zachovat zoom a polohu');
	btnPreserve.setAttribute('style','display: inline-block; position: relative;');
  
	let icnPreserve = document.createElement('i');
	icnPreserve.setAttribute('id','preserve_icon') ;
	if (unsafeWindow.g_viewer.preserveViewport == false){
		icnPreserve.setAttribute('class','fas fa-fw fa-lock-open');
	}else{
		icnPreserve.setAttribute('class','fas fa-fw fa-lock');
	};

	toolbar.after(btnPreserve);
	btnPreserve.append(icnPreserve);

	btnPreserve.onclick = () => {
		if (unsafeWindow.g_viewer.preserveViewport == false){
			unsafeWindow.g_viewer.preserveViewport = true
			icnPreserve.setAttribute('class','fas fa-fw fa-lock')
		}else{
			unsafeWindow.g_viewer.preserveViewport = false
			icnPreserve.setAttribute('class','fas fa-fw fa-lock-open')
		}
		console.log('Preserve = '+unsafeWindow.g_viewer.preserveViewport)
	};	


 
	// normalize
	if (window.location.href.indexOf("scitacioperaty/digisada/detail") > -1) {
          $('.nav-pills').prepend(`<li class="nav-item">
				        <a class="nav-link" href="https://www.mza.cz/scitacioperaty/digisada/search">
                                            <i class="fas fa-arrow-circle-left"></i> Zpět na vyhledávání
                                        </a>
			            </li>`)
            $("main .container-fluid .row").first().remove()
            $("#zoom-in").empty().append('<i class="fas fa-search-plus"></i>')
            $("#zoom-out").empty().append('<i class="fas fa-search-minus"></i>')
            $("#home").empty().append('<i class="fas fa-home"></i>')
            $("#full-page").empty().append('<i class="fas fa-arrows-alt"></i>')
            $("#prev-image").empty().append('<i class="fas fa-angle-double-left"></i>')
            $("#next-image").empty().append('<i class="fas fa-angle-double-right"></i>')
    }

});
