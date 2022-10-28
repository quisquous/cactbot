Options.Triggers.push({
  zoneId: ZoneId.TheDiadem,
  resetWhenOutOfCombat: false,
  triggers: [
    {
      id: 'Diadem Falling Asleep',
      type: 'GameLog',
      netRegex: { line: '7 minutes have elapsed since your last activity..*?', capture: false },
      response: Responses.wakeUp(),
    },
    {
      id: 'Diadem Found Gather Point',
      type: 'GameLog',
      netRegex: {
        line:
          'You sense a grade .* clouded (?:mineral deposit|rocky outcrop|mature tree|lush vegetation patch).*?',
        capture: false,
      },
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Found clouded gather point',
          de: 'Verhüllte Sammlerstelle gefunden',
          fr: 'Point de récolte évanescent détecté',
          ja: '幻の採集場探したよ！',
          cn: '梦幻采集点刷了！冲鸭！！',
          ko: '환상의 광맥/성목 발견',
        },
      },
    },
    {
      id: 'Diadem Flag Alert',
      type: 'GameLog',
      netRegex: { line: '.*\ue0bbThe Diadem *?', capture: false },
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Check coordinate on chat',
          de: 'Überprüfe die Koordinaten im Chat',
          fr: 'Vérifier les coordonnées sur le Tchat',
          ja: 'チャットに座標を確認',
          cn: '检查聊天栏中的坐标',
          ko: '디아뎀 좌표 채팅 올라옴',
        },
      },
    },
  ],
});
