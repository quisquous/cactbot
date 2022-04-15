import NetRegexes from '../../../../../resources/netregexes';
import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyTriggerSet } from '../../../../../types/oopsy';

// TODO: Byregot's hammer causing people to fall to their death?
// TODO: Rhalgr's Broken World (fake) 71DD technically does no damage if far enough, but survivable halfway

export type Data = OopsyData;

const triggerSet: OopsyTriggerSet<Data> = {
  zoneId: ZoneId.Aglaia,
  damageWarn: {
    'Aglaia Byregot Byregot\'s Strike': '725A', // blue knockback puck
    'Aglaia Byregot Byregot\'s Strike Lightning': '7168', // cardinal lightning during strike #2
    'Aglaia Byregot Levinforge': '7172', // lightning hammer line
    'Aglaia Byregot Byregot\'s Spire': '7170', // wide line during hammer section
    'Aglaia Byregot Cloud to Ground 1': '704D', // moving purple/yellow bubbles
    'Aglaia Byregot Cloud to Ground 2': '704E', // moving purple/yellow bubbles
    'Aglaia Byregot Cloud to Ground 3': '716D', // moving purple/yellow bubbles
    'Aglaia Byregot Cloud to Ground 4': '716E', // moving purple/yellow bubbles
    'Aglaia Rhalgr\'s Emissary Destructive Static': '70E0', // front 180 cleave
    'Aglaia Rhalgr\'s Emissary Destructive Charge': '70DB', // lightning quadrants
    'Aglaia Rhalgr\'s Emissary Lightning Bolt': '70E2', // targeted circles
    'Aglaia Rhalgr\'s Emissary Boltloop 1': '70DD', // overlapping expanding lightning rings
    'Aglaia Rhalgr\'s Emissary Boltloop 2': '70DE', // overlapping expanding lightning rings
    'Aglaia Rhalgr\'s Emissary Boltloop 3': '70DF', // overlapping expanding lightning rings
    'Aglaia Rhalgr Fist of Judgment Hand of the Destroyer': '70B0', // 180 cleave punch through blue portal
    'Aglaia Rhalgr Fist of Wrath Hand of the Destroyer': '70AF', // 180 cleave punch through red portal
    'Aglaia Rhalgr Rhalgr\'s Beacon': '7314', // purple knockback puck
    'Aglaia Rhalgr Bronze Lightning': '70B9', // pinwheel ground lightning
    'Aglaia Rhalgr Striking Meteor': '70BB', // targeted circle during Bronze Lightning
    'Aglaia Rhalgr Lightning Orb Shock': '70B3', // orb explosion during Hell of Lightning + Beacon
    'Aglaia Lions Slash and Burn Donut 1': '71D2', // Lioness donut (1 dot)
    'Aglaia Lions Slash and Burn Donut 2': '71D6', // Lioness donut (2 dots)
    'Aglaia Lions Slash and Burn Circle 1': '71D0', // Lion circle (1 dot)
    'Aglaia Lions Slash and Burn Circle 2': '71D5', // Lion circle (2 dots)
    'Aglaia Lions Roaring Blaze 1': '71CE', // Lion half cleave (1 dot)
    'Aglaia Lions Roaring Blaze 2': '71CF', // Lion half cleave (2 dots)
    'Aglaia Lions Roaring Blaze 3': '72BF', // Lion half cleave (when Lioness is dead)
    'Aglaia Lions Roaring Blaze 4': '71CE', // Lioness half cleave (when Lion is dead)
    'Aglaia Lions Trial by Fire': '72C0', // large centered circle when Lioness is dead
    'Aglaia Lions Spinning Slash': '72C1', // donut when Lion is dead
    'Aglaia Azeyma Solar Wings 1': '7082', // narrow front/back safe attack
    'Aglaia Azeyma Solar Wings 2': '7083', // narrow front/back safe attack
    'Aglaia Azeyma Solar Flair': '7084', // orb exploding after Solar Wings
    'Aglaia Azeyma Solar Fans 1': '708E', // horizontal line aoe
    'Aglaia Azeyma Solar Fans 2': '72BE', // horizontal line aoe
    'Aglaia Azeyma Warden\'s Flame Radiant Flourish': '7094', // Radiant Rhythm/Finish explosion
    'Aglaia Azeyma Solar Fold': '71EE', // cross line aoe that spawns fire lines
    'Aglaia Azeyma Folding Flare 1': '7089', // expanding fire lines
    'Aglaia Azeyma Folding Flare 2': '731C', // expanding fire lines
    'Aglaia Azeyma Dancing Flame 1': '708B', // Haute Air-blown fire quadrant
    'Aglaia Azeyma Dancing Flame 2': '708C', // Haute Air-blown fire quadrant
    'Aglaia Azeyma Sunbeam': '7097', // trine puddles
    'Aglaia Nald\'thal Flames of the Dead': '73A7', // on blue out incorrectly during Heat Above, Flames Below
    'Aglaia Nald\'thal Living Heat': '73A9', // on red in incorrectly during Heat Above, Flames Below
    'Aglaia Nald\'thal Everfire': '73C4', // Once Above, Ever Below moving puddles
    'Aglaia Nald\'thal Once Burned 1': '73C5', // Once Above, Ever Below moving red puddles
    'Aglaia Nald\'thal Once Burned 2': '73C6', // Once Above, Ever Below moving red puddles
    'Aglaia Nald\'thal Everfire 1': '73C2', // Once Above, Ever Below moving blue puddles
    'Aglaia Nald\'thal Everfire 2': '73C3', // Once Above, Ever Below moving blue puddles
    'Aglaia Nald\'thal Hell of Fire': '72B8', // 180 cleave
    'Aglaia Nald\'thal Wayward Soul': '7110', // millions of large circles from dropping orbs
    'Aglaia Nald\'thal Seventh Passage 1': '7118', // Fired Up "get out" circle
    'Aglaia Nald\'thal Seventh Passage 2': '7119', // Fired Up "get out" circle
    'Aglaia Nald\'thal Soul Vessel Twingaze': '712A', // add phase narrow conal
    'Aglaia Nald\'thal Deepest Pit 1': '73C7', // Far Above, Deep Below chasing arrows
    'Aglaia Nald\'thal Deepest Pit 2': '73C8', // Far Above, Deep Below chasing arrows
  },
  damageFail: {
    'Aglaia Nald\'thal Tipped Scales': '737A', // failing Balance mechanic (7379 is damage for doing it correctly)
  },
  gainsEffectWarn: {
    // BF9 is the "9999 duration" effect, and BFA is what you get after you step out of fire.
    'Aglaia Azeyma Burns': 'BFA', // Azeyma Wildfire Ward burns
  },
  shareWarn: {
    'Aglaia Byregot Byregot\'s Ward': '7175', // tankbuster cleave
    'Aglaia Rhalgr\'s Emissary Destructive Strike': '70D9', // tankbuster cleave
    'Aglaia Rhalgr Destructive Bolt': '70B4', // 3x tankbuster cleave
    'Aglaia Rhalgr Lightning Storm': '70BA', // spread markers
    'Aglaia Nald\'thal Smelting': '7120', // protean spread
  },
  soloFail: {
    'Aglaia Nald\'thal Heaven\'s Trial': '711F', // stack marker
    'Aglaia Nald\'thal Soul Vessel Magmatic Spell': '712D', // 3x stack markers
  },
  triggers: [
    {
      id: 'Aglaia Knocked Off',
      type: 'Ability',
      // 70B8 = Rhalgr's Beacon purple knockback
      netRegex: NetRegexes.ability({ id: ['70B8'] }),
      deathReason: (_data, matches) => {
        return {
          id: matches.targetId,
          name: matches.target,
          text: {
            en: 'Knocked off',
            de: 'Runtergefallen',
            fr: 'Renversé(e)',
            ja: 'ノックバック',
            cn: '击退坠落',
            ko: '넉백',
          },
        };
      },
    },
  ],
};

export default triggerSet;
