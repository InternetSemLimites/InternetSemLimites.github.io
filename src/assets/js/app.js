$(document).foundation();

// auxiliar function to sort arrays of objects by `name` property
var compare = function (firstObj, nextObj) {
  if (firstObj.name < nextObj.name) {
    return -1;
  } else if (firstObj.name > nextObj.name) {
    return 1;
  }
  return 0;
};

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

    // make a sorted list with state names and abbreviation (to feed the select menu)
    var sortedStates = states.map((state) => {
      return { name: API.statesMap[state].name, abbr: state };
    }).sort(compare);

    // Add the hasProvider class to the related SVG markup in the page
    $(document).ready(function($) {

        var selectMenu = document.getElementById('states');
        sortedStates.map((state) => {
          
            // show states with providers in the map
            $(`#${state.abbr}`).addClass('hasProvider');

            // add states with providers to the select menu
            var optionTag = document.createElement('option');
            optionTag.setAttribute('value', state.abbr);
            optionTag.innerHTML = API.statesMap[state.abbr].name;
            selectMenu.appendChild(optionTag);

        });
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

// On click of any state in the interactive map, or from the select menu,
// we will load the providers from the API object

var loadProviders = function (event) {

    // Return early since this is already the currently selected state
    if ($(this).hasClass('active') || $(this).attr('selected') === 'selected') {
        return;
    }

    // get the state id
    var id = null;
    if (event.type == 'change') {
      id = $(this).val();
    } else {
      id = $(this).attr('id');
    }

    // shorcut for the state providers array
    var providers = API.statesMap[id].providers;

    // if for some reason we don't get a valid list of providers, return early
    if (!id || providers.length > 0) {
        $('.isp-list--content').html('');
    } else {
        return;
    }

    // Call was successful, let's clear up the old selected state
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
    $('#states').val(id);

};

$(document).on('click', '.estados.hasProvider', loadProviders);
$(document).on('change', '#states', loadProviders);
