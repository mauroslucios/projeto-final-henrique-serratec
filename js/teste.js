let listaCervejas = [];
var listaTeste = [];
let listaFavoritos = [];
let page = 1;
let param = 80;
let endpoint_url = `https://api.punkapi.com/v2/beers?page=${page}&per_page=${param}"`
let valor_busca = '';
let addModal = [];
lista(param);

if (valor_busca == '') {
    $(window).scroll(function () {
        if (page < 6) {
            if ($(window).scrollTop() == $(document).height() - $(window).height() && $("#busca").val() == '') {
                // listaTeste = [];
                page++;
                lista(param);
            }
        }
    });
}

function lista(param = 80) {
    listaCervejas = [];
    endpoint_url = `https://api.punkapi.com/v2/beers?page=${page}&per_page=${param}`
    $.getJSON(endpoint_url, function (data) {
        data.forEach(element => {
            // console.log(element.image_url);
            if (element.image_url === null) {
                element.image_url = "https://cdn.awsli.com.br/600x450/91/91186/produto/3172537/3bd879a51f.jpg";
            }
            listaCervejas.push(element)
        });

        formataLista(listaCervejas);
        console.log(listaCervejas)
    });

}

function formataLista(vetor) {
    vetor.forEach(element => {
        beerHtml =
            `
            <div class="card">
            <a><i class="far fa-star" onclick="addFavoritos(${element.id})"></i></a>
            <img class="card-img-top img-fluid" src="${element.image_url}" alt="${element.name}" data-dismiss="modal" data-toggle="modal" data-target="#popup" onclick="formataModal(${element.id})"/>
            <div class="card-body">
                <h4 class="card-title" style="font-size:14px; font-weight:bold">${element.name}</h4>
                <p class="card-text">${element.tagline}</p>
            </div>
            </div>
            `
        $("#painel").append(beerHtml);
    });
}

function preencheDeckModal(vetor) {
    addModal.push(vetor);
    var vetorDeck = listaCervejas.filter(item => { return addModal.includes(item.id) });

    // console.log(vetorDeck);

    listaCervejas.forEach(element => {
        if (element.ebc == vetorDeck[0].ebc) {
            if (!vetorDeck.includes(element))
                vetorDeck.push(element);
        }
    });
    // console.log(vetorDeck);
    return vetorDeck;
}

function formataModal(element) {
    let listaModal = [];
    listaModal.push(element);
    let modal = listaCervejas.filter(item => { return listaModal.includes(item.id) });

    // console.log(preencheDeckModal(element));

    

    let modalHtml =
        `
    <div class="modal-content">
        <!--Body-->
        <div class="modal-body">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
        </button>
            <div class="text-center">
                <div class="container">
                    <div class="row cointainer-fluid mt-4">
                        <div class="col-md-4" style="text-align:center; padding:0 0; margin:0 0;">
                            <img class="card-img-top" src="${modal[0].image_url}" alt="Card image cap"
                                style="margin:0 -10px; text-align:center;max-width:100%; max-height:500px; width:auto; height:auto;">
                        </div>
                        <div class="col-md-8">
                            <h2>${modal[0].name}</h2>
                            <h4>${modal[0].tagline}</h4>
                            <hr style="border: 1px solid; color:purple; width:20%; margin-left:0; display:block;">
                            <span>
                                <label>IBU:</label> ${modal[0].ibu}
                            </span>
                            <span>
                                <label class="not">ABV:</label> ${modal[0].abv}
                            </span>
                            <span>
                                <label class="not">EBC:</label> ${modal[0].ebc}
                            </span>
                            <p class="text-left">${modal[0].description}</p>
                            <div style=""><h5>Best served with:</h5>
                            <ul id="lista_comidas">
                                <!--<li>${modal[0].food_pairing[0]}</li>
                                <li>${modal[0].food_pairing[1]}</li>
                                <li>${modal[0].food_pairing[2]}</li>-->
                            </ul>
                            </div>
                        </div>
                    </div>
                    <p><h5>You might also like:</h5></p>
                    <div class="row">
                        <div class="card-deck cerveja row container-fluid mt-4" id="deck_modal" style="display:flex;">
                        </div>
                    </div>
                    </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    `;
    $("#interior_popup").empty();
    $("#interior_popup").append(modalHtml);
    
    $("#lista_comidas").empty();
    let modalFood;
    let comidas = modal[0].food_pairing;
    console.log("comidas: ",comidas)
    comidas.forEach(element => {
        modalFood=
        `
        <li>${element}</li>
        `;
        $("#lista_comidas").append(modalFood);
    });
   
    
    console.log("preencheModal:",preencheDeckModal(element));
    teste=preencheDeckModal(element);
    console.log("modal:",modal)
    $("#deck_modal").empty();
   
    let modalDeck;
    for(let i=0;i<3;i++){
        modalDeck = 
        `
        <div class="card">
            <a><i class="far fa-star" onclick="addFavoritos(${teste[i].id})"></i></a>
            <img class="card-img-top img-fluid" src="${teste[i].image_url}" alt="${teste[i].name}" data-dismiss="modal" data-toggle="modal" data-target="#popup" onclick="formataModal(${teste[i].id})"/>
            <div class="card-body">
                <h4 class="card-title" style="font-size:14px; font-weight:bold">${teste[i].name}</h4>
                <p class="card-text">${teste[i].tagline}</p>
            </div>
        </div>
        `;
        $("#deck_modal").append(modalDeck);
    }

    
    
}

function buscaCerveja(digitado) {
    $("#painel").empty();
    if (!digitado) {
        listaCervejas = [];
        lista(param);

    }
    let xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var resposta = JSON.parse(this.responseText);
            formataLista(resposta);
            console.log(resposta);
        }
    };
    if (digitado != '') {
        xhttp.open("GET", "https://api.punkapi.com/v2/beers?beer_name=" + digitado, true)
        xhttp.send();
    }
}

function addFavoritos(element) {
    if (typeof (Storage) !== "undefined") {
        if (sessionStorage.listaFavoritos) {
            listaFavoritos = JSON.parse(sessionStorage.getItem("listaFavoritos"));
        } else {
            listaFavoritos = [];
        }
        if (listaFavoritos.includes(element)) {
            listaFavoritos.splice(listaFavoritos.indexOf(element), 1);
        } else {
            listaFavoritos.push(element);
        }
        sessionStorage.listaFavoritos = JSON.stringify(listaFavoritos);

        var fav = listaCervejas.filter(item => { return listaFavoritos.includes(item.id) });
        console.log(fav);

    }
    return fav;
}

function listaFav(vetor = addFavoritos()) {
    $("#painel").empty();
    page = 6;
    listaCervejasFavoritas = vetor;
    $.getJSON(endpoint_url, function (data) {
        formataLista(listaCervejasFavoritas);
        console.log(listaCervejasFavoritas)
    });
}