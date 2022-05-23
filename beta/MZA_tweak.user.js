// ==UserScript==
// @name         MZA tweak
// @version      0.9.8
// @downloadURL  https://github.com/rasasak/MZA_tweak/raw/main/MZA_tweak.user.js
// @updateURL    https://github.com/rasasak/MZA_tweak/raw/main/MZA_tweak.user.js
// @description  Malá vylepšení pro web MZA...
// @author       Rasasak
// @match        https://www.mza.cz/actapublica/matrika/detail/*
// @match        https://www.mza.cz/scitacioperaty/digisada/detail/*
// @icon         https://www.mza.cz/actapublica/assets/favicon/android-chrome-192x192.png
// @require      https://code.jquery.com/jquery-3.6.0.slim.min.js
// @grant        unsafeWindow
// @grant        GM.setValue
// @grant        GM.getValue
// ==/UserScript==
$( document ).ready(function() {
var g = unsafeWindow.g_viewer;
var d = document;
var actaPublica = window.location.href.indexOf("actapublica/matrika/detail") > -1;
var scitaciOperaty = window.location.href.indexOf("scitacioperaty/digisada/detail") > -1;
var isLogged = $( "#account" ).length;

// click2zoom => dblClick2zoom
g.gestureSettingsMouse.clickToZoom = false
g.gestureSettingsMouse.dblClickToZoom = true

// prepare referal strip
g.showReferenceStrip = true;
g.referenceStripScroll = "vertical";

//posun šipek do vychoziho stavu
$('#prev-image').after($('#next-image'))

if (actaPublica) {
    // dates in header
    var birth = d.querySelector('#matrika-header .nav:nth-child(2) .nav-item:nth-child(1) .nav .nav-item:nth-child(1) span').textContent;
    var married = d.querySelector('#matrika-header .nav:nth-child(2) .nav-item:nth-child(1) .nav .nav-item:nth-child(2) span').textContent;
    var died = d.querySelector('#matrika-header .nav:nth-child(2) .nav-item:nth-child(1) .nav .nav-item:nth-child(3) span').textContent;
    // indexes in header
    var ibirth = d.querySelector('#matrika-header .nav:nth-child(2) .nav-item:nth-child(2) .nav .nav-item:nth-child(1) span').textContent;
    var imarried = d.querySelector('#matrika-header .nav:nth-child(2) .nav-item:nth-child(2) .nav .nav-item:nth-child(2) span ').textContent;
    var idied = d.querySelector('#matrika-header .nav:nth-child(2) .nav-item:nth-child(2) .nav .nav-item:nth-child(3) span ').textContent;

    var vyhledavani = $('#navbarCollapse .navbar-nav .nav-item:nth-child(1) a').first();
    var vyhledavani_dropdown = $('#navbarCollapse .navbar-nav .nav-item:nth-child(2) a').first();
    var aktuality = $('#navbarCollapse .navbar-nav .nav-item:nth-child(3) a').first();
    var dokumenty = $('#navbarCollapse .navbar-nav .nav-item:nth-child(4) a').first();
    var napoveda = $('#navbarCollapse .navbar-nav .nav-item:nth-child(5) a').first();
    var kontaktni_formular = $('#navbarCollapse .navbar-nav .nav-item:nth-child(6) a').first();
    var zalozky = $('#navbarCollapse .navbar-nav .nav-item:nth-child(7) a').first();

    var matrika_text = $('#matrika-header .nav .navbar-text');
    var button_back = $('#matrika-header ul .mt-1 .nav li:nth-child(4)').detach()

if(isLogged){
     var addToBookmark = $('#matrika-pripinacky button:last-child').detach()
}

    // priprava pripinacku
    addGlobalStyle('#matrika-pripinacky .dropdown:hover>.dropdown-menu {display: block;');
    addGlobalStyle('#matrika-pripinacky .dropdown>.dropdown-toggle:active {pointer-events: none;}');
    addGlobalStyle('#matrika-pripinacky .dropdown .dropdown-menu > a:hover {background-color:#28A745; color:white; cursor: pointer;}');
    addGlobalStyle('#matrika-pripinacky .dropdown .dropdown-menu {max-height: 480px;overflow-y: auto;}');
    var pripinacky=""
    $("#matrika-pripinacky button").each(function(index,element) {
                            pripinacky += `<a class="dropdown-item" onclick="`+$(this).attr("onclick")+`"><i class="fas fa-fw fa-sm fa-thumbtack"></i> `+$(this).data("original-title").replace('Část matriky: ','')+`</a>`
                            });
    $("#matrika-pripinacky").prepend(`<div class="dropdown" style="display:none;">
                                     <button class="btn btn-outline-success dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" >
                                     <i class="fas fa-thumbtack"></i>
                                     </button>
                                     <div class="dropdown-menu" aria-labelledby="dropdownMenuButton" style="border-color: #28A745; margin-top: -1px">
                                     `+pripinacky+`
                                     </div>
                                     </div>`)
    if(pripinacky==""){$("#matrika-pripinacky").hide()}
}
//toolbar for buttons
let toolbar = document.querySelector('#seadragon-toolbar .form-group');

//buttons/////////////////////////////////////////////////////////////////////////////////////////////
var btnMinus25 = makeButtonText('minus25', '-25 snímků', '-25');
var btnMinus10 = makeButtonText('minusTen', '-10 snímků', '-10');
var btnMinus1 = makeButton('minus1', 'Předchozí snímek', 'fas fa-angle-left');
var btnPlus1 = makeButton('plus1', 'Další snímek', 'fas fa-angle-right');
var btnPlus10 = makeButtonText('plusTen', '+10 snímků', '+10');
var btnPlus25 = makeButtonText('plus25', '+25 snímků', '+25');
var btnDezoomify = makeButton('dezoomify', 'Stáhnout (Dezoomify)', 'fas fa-cloud-download-alt');

$('#prev-image').before(btnMinus25);
$('#prev-image').before(btnMinus10);
$('#prev-image').after(btnMinus1);
$('#next-image').before(btnPlus1);
$('#next-image').after(btnPlus10);
$(btnPlus10).after(btnPlus25);
toolbar.after(btnDezoomify);

btnMinus25.onclick = () => {
    var idx = g.currentPage() - 25;
	g.goToPage(Math.max(idx, 0));
    updateNavigationButtons()
};

btnMinus10.onclick = () => {
    var idx = g.currentPage() - 10;
	g.goToPage(Math.max(idx, 0));
    updateNavigationButtons()
};

btnMinus1.onclick = () => {
    var idx = g.currentPage() - 1;
	g.goToPage(Math.max(idx, 0));
    updateNavigationButtons()
};

btnPlus1.onclick = () => {
	let idx = g.currentPage() + 1;
	g.goToPage(Math.min(idx, g.tileSources.length - 1));
    updateNavigationButtons()
};


btnPlus10.onclick = () => {
	let idx = g.currentPage() + 10;
	g.goToPage(Math.min(idx, g.tileSources.length - 1));
    updateNavigationButtons()
};

btnPlus25.onclick = () => {
	let idx = g.currentPage() + 25;
	g.goToPage(Math.min(idx, g.tileSources.length - 1));
    updateNavigationButtons()
};

btnDezoomify.onclick = () => {
    let dezoomify_url = g.tileSources[g.currentPage()];
    console.log("DZI: " + dezoomify_url);
    dezoomify_url = "https://dezoomify.rasasak.cz/#" + dezoomify_url;
    window.open(dezoomify_url, '_blank');
};


//setting div
var divSettings = document.createElement('div');
    divSettings.setAttribute('class', 'form-check');
    divSettings.classList.add("pt-2");

var divSettings2 = document.createElement('div');
    divSettings.setAttribute('class', 'form-check');
    divSettings.classList.add("pt-2");

//INPUTS////////////////////////////////////////////////////////////////
var inpCompact = makeInput("compact", "Kompaktní režim", false)
var inpNav10 = makeInput("navigace10", "+/- 10", true, [btnPlus10, btnMinus10])
var inpNav25 = makeInput("navigace25", "+/- 25", false, [btnPlus25, btnMinus25])
var inpStrip = makeInput("reference_strip", "Postranní pás", false)
var inpPins = makeInput("dropdown_pin", "Seskupené připínáčky" ,false)


divSettings.append(inpCompact);
divSettings.append(makeSettingSpacer());
divSettings.append(inpNav10);
divSettings.append(makeSettingSpacer());
divSettings.append(inpNav25);
divSettings.append(makeSettingSpacer());
divSettings.append(inpStrip);

divSettings2.append(inpPins);

GM.getValue("compact", false).then(value => {
    inpCompact.firstChild.checked = value;
    compacted(value)
    if (value) {
        updateMySeadragonHeight()
    } else {
        updateSeadragonHeight()
    };
});

GM.getValue("reference_strip", false).then(value => {
    inpStrip.firstChild.checked = value;
    if (value) {//TRUE
        g.addReferenceStrip();
    } else {//FALSE
        g.removeReferenceStrip();
    };
});


    GM.getValue("dropdown_pin", false).then(value => {
        inpPins.firstChild.checked = value;
        if (value == true) {
            $("#matrika-pripinacky>.dropdown").attr('style','display:inline-block !important');
            $("#matrika-pripinacky>button").hide()
        } else {
            $("#matrika-pripinacky>.dropdown").attr('style','display:none !important');
            $("#matrika-pripinacky>button").show()
        }
    });



inpCompact.firstChild.onclick = () => {
    GM.getValue("compact", false).then(value => {
        if (value == true) {
            GM.setValue("compact", false);
            inpCompact.firstChild.checked = false;
            compacted(false)
            console.log('Kompaktní režim =', false);
        } else {
            GM.setValue("compact", true);
            inpCompact.firstChild.checked = true;
            compacted(true)
            console.log('Kompaktní režim =', true);
        }
    });
};


inpNav10.firstChild.onclick = () => {
    GM.getValue("navigace10", true).then(value => {
        if (value == true) {
            GM.setValue("navigace10", false);
            inpNav10.firstChild.checked = false;
            btnPlus10.style.display = "none";
            btnMinus10.style.display = "none";
            console.log('Rozšířená (10) navigace =', false);
        } else {
            GM.setValue("navigace10", true);
            inpNav10.firstChild.checked = true;
            btnPlus10.style.display = "";
            btnMinus10.style.display = "";
            console.log('Rozšířená (10) navigace =', true);
        }
    });
};


inpNav25.firstChild.onclick = () => {
    GM.getValue("navigace25", false).then(value => {
        if (value == true) {
            GM.setValue("navigace25", false);
            inpNav25.firstChild.checked = false;
            btnPlus25.style.display = "none";
            btnMinus25.style.display = "none";
            console.log('Rozšířená (25) navigace =', false);
        } else {
            GM.setValue("navigace25", true);
            inpNav25.firstChild.checked = true;
            btnPlus25.style.display = "";
            btnMinus25.style.display = "";
            console.log('Rozšířená (25) navigace =', true);
        }
    });
};

inpStrip.firstChild.onclick = () => {
    GM.getValue("reference_strip", false).then(value => {
        if (value == true) {
            GM.setValue("reference_strip", false);
            inpStrip.firstChild.checked = false;
            g.removeReferenceStrip();
            console.log('Postranní pás =', false);
        } else {
            GM.setValue("reference_strip", true);
            inpStrip.firstChild.checked = true;
            g.addReferenceStrip();
            console.log('Referenční pás =', true);
        }
    });
};

inpPins.firstChild.onclick = () => {
    GM.getValue("dropdown_pin", false).then(value => {
        if (value == true) {
            GM.setValue("dropdown_pin", false);
            inpPins.firstChild.checked = false;
            $("#matrika-pripinacky>.dropdown").attr('style','display:none !important');
            $("#matrika-pripinacky>button").show()
            console.log('Seskupené připínáčky =', false);
        } else {
            GM.setValue("dropdown_pin", true);
            inpPins.firstChild.checked = true;
            $("#matrika-pripinacky>.dropdown").attr('style','display:inline-block !important');
            $("#matrika-pripinacky>button").hide()
            console.log('Seskupené připínáčky =', true);
        }
    });
};



// normalize

$("#prev-image").hide();
$("#next-image").hide();
$("#full-page").empty().append('<i class="fas fa-expand"></i>');
$("#step-10-forward").hide();
$("#step-10-backward").hide();
$("#plus25").after($("#last-image"));

//});

    $('#adjustImagePanel').append(divSettings);
    $('#adjustImagePanel').append(divSettings2);

if(scitaciOperaty){
   inpPins.style.display="none"
}


function makeButton(id, title, icon) {
    let btn = document.createElement('button');
    btn.setAttribute('id', id);
    btn.setAttribute('type', 'button');
    btn.setAttribute('class', 'btn btn-light mr-1');
    btn.setAttribute('title', title);
    btn.setAttribute('style', 'display: inline-block; position: relative;');

    let icn = document.createElement('i');
    icn.setAttribute('class', icon);

    btn.append(icn);
    return btn;
}

function makeButtonText(id, title, text,) {
    let btn = document.createElement('button');
    btn.setAttribute('id', id);
    btn.setAttribute('type', 'button');
    btn.setAttribute('class', 'btn btn-light mr-1');
    btn.setAttribute('title', title);
    btn.setAttribute('style', 'display: inline-block; position: relative; font-weight:bold;');

    btn.append(text);
    return btn;
}

function makeInput(id, title, def, array = false) {
    let div = document.createElement('div');
    div.setAttribute('class', 'form-check')
    let inp = document.createElement('input');
    inp.setAttribute('class', 'form-check-input');
    inp.setAttribute('type', 'checkbox');
    inp.setAttribute('id', id);
    if (array) {
        GM.getValue(id, def).then(value => {
            inp.checked = value;
            for (var i = 0; i < array.length; i++) {
                if (value == true) {
                    array[i].style.display = "inline-block";
                } else {
                    array[i].style.display = "none";
                }
            }
        });
    };
    let lab = document.createElement('label');
    lab.setAttribute('class', 'form-check-label');
    lab.setAttribute('for', id);
    lab.append(title);

    div.append(inp)
    div.append(lab);
    return div

}




function makeSettingSpacer() {
    let spc = document.createElement('div');
    spc.setAttribute('class', 'px-2');
    spc.append("|")
    return spc
}




function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

function compacted(bool) {
    if (bool) {//TRUE
        layoutCompact()
        prepareMySeadragonHeight()
    } else {//FALSE
        layoutNormal()
        prepareSeadragonHeight()
    };

};

function layoutCompact() {
    $('.navbar-brand').first().hide(); // logo skrýt
    $('nav').removeClass('py-2 px-3').addClass('py-0 px-2'); //vyska vrchniho panelu
    $('#more-space').hide(); //skryt MZA kompakt
    if( $( "#more-space" ).hasClass( "active" ) ){ toggleMoreSpace() }

    if (actaPublica) {
        matrika_text.hide();
        $('#matrika-header .nav').first().prepend(button_back)

        $('#seadragon-toolbar .form-group .input-group .input-group-prepend').hide()
        $('footer').removeClass('py-3').addClass('py-2');

        $('#navbarCollapse ul').first().append($('#matrika-header ul .mt-1').last())
        $('#navbarCollapse ul .mt-1 .nav li:nth-child(1)').addClass('ml-4 mr-2').removeClass('mr-3').children().addClass('btn-sm').text('Snímky')
        $('#navbarCollapse ul .mt-1 .nav li:nth-child(1)').children().attr("onclick", "setTimeout(updateMySeadragonHeight, 1)");
        $('#navbarCollapse ul .mt-1 .nav li:nth-child(2)').addClass('mr-2').removeClass('mr-3').children().addClass('btn-sm').text('Podrobnosti')
        let parts = $('#navbarCollapse ul .mt-1 .nav li:nth-child(3) a').text()
        parts = parts.match(/\((.*)\)/);
        if(parts){
        	$('#navbarCollapse ul .mt-1 .nav li:nth-child(3) a').addClass('btn-sm').text('Části ' + parts[0])
        }
        $('#navbarCollapse ul .mt-1 ').removeClass('nav-item')
        $('#matrika-header .nav').first().append(`<li id="date-indexes" class="nav-item pl-3">
					<ul class="nav">
                      <li class="nav-item pt-2 pl-3">
					    <span class="align-middle" style="font-size:1.5rem">N</span><br>
					  </li>
					  <li class="nav-item pl-2 pr-3" style="min-width: 80px;">
					    <span class="font-weight-bolder">`+ birth + `</span><br>
					    <span class="small font-italic">`+ ibirth + `</span>
					  </li>
                      <li class="nav-item pt-2 pl-3">
					    <span class="align-middle" style="font-size:1.5rem">O</span><br>
					  </li>
					  <li class="nav-item pl-2 pr-3" style="min-width: 80px;">
					    <span class="font-weight-bolder">`+ married + `</span><br>
					    <span class="small font-italic">`+ imarried + `</span>
					  </li>
                       <li class="nav-item pt-2 pl-3">
					    <span class="align-middle" style="font-size:1.5rem">Z</span><br>
					  </li>
					  <li class="nav-item pl-2 pr-3" style="min-width: 80px;">
					    <span class="font-weight-bolder">`+ died + `</span><br>
					    <span class="small font-italic">`+ idied + `</span>
					  </li>
					</ul>
				      </li>`);
        $('#matrika-header .nav:nth-child(2)').hide();

        $('#matrika-pripinacky').removeClass('pt-2').addClass('pt-1')
        $('#matrika-pripinacky button').addClass('btn-sm')
        $('#seadragon-toolbar').removeClass('pt-2 pb-2').addClass('pt-1 pb-1')
        //ikony v hlavnim panelu
        vyhledavani.attr('title', 'Vyhledávání').empty().append('<i class="mx-1 fas fa-fw fa-search fa-sm"></i>');
        vyhledavani_dropdown.hide();
        aktuality.attr('title', 'Aktuality').empty().append('<i class="fas fa-fw fa-rss fa-sm"></i>')
        dokumenty.attr('title', 'Dokumenty').empty().append('<i class="fas fa-fw fa-book fa-sm"></i>')
        napoveda.attr('title', 'Nápověda').empty().append('<i class="fas fa-fw fa-question-circle fa-sm"></i>')
        kontaktni_formular.attr('title', 'Kontaktní formulář').empty().append('<i class="fas fa-fw fa-envelope fa-sm"></i>')

        $('#navbarCollapse .navbar-nav').first().append( $('#matrika-pripinacky').addClass('ml-4') )
        $("#matrika-pripinacky button").removeClass('btn-outline-success').addClass('btn-outline-warning')

        //pripinacky
        $("#matrika-pripinacky .dropdown .dropdown-menu").css('border-color', '#FFC107')
        $("#matrika-pripinacky .dropdown .dropdown-menu .dropdown-item").hover(
            function () {
                $(this).css("background-color", "#FFC107");
                $(this).css("color", "#000000");
            },
            function () {
                $(this).css("background-color", "#FFFFFF");
                $(this).css("color", "#000000");
            }
        );
        if(isLogged){
            zalozky.attr('title', 'Záložky').empty().append('<i class="fas fa-fw fa-bookmark fa-sm"></i>')
            $('#navbarCollapse ul li ul').append(addToBookmark.attr('class','ml-2 btn btn-sm btn-outline-warning'))
        }
    }
    if (scitaciOperaty) {
        $('.navbar-brand').eq(1).css('font-size','1.25rem');  //zmeva velikosti pisma SCITACI OPERATY
        $('#header nav div').first().addClass('container-fluid').removeClass('container-md')
        $('body nav').css('border-bottom-width', '0px');
        addGlobalStyle('.card-body { padding: 4px ! important; };');
        $('nav').removeClass('py-2 px-3').addClass('py-0 px-2');
        $('footer').removeClass('py-3').addClass('py-2')
        $('.input-group-prepend').hide()
        //ikony v hlavnim panelu
        $('#navbarCollapse .navbar-nav .nav-item:nth-child(1) a').first().attr('title', 'Vyhledávání').empty().append('<i class="mx-1 fas fa-fw fa-search fa-sm"></i>');
        $('#navbarCollapse .navbar-nav .nav-item:nth-child(2) a').first().attr('title', 'Nápověda').empty().append('<i class="fas fa-fw fa-question-circle fa-sm"></i>')
        $('#navbarCollapse .navbar-nav .nav-item:nth-child(3) a').first().attr('title', 'Kontaktní formulář').empty().append('<i class="fas fa-fw fa-envelope fa-sm"></i>')
        $('main').removeClass('pb-2')
        $('#content').removeClass('py-2')

        $('.navbar-nav').first().append( $('.nav-pills') )
        $('.nav-pills').addClass('ml-4')
        $('#pills').hide()

        $('#digisada-header .row .col:nth-child(1) p').hide()
        $('#digisada-header .row .col:nth-child(1) a').html('<i class="fas fa-lg fa-arrow-circle-left"></i>')
        $('#digisada-header .row .col:nth-child(1) a').removeClass('btn-secondary').addClass('text-light')
        $('#digisada-header .row .col:nth-child(2) ul').first().append( $('#digisada-header .row .col:nth-child(2) ul').eq(1) )
    };
}


function layoutNormal() {
    $('.navbar-brand').first().show(); // logo zobrazit
    $('nav').removeClass('py-0 px-2').addClass('py-2 px-3'); //vyska vrchniho panelu
    $('#more-space').show(); //zobrazit MZA kompakt

    if (actaPublica) {
        $('#date-indexes').remove()
        $('#matrika-header .nav:nth-child(2)').show();
        matrika_text.show();

        $('#seadragon-toolbar .form-group .input-group .input-group-prepend').show()
        $('footer').removeClass('py-2').addClass('py-3');

        $('#navbarCollapse ul .mt-1 .nav li:nth-child(1)').removeClass('ml-5 mr-2').addClass('mr-3').children().removeClass('btn-sm').text('Digitalizované stránky')
        $('#navbarCollapse ul .mt-1 .nav li:nth-child(1)').children().attr("onclick", "setTimeout(updateSeadragonHeight, 1)");
        $('#navbarCollapse ul .mt-1 .nav li:nth-child(2)').removeClass('mr-2').addClass('mr-3').children().removeClass('btn-sm').text('Podrobnosti o matrice')
        let parts = $('#navbarCollapse ul .mt-1 .nav li:nth-child(3) a').text()
        parts = parts.match(/\((.*)\)/);
      	if(parts){
        	$('#navbarCollapse ul .mt-1 .nav li:nth-child(3) a').removeClass('btn-sm').text('Části matriky ' + parts[0])
        }
        $('#matrika-header ul').first().append($('#navbarCollapse .mt-1'))

        $('#matrika-header .nav .mt-1 .nav').append(button_back)

        //let backurl = $('#matrika-header ul .mt-1 .nav li:nth-child(4) a').attr('href')
        //backurl = backurl.split('/').pop()
        //$('#matrika-header ul .mt-1 .nav li:nth-child(4) a').attr('href', '/actapublica/matrika/' + backurl)
        $('#matrika-pripinacky').removeClass('pt-1').addClass('pt-2')
        $('#matrika-pripinacky button').removeClass('btn-sm')
        $('#seadragon-toolbar').removeClass('pt-1 pb-1').addClass('pt-2 pb-2')
        //ikony v hlavnim panelu
        vyhledavani.attr('title', '').empty().append('<i class="fas fa-search"></i>&nbsp;Vyhledávání')
        vyhledavani_dropdown.show();
        aktuality.attr('title', '').empty().append('Aktuality')
        dokumenty.attr('title', '').empty().append('Dokumenty')
        napoveda.attr('title', '').empty().append('Nápověda')
        kontaktni_formular.attr('title', '').empty().append('<i class="fas fa-envelope fa-sm"></i>&nbsp;Kontaktní formulář')

        $('#pill_images').first().prepend( $('#matrika-pripinacky').removeClass('ml-4') )
        $("#matrika-pripinacky button").removeClass('btn-outline-warning').addClass('btn-outline-success')

        //pripinacky:
        $("#matrika-pripinacky .dropdown .dropdown-menu").css('border-color', '#28A745')
        $("#matrika-pripinacky .dropdown .dropdown-menu .dropdown-item").hover(
            function () {
                $(this).css("background-color", "#28A745");
                $(this).css("color", "#FFFFFF");
            },
            function () {
                $(this).css("background-color", "#FFFFFF");
                $(this).css("color", "#000000");
            }
        );
      if(isLogged){
          zalozky.attr('title', '').empty().append('Záložky')
          $('#matrika-pripinacky').css('display','inline-block')
          $('#matrika-pripinacky').after(addToBookmark.attr('class','ml-3 btn btn-outline-secondary'))
      }


    }
    if (scitaciOperaty) {
        $('.navbar-brand').eq(1).css('font-size','200%'); //zmeva velikosti pisma SCITACI OPERATY
        $('#header nav div').first().addClass('container-md').removeClass('container-fluid')
        $('body nav').css('border-bottom-width', '4px');
        addGlobalStyle('.card-body { padding: 20px ! important; };');
        $('nav').removeClass('py-0 px-2').addClass('py-2 px-3');
        $('footer').removeClass('py-2').addClass('py-3')
        $('.input-group-prepend').show()
        //ikony v hlavnim panelu
        $('#navbarCollapse .navbar-nav .nav-item:nth-child(1) a').first().attr('title', '').empty().append('<i class="fas fa-search"></i>&nbsp;Vyhledávání')
        $('#navbarCollapse .navbar-nav .nav-item:nth-child(2) a').first().attr('title', '').empty().append('<i class="fas fa-question-circle"></i>&nbsp;Nápověda')
        $('#navbarCollapse .navbar-nav .nav-item:nth-child(3) a').first().attr('title', '').empty().append('<i class="fas fa-envelope"></i>&nbsp;Kontaktní formulář')

        $('main').addClass('pb-2')
        $('#content').addClass('py-2')

        $('#pills').first().append( $('.nav-pills') )
         $('.nav-pills').removeClass('ml-4')
        $('#pills').show()

        $('#digisada-header .row .col:nth-child(1) p').show()
        $('#digisada-header .row .col:nth-child(1) a').html('<i class="fas fa-arrow-circle-left"></i>  zpět na hledání')
        $('#digisada-header .row .col:nth-child(1) a').removeClass('text-light').addClass('btn-secondary')
        $('#digisada-header .row .col:nth-child(2) ul').first().append( $('#digisada-header .row .col:nth-child(2) ul').eq(1) )
        $('#digisada-header .row .col:nth-child(2)').append( $('#digisada-header .row .col:nth-child(2) ul ul') )
    };
}



function updateMySeadragonHeight(round = 1) {
    if (g.isFullPage()) {
        //fullscreen mode
        return;
    }

    var toolbarHeight = $("#seadragon-toolbar").outerHeight(true);
    if (toolbarHeight == 0 && round <= 8) {
        //asi prepinani tabu, chvilku pockam...
        //console.log("waiting " + round);
        setTimeout(function () { updateMySeadragonHeight(round + 1); }, 50 * round);
    }

    //var height = $(window).height() - $("#header").outerHeight(true) - $("#matrika-header").outerHeight(true) - $("#matrika-pripinacky").outerHeight(true) - $("#seadragon-toolbar").outerHeight(true);
    if(actaPublica){
       var height = $(window).height() - $("#header").outerHeight(true) - $("#matrika-header").outerHeight(true) - $("#seadragon-toolbar").outerHeight(true);
    }else if(scitaciOperaty){
       var headerHeight = $('#header').css('display') == 'none' ? 0 : $("#header").outerHeight(true);
	   //var footerHeight = $('#footer').css('display') == 'none' ? 0 : $("#footer").innerHeight();
       var height = $(window).height() - headerHeight  - ($("main").outerHeight(true) - $("#openseadragon").outerHeight(true));
    }

function updateSeadragonHeight(round = 1)
{
	if (g_viewer.isFullPage()) {
		//fullscreen mode
		return;
	}

	var toolbarHeight = $("#seadragon-toolbar").outerHeight(true);
	if (toolbarHeight == 0 && round <= 8) {
		//asi prepinani tabu, chvilku pockam...
		//console.log("waiting " + round);
		setTimeout(function() { updateSeadragonHeight(round + 1); }, 50 * round);
	}

	var headerHeight = $('#header').css('display') == 'none' ? 0 : $("#header").outerHeight(true);
	var footerHeight = $('#footer').css('display') == 'none' ? 0 : $("#footer").innerHeight();

	var height = $(window).height() - headerHeight - $("#matrika-header").outerHeight(true) - $("#matrika-pripinacky").outerHeight(true) - $("#seadragon-toolbar").outerHeight(true) - footerHeight;

	//vyska ale musi byt aspon 200px
	height = Math.max(height, 200);

	$('#openseadragon').css({ 'height': height + 'px' });
}



/*
        console.log(
            "window: " + $(window).outerHeight(true) +
            ", header: " + $("#header").outerHeight(true) +
            ", matrika-header: " + $("#matrika-header").outerHeight(true) +
            ", matrika-pripinacky: " + $("#matrika-pripinacky").outerHeight(true) +
            ", seadragon-toolbar: " + $("#seadragon-toolbar").outerHeight(true) +
            ", footer: " + $("#footer").innerHeight());
        console.log("Height: " + height);
*/

    //vyska ale musi byt aspon 200px
    height = Math.max(height, 200);

    $('#openseadragon').css({ 'height': height + 'px' });
}

/**
 * Nastaveni handleru, aby se Vyska SeaDragonu prizpusobovala vysce okna
 */
function prepareMySeadragonHeight() {
    $(window).resize(updateMySeadragonHeight);
    updateMySeadragonHeight();
}



//injection popover hover

function exec(fn) {
    var script = document.createElement('script');
    script.setAttribute("type", "application/javascript");
    script.textContent = '(' + fn + ')();';
    document.body.appendChild(script); // run the script
    document.body.removeChild(script); // clean up
}


exec(function () {
    $('[data-toggle="popover"]').popover('dispose');
    $('[data-toggle="popover"]').popover({
        trigger: 'hover click'
    })
});




var script = document.createElement('script');
script.setAttribute("type", "text/javascript");
script.textContent = `
function updateNavigationButtons()
{
	var firstPage = g_viewer.currentPage() == 0;
	var lastPage = g_viewer.currentPage() == g_viewer.tileSources.length - 1;

	document.getElementById('first-image').disabled = firstPage;
	document.getElementById('first-image').style.opacity = firstPage ? 0.2 : 'initial';
	document.getElementById('minus1').disabled = firstPage;
	document.getElementById('minus1').style.opacity = firstPage ? 0.2 : 'initial';
	document.getElementById('minusTen').disabled = firstPage;
	document.getElementById('minusTen').style.opacity = firstPage ? 0.2 : 'initial';
    document.getElementById('minus25').disabled = firstPage;
	document.getElementById('minus25').style.opacity = firstPage ? 0.2 : 'initial';
	document.getElementById('last-image').disabled = lastPage;
	document.getElementById('last-image').style.opacity = lastPage ? 0.2 : 'initial';
	document.getElementById('plus1').disabled = lastPage;
	document.getElementById('plus1').style.opacity = lastPage ? 0.2 : 'initial';
	document.getElementById('plusTen').disabled = lastPage;
	document.getElementById('plusTen').style.opacity = lastPage ? 0.2 : 'initial';
	document.getElementById('plus25').disabled = lastPage;
	document.getElementById('plus25').style.opacity = lastPage ? 0.2 : 'initial';
}
updateNavigationButtons()
`
document.body.appendChild(  script  );


$(document).keydown(function(e){
    if($("#input-page").is(':focus') || $(".openseadragon-canvas").is(':focus')){
    }else{
    if (e.which == 37 || e.which == 65) { //left arrow
        let idx = g.currentPage() - 1;
        g.goToPage(Math.max(idx, 0));
        updateNavigationButtons()
        return false;
    }
    if (e.which == 40 || e.which == 83) { //left arrow
        let idx = g.currentPage() - 10;
        g.goToPage(Math.max(idx, 0));
        updateNavigationButtons()
        return false;
    }
    if (e.which == 39 || e.which == 68) { //right arrow
        let idx = g.currentPage() + 1;
        g.goToPage(Math.min(idx, g.tileSources.length - 1));
        updateNavigationButtons()
        return false;
    }
    if (e.which == 38 || e.which == 87) { //up arrow
        let idx = g.currentPage() + 10;
        g.goToPage(Math.min(idx, g.tileSources.length - 1));
        updateNavigationButtons()
        return false;
    }
    if (e.which == 36){ //home
        g.goToPage(0);
        updateNavigationButtons()
        return false;
    }
    if (e.which == 35){ //end
        g.goToPage(g.tileSources.length-1);
        updateNavigationButtons();
        return false;
    }
    if (e.which == 107){ //plus
        g.viewport.zoomBy(1.1)
    return false;
    }
    if (e.which == 109){ //plus
        g.viewport.zoomBy(0.9)
    return false;
    }
  }
}
);
});
