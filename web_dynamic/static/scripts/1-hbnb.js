function UpdateAmenitiesHeader() {
  let CheckedItems = [];
  let CheckedAmenities = $( "input[name='AmenitiesCheck']:checked" );
  let header = $( "div.amenities h4" );
  CheckedAmenities.each(function(index, element) {
    CheckedItems.push($( element ).attr("data-name"));
  });
  if (CheckedItems.length !== 0) {
    header.text(CheckedItems);
  } else {
    header.html("&nbsp;");
  }
};

$( document ).ready(function() { 
  $( "input[name='AmenitiesCheck']" ).click(UpdateAmenitiesHeader);
});
