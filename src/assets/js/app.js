$(document).foundation();

// Anything related to the API that can/will be reused should be placed in there
var API = {
    // Default API url
    'url': 'https://internetsemlimites.herokuapp.com/api/',
    // Maps acronym to State names for pretty printing
    'statesMap': {
        'AC': { name: 'Acre', providers: [] },
        'AL': { name: 'Alagoas', providers: [] },
        'AM': { name: 'Amazonas', providers: [] },
        'AP': { name: 'Amapá', providers: [] },
        'BA': { name: 'Bahia', providers: [] },
        'CE': { name: 'Ceará', providers: [] },
        'DF': { name: 'Distrito Federal', providers: [] },
        'ES': { name: 'Espírito Santo', providers: [] },
        'GO': { name: 'Goiás', providers: [] },
        'MA': { name: 'Maranhão', providers: [] },
        'MG': { name: 'Minas Gerais', providers: [] },
        'MS': { name: 'Mato Grosso do Sul', providers: [] },
        'MT': { name: 'Mato Grosso', providers: [] },
        'PA': { name: 'Pará', providers: [] },
        'PB': { name: 'Paraíba', providers: [] },
        'PE': { name: 'Pernambuco', providers: [] },
        'PI': { name: 'Piauí', providers: [] },
        'PR': { name: 'Paraná', providers: [] },
        'RJ': { name: 'Rio de Janeiro', providers: [] },
        'RN': { name: 'Rio Grande do Norte', providers: [] },
        'RO': { name: 'Rondônia', providers: [] },
        'RR': { name: 'Roraima', providers: [] },
        'RS': { name: 'Rio Grande do Sul', providers: [] },
        'SC': { name: 'Santa Catarina', providers: [] },
        'SE': { name: 'Sergipe', providers: [] },
        'SP': { name: 'São Paulo', providers: [] },
        'TO': { name: 'Tocantins', providers: [] },
    },
    'hallOfShame': []
};


// Populates the interactive map with states that have Unlimited data providers and the Hall of Shame
$.ajax({
    url: API.url,
    type: 'GET',
    dataType: 'json',
})
.done(function(data) {

    // Hall of Fame (populate map)
    var fame = data['hall-of-fame'];
    var states = []

    // Group the providers by state
    for (var provider of fame) {
        for (var state of provider.coverage) {

            // add provider to the given state provider list
            API.statesMap[state].providers.push(provider);

            // build an array with unique states (to handle hasProvider CSS class later)
            if (states.indexOf(state) === -1) {
              states.push(state);
            }

        }
    }

    // Add the hasProvider class to the related SVG markup in the page
    $(document).ready(function($) {
        states.map((state) => $(`#${state}`).addClass('hasProvider'));
    });

    // Hall of Shame (populate footer)
    var shame = data['hall-of-shame'];
    var listOfShamefulProviders = shame.map((provider) => {
        return (
            $('<div />', {'class': 'column text-center'}).append(
                $('<h3 />').text(provider.name).append(
                    $('<a />', {'href': provider.source}).html('<svg class="svg-icon" viewBox="0 0 1000 858"><use xlink:href="#svg-icon--link"></use></svg>')
                )
            )
        );
    });
    $(document).ready(function($) {
        $('.isp--hell').append(listOfShamefulProviders);
    });
})
.fail(function (xhr, status, err) {
    console.error(url, status, err.toString());
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
    var providers = API.statesMap[id].providers;

    // If for some reason the call succeds but we don't get a valid list of providers, return early.
    if (id && providers.length > 0) {
        $('.isp-list--content').html('');
    } else {
        return;
    }

    // Call was successful, let's clear up the old selected state in the map
    $('.estados').removeClass('active');
    $('.isp-list--header').removeClass('hide');

    // Update the title of the card to match the currently selected state.
    $('.state-card--title').text(API.statesMap[id].name);

    // Loop through each of the returned providers to create a list of jQuery objects that will
    // be appended to the markup
    var listOfProviders = providers.map((provider) => {
        return (
            $('<div />', {'class': 'isp-list--isp'}).append(
                $('<a />', {'class': 'isp-list--left', 'href': provider.url}).text(provider.name),
                $('<span />', {'class': 'isp-list--right'}).append(
                    $('<a />', {'href': provider.source}).html('<svg class="svg-icon" viewBox="0 0 1000 858"><use xlink:href="#svg-icon--link"></use></svg>')
                )
            )
        );
    });
    $('.isp-list--content').append(listOfProviders);

    // Add the .active class to the selected state since we'll now be displaying its information
    $('#' + id).addClass('active');

});
