Options.Triggers.push({
  zoneId: ZoneId.MareLamentorum,
  triggers: [
    {
      id: 'Hunt Lunatender Queen Away With You',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6AE5', source: 'Lunatender Queen', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '6AE5', source: 'Lunatender-Königin', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '6AE5', source: 'Pampa Sélénienne Reine', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '6AE5', source: 'ルナテンダー・クイーン', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '6AE5', source: '月面仙人刺女王', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '6AE5', source: '루나텐더 여왕', capture: false }),
      response: Responses.getOut(),
    },
    {
      id: 'Hunt Lunatender Queen Away With You Whim',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6AEB', source: 'Lunatender Queen', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '6AEB', source: 'Lunatender-Königin', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '6AEB', source: 'Pampa Sélénienne Reine', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '6AEB', source: 'ルナテンダー・クイーン', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '6AEB', source: '月面仙人刺女王', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '6AEB', source: '루나텐더 여왕', capture: false }),
      response: Responses.getUnder(),
    },
    {
      id: 'Hunt Lunatender Queen You May Approach',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6AE4', source: 'Lunatender Queen', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '6AE4', source: 'Lunatender-Königin', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '6AE4', source: 'Pampa Sélénienne Reine', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '6AE4', source: 'ルナテンダー・クイーン', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '6AE4', source: '月面仙人刺女王', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '6AE4', source: '루나텐더 여왕', capture: false }),
      response: Responses.getUnder(),
    },
    {
      id: 'Hunt Lunatender Queen You May Approach Whim',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6AEA', source: 'Lunatender Queen', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '6AEA', source: 'Lunatender-Königin', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '6AEA', source: 'Pampa Sélénienne Reine', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '6AEA', source: 'ルナテンダー・クイーン', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '6AEA', source: '月面仙人刺女王', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '6AEA', source: '루나텐더 여왕', capture: false }),
      response: Responses.getOut(),
    },
    {
      id: 'Hunt Lunatender Queen Avert Your Eyes',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6AE3', source: 'Lunatender Queen', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '6AE3', source: 'Lunatender-Königin', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '6AE3', source: 'Pampa Sélénienne Reine', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '6AE3', source: 'ルナテンダー・クイーン', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '6AE3', source: '月面仙人刺女王', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '6AE3', source: '루나텐더 여왕', capture: false }),
      response: Responses.lookAway(),
    },
    {
      id: 'Hunt Lunatender Queen Avert Your Eyes Whim',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6AE9', source: 'Lunatender Queen', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '6AE9', source: 'Lunatender-Königin', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '6AE9', source: 'Pampa Sélénienne Reine', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '6AE9', source: 'ルナテンダー・クイーン', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '6AE9', source: '月面仙人刺女王', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '6AE9', source: '루나텐더 여왕', capture: false }),
      response: Responses.lookTowards(),
    },
    {
      id: 'Hunt Lunatender Queen 999,000 Needles',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6AE6', source: 'Lunatender Queen', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '6AE6', source: 'Lunatender-Königin', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '6AE6', source: 'Pampa Sélénienne Reine', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '6AE6', source: 'ルナテンダー・クイーン', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '6AE6', source: '月面仙人刺女王', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '6AE6', source: '루나텐더 여왕', capture: false }),
      response: Responses.outOfMelee(),
    },
    {
      id: 'Hunt Mousse Princess Rightward Whimsy',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: 'B18', source: 'Mousse Princess', capture: false }),
      netRegexDe: NetRegexes.gainsEffect({ effectId: 'B18', source: 'Mousse-Prinzessin', capture: false }),
      netRegexFr: NetRegexes.gainsEffect({ effectId: 'B18', source: 'Princesse Mousse', capture: false }),
      netRegexJa: NetRegexes.gainsEffect({ effectId: 'B18', source: 'ムースプリンセス', capture: false }),
      netRegexCn: NetRegexes.gainsEffect({ effectId: 'B18', source: '慕斯公主', capture: false }),
      netRegexKo: NetRegexes.gainsEffect({ effectId: 'B18', source: '무스 공주', capture: false }),
      durationSeconds: 6,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Away from Right Flank',
          de: 'Weg von der rechten Flanke',
          fr: 'Éloignez-vous du flanc droit',
          cn: '远离右侧',
          ko: '보스 오른쪽 피하기',
        },
      },
    },
    {
      id: 'Hunt Mousse Princess Backward Whimsy',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: 'B1A', source: 'Mousse Princess', capture: false }),
      netRegexDe: NetRegexes.gainsEffect({ effectId: 'B1A', source: 'Mousse-Prinzessin', capture: false }),
      netRegexFr: NetRegexes.gainsEffect({ effectId: 'B1A', source: 'Princesse Mousse', capture: false }),
      netRegexJa: NetRegexes.gainsEffect({ effectId: 'B1A', source: 'ムースプリンセス', capture: false }),
      netRegexCn: NetRegexes.gainsEffect({ effectId: 'B1A', source: '慕斯公主', capture: false }),
      netRegexKo: NetRegexes.gainsEffect({ effectId: 'B1A', source: '무스 공주', capture: false }),
      durationSeconds: 6,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Away from Back',
          de: 'Weg von hinter ihr',
          fr: 'Éloignez-vous de l\'arrière',
          cn: '远离后方',
          ko: '보스 뒤 피하기',
        },
      },
    },
    {
      id: 'Hunt Mousse Princess Leftward Whimsy',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: 'B19', source: 'Mousse Princess', capture: false }),
      netRegexDe: NetRegexes.gainsEffect({ effectId: 'B19', source: 'Mousse-Prinzessin', capture: false }),
      netRegexFr: NetRegexes.gainsEffect({ effectId: 'B19', source: 'Princesse Mousse', capture: false }),
      netRegexJa: NetRegexes.gainsEffect({ effectId: 'B19', source: 'ムースプリンセス', capture: false }),
      netRegexCn: NetRegexes.gainsEffect({ effectId: 'B19', source: '慕斯公主', capture: false }),
      netRegexKo: NetRegexes.gainsEffect({ effectId: 'B19', source: '무스 공주', capture: false }),
      durationSeconds: 6,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Away from Left Flank',
          de: 'Weg von der linker Flanke',
          fr: 'Éloignez-vous du flanc gauche',
          cn: '远离左侧',
          ko: '보스 왼쪽 피하기',
        },
      },
    },
    {
      id: 'Hunt Mousse Princess Forward Whimsy',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: 'B8E', source: 'Mousse Princess', capture: false }),
      netRegexDe: NetRegexes.gainsEffect({ effectId: 'B8E', source: 'Mousse-Prinzessin', capture: false }),
      netRegexFr: NetRegexes.gainsEffect({ effectId: 'B8E', source: 'Princesse Mousse', capture: false }),
      netRegexJa: NetRegexes.gainsEffect({ effectId: 'B8E', source: 'ムースプリンセス', capture: false }),
      netRegexCn: NetRegexes.gainsEffect({ effectId: 'B8E', source: '慕斯公主', capture: false }),
      netRegexKo: NetRegexes.gainsEffect({ effectId: 'B8E', source: '무스 공주', capture: false }),
      durationSeconds: 6,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Away from Front',
          de: 'Weg von Vorne',
          fr: 'Éloignez-vous du devant',
          cn: '远离前方',
          ko: '보스 앞 피하기',
        },
      },
    },
    {
      id: 'Hunt Mousse Princess Banish',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6ABB', source: 'Mousse Princess' }),
      netRegexDe: NetRegexes.startsUsing({ id: '6ABB', source: 'Mousse-Prinzessin' }),
      netRegexFr: NetRegexes.startsUsing({ id: '6ABB', source: 'Princesse Mousse' }),
      netRegexJa: NetRegexes.startsUsing({ id: '6ABB', source: 'ムースプリンセス' }),
      netRegexCn: NetRegexes.startsUsing({ id: '6ABB', source: '慕斯公主' }),
      netRegexKo: NetRegexes.startsUsing({ id: '6ABB', source: '무스 공주' }),
      // Doesn't cleave (I think?).
      response: Responses.tankBuster('info'),
    },
    {
      id: 'Hunt Mousse Princess Amorphic Flail',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6AB9', source: 'Mousse Princess', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '6AB9', source: 'Mousse-Prinzessin', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '6AB9', source: 'Princesse Mousse', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '6AB9', source: 'ムースプリンセス', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '6AB9', source: '慕斯公主', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '6AB9', source: '무스 공주', capture: false }),
      response: Responses.outOfMelee(),
    },
  ],
});
