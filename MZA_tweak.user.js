// ==UserScript==
// @name         MZA tweak
// @version      0.8.6
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

var g = unsafeWindow.g_viewer;
var d = document;
var actaPublica = window.location.href.indexOf("actapublica/matrika/detail") > -1;
var scitaciOperaty = window.location.href.indexOf("scitacioperaty/digisada/detail") > -1;


// click2zoom => dblClick2zoom
g.gestureSettingsMouse.clickToZoom = false
g.gestureSettingsMouse.dblClickToZoom = true

// prepare referal strip
g.showReferenceStrip = true;
g.referenceStripScroll = "vertical";


if (actaPublica) {
    // dates in header
    var birth = d.querySelector('#matrika-header .nav:nth-child(2) .nav-item:nth-child(1) .nav .nav-item:nth-child(1) span').textContent;
    var married = d.querySelector('#matrika-header .nav:nth-child(2) .nav-item:nth-child(1) .nav .nav-item:nth-child(2) span').textContent;
    var died = d.querySelector('#matrika-header .nav:nth-child(2) .nav-item:nth-child(1) .nav .nav-item:nth-child(3) span').textContent;
    // indexes in header
    var ibirth = d.querySelector('#matrika-header .nav:nth-child(2) .nav-item:nth-child(2) .nav .nav-item:nth-child(1) span').textContent;
    var imarried = d.querySelector('#matrika-header .nav:nth-child(2) .nav-item:nth-child(2) .nav .nav-item:nth-child(2) span ').textContent;
    var idied = d.querySelector('#matrika-header .nav:nth-child(2) .nav-item:nth-child(2) .nav .nav-item:nth-child(3) span ').textContent;

    $('#prev-image').after($('#next-image')) //posun šipek na matrikách
}

if (scitaciOperaty) {
    $("main .container-fluid .card .card-body").first().attr('id', 'scitaniHeader').hide();
    $(".card-header").empty();
    var city = d.querySelector('#scitaniHeader .row div:nth-child(1) p strong').textContent;
    var numbers = d.querySelector('#scitaniHeader .row div:nth-child(2) p ').textContent;
    var archive = d.querySelector('#scitaniHeader .row div:nth-child(3) p ').textContent;
    var year = d.querySelector('#scitaniHeader .row:nth-child(2) div:nth-child(3) p ').textContent;


    $('.card-header').append('<ul id="header-nav" class="nav" style="font-size: 60%;"></ul>');
    $('#header-nav').append(`
					  <li class="nav-item px-3 " style="">
					    <span class="small font-italic">Město/obec</span><br>
					    <span class="font-weight-bolder">`+ city + `</span>
					  </li>
					  <li class="nav-item px-3 " style="">
					    <span class="small font-italic">Číslo popisné od-do</span><br>
					    <span class="font-weight-bolder">`+ numbers + `</span>
					  </li>
					  <li class="nav-item px-3 " style="">
					    <span class="small font-italic">Rok sčítání</span><br>
					    <span class="font-weight-bolder">`+ year + `</span>
					  </li>
					  <li class="nav-item px-3 " style="">
					    <span class="small font-italic">Archiv</span><br>
					    <span class="font-weight-bolder">`+ archive + `</span>
					  </li>
				      `);
};


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

if (scitaciOperaty) {
    var btnFirst    = makeButton("first-image", "První snímek", "fas fa-step-backward");
        btnFirst.classList.add("ml-3");
    var btnLast     = makeButton("last-image", "Poslední snímek", "fas fa-step-forward");
        btnLast.classList.add("mr-3");
    var btnPreserve = makeButton('preserve', 'Zachovat zoom a polohu', checkPreserveIcon());
    var btnMinimap  = makeButton("btn_minimap", "Zobrazovat navigaci po obrázku", checkMinimapIcon() )
    var btnSettings = makeButton("adjust-image", "Úprava zobrazení (jas, kontrast)", "fas fa-sliders-h");
        btnSettings.setAttribute("data-toggle","collapse");
        btnSettings.setAttribute("data-target","#adjustImagePanel")

    btnMinus25.before(btnFirst);
    btnPlus25.after(btnLast);
    btnDezoomify.after(btnPreserve);
    btnPreserve.after(btnMinimap)
    btnMinimap.after(btnSettings);

    btnFirst.onclick = () => {
        g.goToPage(0)
        updateNavigationButtons()
    };

    btnLast.onclick = () => {
        g.goToPage(g.tileSources.length - 1)
        updateNavigationButtons()
    };
    g.navigator.element.style.display = "none";
    btnMinimap.onclick = () => {
        GM.getValue("minimapa", "false").then(value => {
            if (value == true) {
                GM.setValue("minimapa", false);
                btnMinimap.firstChild.setAttribute("class","far fa-compass");
                g.navigator.element.style.display = "none";
                console.log('Minimapa =', false);
            } else {
                GM.setValue("minimapa", true);
                btnMinimap.firstChild.setAttribute("class","fas fa-compass");
                g.navigator.element.style.display = "";
                console.log('Minimapa =', true);
            }
        });
    };

    btnPreserve.onclick = () => {
        //toggleNavigator()
        if (g.preserveViewport == false) {
            g.preserveViewport = true
            btnPreserve.firstChild.setAttribute('class', 'fas fa-lock')
        } else {
            g.preserveViewport = false
            btnPreserve.firstChild.setAttribute('class', 'fas fa-unlock')
        }
        console.log('Preserve = ' + g.preserveViewport)
    };

};






//setting div
var divSettings = document.createElement('div');
    divSettings.setAttribute('class', 'form-check');
    divSettings.classList.add("pt-2");

//INPUTS////////////////////////////////////////////////////////////////
var inpCompact = makeInput("compact", "Kompaktní režim", false)
var inpNav10 = makeInput("navigace10", "+/- 10", true, [btnPlus10, btnMinus10])
var inpNav25 = makeInput("navigace25", "+/- 25", false, [btnPlus25, btnMinus25])
var inpStrip = makeInput("reference_strip", "Referenční pás", false)


divSettings.append(inpCompact);
divSettings.append(makeSettingSpacer());
divSettings.append(inpNav10);
divSettings.append(makeSettingSpacer());
divSettings.append(inpNav25);
divSettings.append(makeSettingSpacer());
divSettings.append(inpStrip);

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
            console.log('Referenční pás =', false);
        } else {
            GM.setValue("reference_strip", true);
            inpStrip.firstChild.checked = true;
            g.addReferenceStrip();
            console.log('Referenční pás =', true);
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
if (scitaciOperaty) {
    $('.nav-pills').prepend(`<li class="nav-item">
				        <a class="nav-link" href="https://www.mza.cz/scitacioperaty/digisada/search">
                                            <i class="fas fa-arrow-circle-left"></i> Zpět na vyhledávání
                                        </a>
			            </li>`);
    $("main .container-fluid .row").first().remove();
    $("#zoom-in").empty().append('<i class="fas fa-search-plus"></i>');
    $("#zoom-out").empty().append('<i class="fas fa-search-minus"></i>');
    $("#home").empty().append('<i class="fas fa-home"></i>');
    $("#full-page").empty().append('<i class="fas fa-arrows-alt"></i>');
    $("#prev-image").empty().append('<i class="fas fa-angle-double-left"></i>');
    $("#next-image").empty().append('<i class="fas fa-angle-double-right"></i>');
    $("#full-page").empty().append('<i class="fas fa-expand"></i>');


    // setting button



    $(btnSettings).after(`<div class="collapse" id="adjustImagePanel" style="position: absolute; top: 100%; background: white; border: 1px solid black; margin: 1em; padding: 1em; z-index: 9999; width: 500px;">
		               <span>Jas</span>
		               <input id="brightness-control" type="range" class="custom-range" min="0" max="200" onchange="setBrightness(this.value);" oninput="setBrightness(this.value);">
		               <span>Kontrast</span>
		               <input id="contrast-control" type="range" class="custom-range" min="0" max="200" onchange="setContrast(this.value);" oninput="setContrast(this.value);">
		               <button type="button" class="btn btn-outline-secondary mr-2" title="Vrátit výchozí nastavení" onclick="adjustImage(true);">Výchozí nastavení</button>
		               <button type="button" class="btn btn-outline-secondary" onclick="document.getElementById('adjust-image').click();">Zavřít</button>
                       </div>`)

}

//});


    $('#adjustImagePanel').append(divSettings);




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


function checkPreserveIcon() {
    if (g.preserveViewport == false) {
        return 'fas fa-unlock';
    } else {
        return 'fas fa-lock';
    };
}

function checkMinimapIcon(){
        if( g.navigator.element.style.display.includes("none")){
            return 'fas fa-compass';
        }else{
            return 'far fa-compass'
        }

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
    if (actaPublica) {
        $('.navbar-brand').first().hide();
        $('#search').attr('title', 'Vyhledávání').html('<i class="fas fa-search"></i>');
        $('#matrika-header .nav .navbar-text').hide();
        $('nav').removeClass('py-2 px-3').addClass('py-0 px-2');
        $('#seadragon-toolbar .form-group .input-group .input-group-prepend').hide()
        $('footer').removeClass('py-3').addClass('py-2');
        let backurl = $('#matrika-header ul .mt-1 .nav li:nth-child(4)').children().attr('href')
        backurl = backurl.split('/').pop()
        $('#matrika-header .nav').first().prepend($('#matrika-header ul .mt-1 .nav li:nth-child(4)'))

        $('#navbarCollapse ul').first().append($('#matrika-header ul .mt-1').last())
        $('#navbarCollapse ul .mt-1 .nav li:nth-child(1)').addClass('ml-5 mr-2').removeClass('mr-3').children().addClass('btn-sm').text('Snímky')
        $('#navbarCollapse ul .mt-1 .nav li:nth-child(1)').children().attr("onclick", "setTimeout(updateMySeadragonHeight, 1)");
        $('#navbarCollapse ul .mt-1 .nav li:nth-child(2)').addClass('mr-2').removeClass('mr-3').children().addClass('btn-sm').text('Podrobnosti')
        let parts = $('#navbarCollapse ul .mt-1 .nav li:nth-child(3) a').text()
        parts = parts.match(/\((.*)\)/);
        $('#navbarCollapse ul .mt-1 .nav li:nth-child(3) a').addClass('btn-sm').text('Části ' + parts[0])

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
        $('#matrika-header .nav .nav-item:nth-child(1) a').attr('href', '/actapublica/matrika/' + backurl)

        $('#matrika-pripinacky').removeClass('pt-2').addClass('pt-1')
        $('#matrika-pripinacky button').addClass('btn-sm')
        $('#seadragon-toolbar').removeClass('pt-2 pb-2').addClass('pt-1 pb-1')
        $('#navbarCollapse .navbar-nav .nav-item:nth-child(4) a').attr('title', 'Nápověda').empty().append('<i class="fas fa-question-circle fa-sm"></i>')
        $('#navbarCollapse .navbar-nav .nav-item:nth-child(5) a').attr('title', 'Kontaktní formulář').empty().append('<i class="fas fa-envelope fa-sm"></i>')

    }
    if (scitaciOperaty) {
        $('body .navbar-light').hide();
        $('body nav div').first().removeClass('container-md').addClass('container-fluid');
        $('body nav').css('border-bottom-width', '0px');
        $('body nav').prepend("<a class='navbar-brand px-2' id='nav-brand' href='https://www.mza.cz/scitacioperaty/' style='color:#0B3152; background-color:white;'>Sčítací operáty</a>");
        addGlobalStyle('.card-body { padding: 4px ! important; };');
        $('nav').removeClass('py-2 px-3').addClass('py-0 px-2');
        $('footer').removeClass('py-3').addClass('py-2')
        $('.input-group-prepend').hide()

    };
}


function layoutNormal() {
    if (actaPublica) {
        $('#date-indexes').remove()
        $('#matrika-header .nav:nth-child(2)').show();
        $('.navbar-brand').first().show();
        $('#search').attr('title', '').html('<i class="fas fa-search"></i>&nbsp;Vyhledávání');
        $('#matrika-header .nav .navbar-text').show();
        $('nav').removeClass('py-0 px-2').addClass('py-2 px-3');
        $('#seadragon-toolbar .form-group .input-group .input-group-prepend').show()
        $('footer').removeClass('py-2').addClass('py-3');

        $('#navbarCollapse ul .mt-1 .nav li:nth-child(1)').removeClass('ml-5 mr-2').addClass('mr-3').children().removeClass('btn-sm').text('Digitalizované stránky')
        $('#navbarCollapse ul .mt-1 .nav li:nth-child(1)').children().attr("onclick", "setTimeout(updateSeadragonHeight, 1)");
        $('#navbarCollapse ul .mt-1 .nav li:nth-child(2)').removeClass('mr-2').addClass('mr-3').children().removeClass('btn-sm').text('Podrobnosti o matrice')
        let parts = $('#navbarCollapse ul .mt-1 .nav li:nth-child(3) a').text()
        parts = parts.match(/\((.*)\)/);
        $('#navbarCollapse ul .mt-1 .nav li:nth-child(3) a').removeClass('btn-sm').text('Části matriky ' + parts[0])
        $('#matrika-header ul').first().append($('#navbarCollapse .mt-1'))
        $('#matrika-header .nav .mt-1 .nav').append($('#matrika-header ul li').first())
        let backurl = $('#matrika-header ul .mt-1 .nav li:nth-child(4) a').attr('href')
        backurl = backurl.split('/').pop()
        $('#matrika-header ul .mt-1 .nav li:nth-child(4) a').attr('href', '/actapublica/matrika/' + backurl)
        $('#matrika-pripinacky').removeClass('pt-1').addClass('pt-2')
        $('#matrika-pripinacky button').removeClass('btn-sm')
        $('#seadragon-toolbar').removeClass('pt-1 pb-1').addClass('pt-2 pb-2')
        $('#navbarCollapse .navbar-nav .nav-item:nth-child(4) a').attr('title', '').empty().append('Nápověda')
        $('#navbarCollapse .navbar-nav .nav-item:nth-child(5) a').attr('title', '').empty().append('<i class="fas fa-envelope fa-sm"></i>&nbsp;Kontaktní formulář')

    }
    if (scitaciOperaty) {
        $('body .navbar-light').show();
        $('body nav div').first().removeClass('container-fluid').addClass('container-md');
        $('body nav').css('border-bottom-width', '4px');
        $('#nav-brand').remove();
        addGlobalStyle('.card-body { padding: 20px ! important; };');
        $('nav').removeClass('py-0 px-2').addClass('py-2 px-3');
        $('footer').removeClass('py-2').addClass('py-3')
        $('.input-group-prepend').show()


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

    var height = $(window).height() - $("#header").outerHeight(true) - $("#matrika-header").outerHeight(true) - $("#matrika-pripinacky").outerHeight(true) - $("#seadragon-toolbar").outerHeight(true);

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




if(scitaciOperaty){
var script1 = document.createElement('script');
script1.setAttribute("type", "text/javascript");
script1.textContent = `


var brightness = 100;
var contrast = 100;

function setBrightness(value)
{
	brightness = value;
	adjustImage(false);
}

function setContrast(value)
{
	contrast = value;
	adjustImage(false);
}

function adjustImage(reset)
{
	if (reset) {
		document.getElementById('brightness-control').value = 100;
		document.getElementById('contrast-control').value = 100;
		brightness = 100;
		contrast = 100;
	}

	document.getElementById('openseadragon').style.filter = 'brightness(' + brightness + '%) contrast(' + contrast + '%)';



}
`
document.body.appendChild(  script1  );

}
/*
$.fn.immediateText = function() {
    return this.contents().not(this.children()).text();
};

var puvodce = $('.table tbody tr:nth-child(4) td:nth-child(2)').first().immediateText().trim()
console.log( $('.table tbody tr:nth-child(4) td:nth-child(2)').first().contents().eq(0).wrap("<a href='https://www.mza.cz/actapublica/matrika/hledani_puvodce?typ_puvodce_id=&search_by_puvodce="+puvodce+"'></a>")  )
*/
