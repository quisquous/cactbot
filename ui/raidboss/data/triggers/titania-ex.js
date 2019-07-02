'use strict';

// Suzaku Extreme
[{
  zoneRegex: /.*The Dancing Plague.*/,
  timelineFile: 'titania-ex.txt',
  triggers: [
    {
      id: 'TitEx Sabbath',
      regex: /:Titania begins casting Bright Sabbath/,
      alertText: "AoE",
    },
	{
      id: 'TitEx Phantom',
      regex: /:Titania begins casting Phantom Rune/,
      alertText: "In or Out",
    },
	{
      id: 'TitEx Mist',
      regex: /:Titania begins casting Mist Rune/,
      alertText: "Take Water",
    },
	{
      id: 'TitEx Flame',
      regex: /:Titania begins casting Flame Rune/,
      alertText: "Stackmarker",
    },
	{
      id: 'TitEx Divination',
      regex: /:Titania begins casting Divination Rune/,
      alertText: "Tank Buster",
    },
	{
      id: 'TitEx Bramble',
      regex: /:Titania begins casting Chain of Bramble.*/,
      alertText: "Tether move away",
    },
	{
      id: 'TitEx FaeLight',
      regex: /:Titania begins casting Fae Light./,
      alertText: "Tankbuster Split",
    },
	{
      id: 'TitEx FrostRunes',
      regex: /:Titania begins casting Frost Rune./,
      alertText: "Shiva Circles",
    },
	{
      id: 'TitEx GrowthRunes',
      regex: /:Titania begins casting Growth Rune./,
      alertText: "Roots spreading",
    },
  ],
  timelineReplace: [
    // ???
  ],
}];
