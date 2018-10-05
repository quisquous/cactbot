'use strict';

// O10N - Alphascape 2.0
[{
  zoneRegex: /^(Alphascape \(V2.0\)|Alphascape V2.0)$/,
  timelineFile: 'o10n.txt',
  triggers: [
    {
      id: 'O10N Spin Cleanup',
      regex: /15:\y{ObjectId}:Midgardsormr:31C[78]:/,
      delaySeconds: 10,
      run: function(data) {
        delete data.lastSpinWasHorizontal;
      },
    },
    {
      id: 'O10N Horizontal Spin 1',
      regex: /15:\y{ObjectId}:Midgardsormr:31C7:/,
      infoText: {

        en: 'Next Spin: In or Out',
        fr: 'Tour suivant : Dedans/Dehors',
      },
      run: function(data) {
        data.lastSpinWasHorizontal = true;
      },
    },
    {
      id: 'O10N Vertical Spin 1',
      regex: /15:\y{ObjectId}:Midgardsormr:31C8:/,
      infoText: {
        en: 'Next Spin: Cardinals or Corners',
        fr: 'Tour suivant : Croix/Plus',
      },
      run: function(data) {
        data.lastSpinWasHorizontal = false;
      },
    },
    {
      id: 'O10N Horizontal Spin 2',
      regex: /15:\y{ObjectId}:Midgardsormr:31C9:/,
      condition: function(data) {
        return data.lastSpinWasHorizontal !== undefined;
      },
      alertText: function(data) {
        if (data.lastSpinWasHorizontal) {
          return {
            en: 'Get Out',
            fr: 'Sortez',

          };
        }
        return {
          en: 'Go To Cardinals',
          fr: 'Allez sur les points cardinaux',
        };
      },
    },
    {
      id: 'O10N Vertical Spin 2',
      regex: /15:\y{ObjectId}:Midgardsormr:31CB:/,
      condition: function(data) {
        return data.lastSpinWasHorizontal !== undefined;
      },
      alertText: function(data) {
        if (data.lastSpinWasHorizontal) {
          return {
            en: 'Get In',
            fr: 'Allez sous le boss',

          };
        }
        return {
          en: 'Go To Corners',
          fr: 'Allez dans les coins',
        };
      },
    },
  ],
}];
