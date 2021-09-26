function trim(StrList) {
  let result = StrList.join();
  if (result.length >= 25) {
    result = result.slice(0, 25);
    result += "...";
  }
  return result;
};
      
function UpdateAmenitiesHeader() {
  let CheckedItems = [];
  let CheckedAmenities = $( "input[name='AmenitiesCheck']:checked" );
  let header = $( "div.amenities h4" );
  CheckedAmenities.each(function(index, element) {
    CheckedItems.push($( element ).attr("data-name"));
  });
  if (CheckedItems.length !== 0) {
    header.text(trim(CheckedItems));
  } else {
    header.html("&nbsp;");
  }
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
  let UserName = "";
  $.get(`http://127.0.0.1:5001/api/v1/users/${PlaceElement.user_id}`, function(data) {
    let UserDiv = $( `section.places article div.user[data-id='${PlaceElement.user_id}']`);
    if (UserDiv.attr("no-user") === 'T') {
      UserDiv.append(" " + data.first_name + " " + data.last_name);
      UserDiv.removeAttr("no-user");
    }
  });
  
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
    <div class="user" data-id=${PlaceElement.user_id} no-user="T">
      <b>Owner:</b> ${UserName}
    </div>
    <div class="description">
      ${PlaceElement.description}
      </div>
  </article>`;
  return result;
};


function GetPlaces() {
  let PlaceSection = $( "section.places" );
  $.ajaxSetup({
    headers: {
        'Content-Type': 'application/json'
    }
  });
  $.post("http://127.0.0.1:5001/api/v1/places_search", JSON.stringify({}), function(data, status) {
    data.forEach(function(element) {
      let html = jQuery.parseHTML(AssemblePlaceCard(element));
      PlaceSection.append(html);
    });
  });
};


$( document ).ready(function() { 
  $( "input[name='AmenitiesCheck']" ).click(UpdateAmenitiesHeader);
  UpdateApiStatus();
  $( "div#api_status" ).click(UpdateApiStatus);
  GetPlaces();
});
      