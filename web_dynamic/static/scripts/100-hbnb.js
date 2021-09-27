function trim(StrList) {
  let result = StrList.join();
  if (result.length >= 25) {
    result = result.slice(0, 25);
    result += "...";
  }
  return result;
};
      
function GetAmenities() {
  let CheckedItems = [];
  let CheckedItemsID = [];

  let CheckedAmenities = $( "input[name='AmenitiesCheck']:checked" );

  CheckedAmenities.each(function(index, element) {
    CheckedItems.push($( element ).attr("data-name"));
    CheckedItemsID.push($( element ).attr("data-id"));
  });

  return {"items": CheckedItems, "itemsID": CheckedItemsID};
};

function GetLocations() {
  let CheckedStates = [];
  let CheckedStatesID = [];

  let CheckedCities = [];
  let CheckedCitiesID = [];

  let States = $( "input[name='StateCheck']:checked" );
  let Cities = $( "input[name='CityCheck']:checked" );

  States.each(function(index, element) {
    CheckedStates.push($( element ).attr("data-name"));
    CheckedStatesID.push($( element ).attr("data-id"));
  });

  Cities.each(function(index, element) {
    CheckedCities.push($( element ).attr("data-name"));
    CheckedCitiesID.push($( element ).attr("data-id"));
  });

  return {"states": CheckedStates, "statesID": CheckedStatesID, "cities": CheckedCities, "citiesID": CheckedCitiesID};
};

function UpdateAmenitiesHeader() {
  let amenities = GetAmenities();
  let AmenitiesHeader = $( "div.amenities h4" );

  if (amenities.items.length !== 0) {
    AmenitiesHeader.text(trim(amenities.items));
  } else {
    AmenitiesHeader.html("&nbsp;");
  }
};

function UpdateLocationsHeader() {
  let locations = GetLocations();
  let LocationsHeader = $( "div.locations h4" );

  CheckedLocations = locations.states.concat(locations.cities);
  console.log(CheckedLocations.cities);
  if (CheckedLocations.length !== 0) {
    LocationsHeader.text(trim(CheckedLocations));
  } else {
    LocationsHeader.html("&nbsp;");
  }
};

function UpdatePlaces() {
  let amenities = GetAmenities();
  let locations = GetLocations();

  GetPlaces({"states": locations.statesID, "cities": locations.citiesID, "amenities": amenities.itemsID});
};

function UpdateApiStatus() {
  let success = 0;
  $.get("http://127.0.0.1:5001/api/v1/status/", function(data, status) {
    success = 1;
    let status_button = $( "div#api_status" )
    if (data.status === "OK") {
      if (!status_button.hasClass("available")) {
        $( "div#api_status" ).addClass("available");
      }
    } 
  });
  if (!success){
    $( "div#api_status" ).removeClass("available");
  }
};

function AssemblePlaceCard(PlaceElement) {
  let MaxGuest = (PlaceElement.max_guest > 1)? PlaceElement.max_guest + ' Guests' : PlaceElement.max_guest + ' Guest';
  let NumberRooms = (PlaceElement.number_rooms > 1)? PlaceElement.number_rooms + ' Bedrooms' : PlaceElement.number_rooms + ' Bedroom';
  let NumberBathrooms = (PlaceElement.number_bathrooms > 1)? PlaceElement.number_bathrooms + ' Bathrooms' : PlaceElement.number_bathrooms + ' Bathroom';
  // let UserName = "";
  // $.get(`http://127.0.0.1:5001/api/v1/users/${PlaceElement.user_id}`, function(data) {
  //   let UserDiv = $( `section.places article div.user[data-id='${PlaceElement.user_id}']`);
  //   if (UserDiv.attr("no-user") === 'T') {
  //     UserDiv.append(" " + data.first_name + " " + data.last_name);
  //     UserDiv.removeAttr("no-user");
  //   }
  // });
  
  let result = `<article>
    <div class="title_box">
      <h2>${PlaceElement.name}</h2>
      <div class="price_by_night">$${PlaceElement.price_by_night}</div>
    </div>
    <div class="information">
      <div class="max_guest">${MaxGuest}</div>
      <div class="number_rooms">${NumberRooms}</div>
      <div class="number_bathrooms">${NumberBathrooms}</div>
    </div>
    <div class="description">
      ${PlaceElement.description}
      </div>
  </article>`;
  return result;
};


function GetPlaces(filters) {
  let PlaceSection = $( "section.places" );
  PlaceSection.html("");
  $.ajaxSetup({
    headers: {
        'Content-Type': 'application/json'
    }
  });
  $.post("http://127.0.0.1:5001/api/v1/places_search", JSON.stringify(filters), function(data, status) {
    data.forEach(function(element) {
      let html = jQuery.parseHTML(AssemblePlaceCard(element));
      PlaceSection.append(html);
    });
  });
};


$( document ).ready(function() {
  UpdateApiStatus();
  $( "div#api_status" ).click(UpdateApiStatus);
  GetPlaces({});

  $( "input[name='AmenitiesCheck']" ).click(UpdateAmenitiesHeader);
  $( "input[name='StateCheck']" ).click(UpdateLocationsHeader);
  $( "input[name='CityCheck']" ).click(UpdateLocationsHeader);

  $( "button" ).click(UpdatePlaces);
});
