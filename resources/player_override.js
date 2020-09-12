'use strict';

// Will redirect calls from `onPlayerChangedEvent` to |func| overriding with
// |playerName| and their job.  Job is important for raidboss.
// It might be nice to do HP, because otherwise the math section of
// Ridorana Lighthouse won't work.
//
// Other parts of the player (such that would help the jobs overlay run)
// are deliberately not included here, because it's impossible to run
// jobs remotely due to gauge data being local and many bits of information
// loaded from memory.

function addPlayerChangedOverrideListener(playerName, func) {
  if (!func)
    return;

  let lastPlayerChangedEvent = null;
  let lastPlayerJob = null;

  const onPlayerChanged = (e) => {
    if (playerName) {
      e.detail.name = playerName;
      if (lastPlayerJob) {
        // Use the non-overridden job if we don't know an overridden one.
        e.detail.job = lastPlayerJob;
      }
    }
    lastPlayerChangedEvent = e;

    func(e);
  };

  window.addOverlayListener('onPlayerChangedEvent', onPlayerChanged);
  if (!playerName)
    return;

  window.addOverlayListener('PartyChanged', (e) => {
    const player = e.party.find((p) => p.name === playerName);
    if (!player)
      return;

    const newJob = Util.jobEnumToJob(player.job);
    if (newJob === lastPlayerJob)
      return;

    lastPlayerJob = newJob;
    // This event may come before the first onPlayerChangedEvent.
    if (lastPlayerChangedEvent)
      onPlayerChanged(lastPlayerChangedEvent);
  });
}

// Common UI for selecting a player.
// Only used for raidboss, but could ostensibly be reused for oopsy,
// if there's ever player specific stuff.
// TODO: it would be nice to show the "connected / not connected" bit in the UI.
function addRemotePlayerSelectUI(lang) {
  const instructionTextByLang = {
    en: 'Select a Player\n(the list will update when in an instance)',
    de: 'Wähle einen Spieler\n(Diese Liste aktualisiert sich, sobald eine Instance betretten wird)',
    fr: 'Sélectionner un joueur\n (la liste se mettra à jour dans une instance)',
    ja: 'プレーヤー名を選択してください\n(インスタンスに入るとリストが更新する)',
    cn: '请选择玩家名称\n(此列表将会在进入副本后更新)',
    ko: '플레이어를 선택하세요\n(인스턴스에 있으면 리스트가 업데이트됩니다.)',
  };
  const forceTTSByLang = {
    en: 'Force Enable Text To Speech',
    de: 'Erzwinge Text in Sprache (TTS)',
    fr: 'Forcer l\'activation de la synthèse vocale (TTS)',
    ja: 'TTSを強制的に有効化する',
    cn: '强制启用TTS',
    ko: 'TTS 기능을 활성화하기',
  };
  const buttonTextByLang = {
    en: 'Start Overlay',
    de: 'Start Overlay',
    fr: 'Démarrer l\'Overlay',
    ja: 'オーバーレイを起動',
    cn: '启用悬浮窗',
    ko: '오버레이 시작',
  };
  const defaultTextByLang = {
    en: '(no override)',
    de: '(kein überschreiben)',
    fr: '(pas de dérogation)',
    ja: '(既定値)',
    cn: '(默认值)',
    ko: '(플레이어 지정 안함)',
  };

  // TODO: probably should save forceTTS as well, maybe save some {} options?
  const kStorageKey = 'cactbot-last-selected-player';
  const savePlayerName = (name) => {
    window.localStorage.setItem(kStorageKey, name);
  };
  const loadPlayerName = () => {
    return window.localStorage.getItem(kStorageKey);
  };

  // Add common UI to select a player.
  let container = document.createElement('div');
  container.id = 'player-select';
  document.body.appendChild(container);

  let instructionElem = document.createElement('div');
  instructionElem.id = 'player-select-instructions';
  instructionElem.innerHTML = instructionTextByLang[lang] || instructionTextByLang['en'];
  container.appendChild(instructionElem);

  let listElem = document.createElement('div');
  listElem.id = 'player-select-list';
  container.appendChild(listElem);

  let ttsElem = document.createElement('input');
  ttsElem.type = 'checkbox';
  ttsElem.id = 'player-select-tts';
  ttsElem.name = 'player-select-tts';
  container.appendChild(ttsElem);

  let ttsLabel = document.createElement('label');
  ttsLabel.id = 'player-select-tts-label';
  ttsLabel.htmlFor = 'player-select-tts';
  ttsLabel.innerHTML = forceTTSByLang[lang] || forceTTSByLang['en'];
  container.appendChild(ttsLabel);

  let buttonElem = document.createElement('button');
  buttonElem.id = 'player-select-button';
  buttonElem.name = 'player-select-button';
  buttonElem.innerHTML = buttonTextByLang[lang] || buttonTextByLang['en'];
  container.appendChild(buttonElem);
  buttonElem.addEventListener('click', (e) => {
    const forceTTS = document.getElementById('player-select-tts').checked;
    let playerName = '';
    let radioIndex = 0;
    for (;;) {
      radioIndex++;
      const elem = document.getElementById('player-radio-' + radioIndex);
      if (!elem)
        break;
      if (!elem.checked)
        continue;
      playerName = elem.value;
      break;
    }

    if (playerName)
      savePlayerName(playerName);

    // Preserve existing parameters.
    const currentParams = new URLSearchParams(window.location.search);
    let paramMap = {};
    // Yes, this is (v, k) and not (k, v).
    currentParams.forEach((v, k) => paramMap[k] = decodeURIComponent(v));

    paramMap.player = playerName;
    // Use 1/0 to be consistent with other query parameters rather than string true/false.
    paramMap.forceTTS = forceTTS ? 1 : 0;

    // TODO: OverlayPlugin common.js doesn't support uri encoded OVERLAY_WS parameters.
    // So this can't use URLSearchParams.toString yet.  Manually build string.
    let search = '?';
    for (const [k, v] of Object.entries(paramMap))
      search += k + '=' + v + '&';

    // Reload the page with more options.
    window.location.search = search;
  });

  const lastSelectedPlayer = loadPlayerName();

  const buildList = (party) => {
    while (listElem.firstChild)
      listElem.removeChild(listElem.lastChild);

    let radioCount = 0;

    const addRadio = (name, value, extraClass) => {
      radioCount++;

      const inputName = 'player-radio-' + radioCount;

      const inputElem = document.createElement('input');
      inputElem.type = 'radio';
      inputElem.value = value;
      inputElem.id = inputName;
      inputElem.name = 'player-radio';
      inputElem.classList.add('player-radio', extraClass);
      listElem.appendChild(inputElem);

      const labelElem = document.createElement('label');
      labelElem.htmlFor = inputName;
      labelElem.innerHTML = name;
      listElem.appendChild(labelElem);

      return inputElem;
    };

    const defaultText = defaultTextByLang[lang] || defaultTextByLang['en'];
    let defaultElem = addRadio(defaultText, '', 'player-radio-default');
    defaultElem.checked = true;

    if (lastSelectedPlayer) {
      let last = addRadio(lastSelectedPlayer, lastSelectedPlayer, 'player-radio-last');
      last.checked = true;
    }

    const partyPlayers = party.filter((p) => p.inParty && p.name != lastSelectedPlayer);
    const partyNames = partyPlayers.map((p) => p.name).sort();
    for (const name of partyNames)
      addRadio(name, name, 'player-radio-party');

    const alliancePlayers = party.filter((p) => !p.inParty && p.name != lastSelectedPlayer);
    const allianceNames = alliancePlayers.map((p) => p.name).sort();
    for (const name of allianceNames)
      addRadio(name, name, 'player-radio-alliance');
  };
  window.addOverlayListener('PartyChanged', (e) => {
    buildList(e.party);
  });
  buildList([]);
}
