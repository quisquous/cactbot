// Frontlines: Shatter
[{
  zoneRegex: /^The Fields Of Glory \(Shatter\)$/,
  triggers: [
    {
      id: 'Big Ice',
      regex: /The icebound tomelith A([1-4]) activates and begins to emit heat/,
      alertText: function(data, matches) {
	var big_ice_dir = {
	  "1": "Center",
	  "2": "North",
	  "3": "Southeast",
	  "4": "Southwest",
	}

	if (!(matches[1] in big_ice_dir))
	  return "";
	return "Big Ice: " + big_ice_dir[matches[1]];
      }
    },
  ],
}]
