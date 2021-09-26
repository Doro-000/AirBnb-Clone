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

$( document ).ready(function() { 
  $( "input[name='AmenitiesCheck']" ).click(UpdateAmenitiesHeader);
  UpdateApiStatus();
  $( "div#api_status" ).click(UpdateApiStatus);
});
      