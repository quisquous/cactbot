// Fractal Continuum (Hard)
[{
  zoneRegex: /^The Fractal Continuum \(Hard\)$/,
  triggers: [
    {
      id: 'Fractal Swipe',
      regex: /14:2AE5:Servomechanical Minotaur starts using 16-Tonze Swipe/,
      infoText: 'swipe',
      tts: 'swipe',
    },
    {
      id: 'Fractal Swing',
      regex: /14:2AE4:Servomechanical Minotaur starts using 128-Tonze Swing/,
      alertText: 'Swing',
      tts: 'swing',
    },
    {
      id: 'Fractal Dragon Voice',
      regex: /starts using The Dragon's Voice/,
      alertText: "Dragon's Voice",
      tts: 'dragon',
    },
    {
      id: 'Fractal Ram Voice',
      regex: /starts using The Ram's Voice/,
      alertText: "Ram's Voice",
      tts: 'ram',
    },
    {
      id: 'Fractal Death Spin',
      regex: /14:27AD:The Ultima Beast starts using Death Spin/,
      alertText: 'Get Out',
      tts: 'out out out',
    },
    {
      id: 'Fractal Aether Bend',
      regex: /14:27AF:The Ultima Beast starts using Aether Bend/,
      alertText: 'Get In',
      tts: 'in in in',
    },
  ],
}]
