$(document).foundation();

// Little helper function to remove duplicate values of an array
function getUnique(arr) {
   var u = {}, a = [];
   for(var i = 0, l = arr.length; i < l; ++i){
      if(u.hasOwnProperty(arr[i])) {
         continue;
      }
      a.push(arr[i]);
      u[arr[i]] = 1;
   }
   return a;
}

// Anything related to the API that can/will be reused should be placed in there
var API = {
    // Default API url
    'url': 'https://internetsemlimites.herokuapp.com/api/',
    // Maps acronym to State names for pretty printing
    'statesMap': {
        'AC': 'Acre',
        'AL': 'Alagoas',
        'AM': 'Amazonas',
        'AP': 'Amapá',
        'BA': 'Bahia',
        'CE': 'Ceará',
        'DF': 'Distrito Federal',
        'ES': 'Espírito Santo',
        'GO': 'Goiás',
        'MA': 'Maranhão',
        'MG': 'Minas Gerais',
        'MS': 'Mato Grosso do Sul',
        'MT': 'Mato Grosso',
        'PA': 'Pará',
        'PB': 'Paraíba',
        'PE': 'Pernambuco',
        'PI': 'Piauí',
        'PR': 'Paraná',
        'RJ': 'Rio de Janeiro',
        'RN': 'Rio Grande do Norte',
        'RO': 'Rondônia',
        'RR': 'Roraima',
        'RS': 'Rio Grande do Sul',
        'SC': 'Santa Catarina',
        'SE': 'Sergipe',
        'SP': 'São Paulo',
        'TO': 'Tocantins'
    }
};



$(document).ready(function($) {
    // Populates the interactive map with states that have Unlimited data providers
    $.ajax({
        url: API.url + 'fame/',
        type: 'GET',
        dataType: 'json',
    })
    .done(function(data) {

        var providers = data.providers;
        var estados = [];

        // Get the states that each provider covers and add it to an array
        for(var i = 0; i < providers.length; i++) {
            var provider = providers[i];
            estados = estados.concat(provider.coverage);
        }

        // Remove duplicate entries from the array and add the hasProvider class to the related SVG markup in the page
        estados = getUnique(estados);
        for (var i = 0; i <  estados.length; i++) {
            $('#' + estados[i]).addClass('hasProvider');
        }
    })
    .fail(function(err) {
        console.log('error: ', err);
    });

    // Populates the hall of shame on page load.
    $.ajax({
        url: API.url + 'shame/',
        type: 'GET',
        dataType: 'json',
    })
    .done(function(data) {

        // Creates an array with jQuery objects that will be appended to the markup down below
        var providers = data.providers;
        var list = [];
        for(var i = 0; i < data.providers.length; i++) {
            list.push(
                $('<div />', {'class': 'column text-center'}).append(
                    $('<h3 />').text(providers[i].name),
                    $('<p />').append(
                        $('<a />', {'href': providers[i].source}).text('Fonte')
                    )
                )
            );
        }
        $('.isp--hell').append(list);
    })
    .fail(function(err) {
        console.log("error: ", err);
    });

});

/**
 * On click of every state in the interactive map we will make an API call to fetch all the providers
 * that offer unlimited internet and covers that state. We'll then use that information to populate
 * the list next to the map with that information.
 */
$(document).on('click', '.estados.hasProvider', function(event) {
    // Return early since this is already the currently selected state
    if ($(this).hasClass('active')) {
        return;
    }

    var id = $(this).attr('id');
    $.ajax({
        url: API.url + id + '/fame/',
        type: 'GET',
        dataType: 'json',
    })
    .done(function(data) {

        // If for some reason the call succeds but we don't get a valid list of providers, return early.
        if (id && providers.length > 0) {
            $('.isp-list--content').html('');
        } else {
            return;
        }

        // Call was successful, let's clear up the old selected state in the map
        $('.estados').removeClass('active');

        // Update the title of the card to match the currently selected state.
        $('.state-card--title').text(API.statesMap[id]);

        // Loop through each of the returned providers to create a list of jQuery objects that will
        // be appended to the markup
        var list = [];
        for(var i = 0; i < providers.length; i++) {
            list.push(
                $('<div />', {'class': 'isp-list--isp'}).append(
                    $('<span />', {'class': 'isp-list--left'}).text(providers[i].name),
                    $('<span />', {'class': 'isp-list--right'}).append(
                        $('<a />', {'href': providers[i].source}).text('Link')
                    )
                )
            );
        }
        $('.isp-list--content').append(list);

        // Add the .active class to the selected state since we'll now be displaying its information
        $('#' + id).addClass('active');
    })
    .fail(function(err) {
        console.log('error: ',err);
    })

});
