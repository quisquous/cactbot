import { Lang } from '../../../resources/languages';
import { LocaleObject, LocaleText } from '../../../types/trigger';

export const translate = <T>(lang: Lang, obj: LocaleObject<T>): T => {
  return obj[lang] ?? obj['en'];
};

type Translation = { [selector: string]: LocaleText };

const emulatorButtons: Translation = {
  '.yesButton': {
    en: 'Yes',
    de: 'Ja',
    fr: 'Oui',
    ja: 'はい',
    cn: '是',
  },
  '.noButton': {
    en: 'No',
    de: 'Nein',
    fr: 'Non',
    ja: 'いいえ',
    cn: '否',
  },
  '.closeButton': {
    en: 'Close',
    de: 'Schließen',
    fr: 'Fermer',
    ja: '閉じる',
    cn: '关闭',
  },
  '.doneButton': {
    en: 'Done<span class="done-btn-timeout"></span>',
    de: 'Fertig<span class="done-btn-timeout"></span>',
    fr: 'Terminé<span class="done-btn-timeout"></span>',
    ja: '完了<span class="done-btn-timeout"></span>',
    cn: '完成<span class="done-btn-timeout"></span>',
  },
  '.loadNetworkLogButton': {
    en: 'Load Network Log',
    de: 'Lade Network Log',
    fr: 'Charger le Network Log',
    ja: 'ネットワークログを読み込む',
    cn: '加载网络日志',
  },
  '.exportDBButton': {
    en: 'Export DB',
    de: 'DB exportieren',
    fr: 'Exporter DB',
    ja: 'DBをエクスポート',
    cn: '导出数据库',
  },
  '.importDBButton': {
    en: 'Import DB',
    de: 'DB importieren',
    fr: 'Importer DB',
    ja: 'DBをインポート',
    cn: '导入数据库',
  },
  '.clearDBButton': {
    en: 'Clear DB',
    de: 'DB leeren',
    fr: 'Nettoyer DB',
    ja: 'DBをクリア',
    cn: '清除数据库',
  },
} as const;

const emulatorTitle: Translation = {
  '.title': {
    en: 'Cactbot Raid Emulator',
    de: 'Cactbot Raid Emulator',
    fr: 'Cactbot Raid Emulator',
    ja: 'Cactbot・レイド・エミュレーター',
    cn: 'Cactbot Raid 模拟器',
  },
} as const;

const emulatorImportModal: Translation = {
  '.import-progress-modal .modal-title': {
    en: 'Log File Import Progress',
    de: 'Fortschritt des Logdatei Imports',
    fr: 'Progression de l\'importation du fichier journal',
    ja: 'ログファイルのインポート進捗',
    cn: '日志文件导入进度',
  },
  '.import-progress-modal .modal-body-contents': {
    en: `<h3>Latest encounter:</h3>
    Zone: <span class="zone"></span><br />
    Encounter: <span class="encounter"></span><br />
    Start: <span class="start"></span><br />
    End: <span class="end"></span><br />
    Duration: <span class="durMins"></span>m<span class="durSecs"></span>s<br />
    Pull Duration: <span class="pullMins"></span>m<span class="pullSecs"></span>s<br />
    Started By: <span class="startedBy"></span><br />
    End Status: <span class="endStatus"></span><br />
    Line Count: <span class="lineCount"></span><br />`,
    de: `<h3>Letzter Kampf:</h3>
    Zone: <span class="zone"></span><br />
    Kampf: <span class="encounter"></span><br />
    Start: <span class="start"></span><br />
    Ende: <span class="end"></span><br />
    Dauer: <span class="durMins"></span>m<span class="durSecs"></span>s<br />
    Dauer des Versuchs: <span class="pullMins"></span>m<span class="pullSecs"></span>s<br />
    Gestartet von: <span class="startedBy"></span><br />
    Endstatus: <span class="endStatus"></span><br />
    Zeilenanzahl: <span class="lineCount"></span><br />`,
    fr: `<h3>Dernier Combat :</h3>
    Zone : <span class="zone"></span><br />
    Combatant : <span class="encounter"></span><br />
    Début : <span class="start"></span><br />
    Fin : <span class="end"></span><br />
    Durée : <span class="durMins"></span>m<span class="durSecs"></span>s<br />
    Durée du pull : <span class="pullMins"></span>m<span class="pullSecs"></span>s<br />
    Démarré par : <span class="startedBy"></span><br />
    Status de fin : <span class="endStatus"></span><br />
    Nombre de lignes : <span class="lineCount"></span><br />`,
    ja: `<h3>最新エンカウント:</h3>
    ゾーン: <span class="zone"></span><br />
    エンカウント: <span class="encounter"></span><br />
    開始: <span class="start"></span><br />
    終了: <span class="end"></span><br />
    間隔: <span class="durMins"></span>m<span class="durSecs"></span>s<br />
    プルの間隔: <span class="pullMins"></span>m<span class="pullSecs"></span>s<br />
    開始者: <span class="startedBy"></span><br />
    終了ステータス: <span class="endStatus"></span><br />
    行数: <span class="lineCount"></span><br />`,
    cn: `<h3>最新的战斗: </h3>
    区域: <span class="zone"></span><br />
    战斗: <span class="encounter"></span><br />
    开始: <span class="start"></span><br />
    结束: <span class="end"></span><br />
    持续时间: <span class="durMins"></span>m<span class="durSecs"></span>s<br />
    尝试时间: <span class="pullMins"></span>m<span class="pullSecs"></span>s<br />
    开始于: <span class="startedBy"></span><br />
    结束状态: <span class="endStatus"></span><br />
    行数: <span class="lineCount"></span><br />`,
  },
} as const;

const emulatorDeleteModal: Translation = {
  '.deleteDBModal .modal-title': {
    en: 'Delete Encounter Database',
    de: 'Lösche Kampfdatenbank',
    fr: 'Effacer la base de données du combat',
    ja: 'エンカウントDBを削除',
    cn: '删除战斗数据库',
  },
  '.deleteDBModal .modal-body': {
    en: '<p>You are about to delete the encounter database. Are you sure?</p>',
    de: '<p>Du bist kurz davor die Kampfdatenbank zu löschen. Bist du sicher?</p>',
    fr: '<p>Vous êtes sur le point de supprimer la base de données du combat. Êtes-vous sûr ?</p>',
    ja: '<p>エンカウントDBを削除します。よろしいですか？</p>',
    cn: '<p>即将删除战斗数据库。确定删除吗？</p>',
  },
} as const;

const emulatorIntroModal: Translation = {
  '.introModal .modal-title': {
    en: 'Introduction',
    de: 'Einführung',
    fr: 'Introduction',
    ja: 'はじめに',
    cn: '简介',
  },
  '.introModal .modal-body': {
    en: `<p>Welcome to the Raid Emulator.</p>
    <p>This tool replays encounters and shows what triggers were fired when, and allows you to view the encounter from any player's perspective.</p>
    <p>This tool optionally accepts an <strong>OVERLAY_WS</strong> parameter to connect to an ACT web socket with both ngld's OverlayPlugin and the Cactbot plugin loaded.</p>
    <p>If connected to a web socket, this tool will load and respect user configuration files for cactbot/raidboss.</p>
    <p>No overlays need to be created.</p>
    <p>Current WebSocket status: <span class="d-none websocketConnected text-success">Connected</span><span class="websocketDisconnected text-warning">Disconnected</span>.</p>
    <p>To get started, you need to import an encounter via one of the following options:</p>
    <p>
      <ul>
        <li>Drag and drop a network log file from <code>%APPDATA%/Advanced Combat Tracker/FFXIVLogs/</code> on to the page</li>
        <li>Click the <code>Load Network Log</code> button in the bottom drawer and select a network log file from <code>%APPDATA%/Advanced Combat Tracker/FFXIVLogs/</code></li>
      </ul>
    </p>
    <p>Then, select an encounter via the bottom drawer.</p>
    <p>Once you have loaded an encounter, you can:</p>
    <p>
      <ul>
        <li>Change the current perspective by selecting a party member on the right</li>
        <li>Seek to any point in the encounter by clicking the bar at the top</li>
        <li>Hover over trigger indicators in the top bar to see their names</li>
        <li>See detailed information about triggers fired by clicking their button</li>
      </ul>
    </p>`,
    de: `<p>Willkommen zum Raid Emulator.</p>
    <p>Dieses Tool gibt Kämpfe wieder und zeigt, welche Trigger wann ausgeführt wurden, und ermöglicht es, die Kämpfe aus der Perspektive eines beliebigen Spielers zu betrachten.</p>
    <p>Dieses Tool akzeptiert optional einen <strong>OVERLAY_WS</strong>-Parameter, um sich mit einem ACT-Websocket zu verbinden, in dem sowohl das OverlayPlugin von ngld als auch das Cactbot-Plugin geladen sind.</p>
    <p>Wenn eine Verbindung zu einem Websocket besteht, lädt dieses Tool die Konfigurationsdateien für cactbot/raidboss und benutzt diese.</p>
    <p>Es müssen keine Overlays erstellt werden.</p>
    <p>Aktueller WebSocket-Status: <span class="d-none websocketConnected text-success">Verbunden</span><span class="websocketDisconnected text-warning">Trennt die Verbindung</span>.</p>
    <p>Um loszulegen, muss ein Kampf über eine der folgenden Optionen importiert werden:</p>
    <p>
      <ul>
        <li>Ziehe eine Network-Logdatei aus <code>%APPDATA%/Advanced Combat Tracker/FFXIVLogs/</code> auf die Seite</li>
        <li>Klicke auf die Schaltfläche <code>Lade Network Log</code> in dem unteren Bereich und wähle ein Network Log aus <code>%APPDATA%/Advanced Combat Tracker/FFXIVLogs/</code></li>
      </ul>
    </p>
    <p>Dann wähle über den unteren Bereich einen Kampf aus.</p>
    <p>Sobald ein Kampf geladen wurde, können folgende Aktionen ausgeführt werden:</p>
    <p>
      <ul>
        <li>Wechseln der aktuelle Perspektive, indem ein Gruppenmitglied auf der rechten Seite ausgewählt wird</li>
        <li>Mit einem Klick auf die Leiste am oberen Rand, um zu einem beliebigen Punkt in dem Kampf zu springen</li>
        <li>Fahre mit dem Mauszeiger über Trigger-Indikatoren in der oberen Leiste, um deren Namen zu sehen</li>
        <li>Detaillierte Informationen über aktivierten Trigger anzeigen lassen, indem auf die entsprechende Schaltfläche geklickt wird</li>
      </ul>
    </p>`,
    fr: `<p>Bienvenue dans l'émulateur de raid.</p>
    <p>Cet outil rejoue les rencontres et montre quels triggers ont été déclenchés à quel moment, et vous permet de voir la rencontre du point de vue de n'importe quel joueur.</p>
    <p>Cet outil accepte éventuellement le paramètre <strong>OVERLAY_WS</strong> pour se connecter à un Web socket ACT avec à la fois OverlayPlugin de ngld et le plugin Cactbot chargés.</p>
    <p>S'il est connecté à un Web socket, cet outil chargera et respectera les fichiers de configuration utilisateur pour cactbot/raidboss.</p>
    <p>Aucun overlay n'a besoin d'être créée.</p>
    <p>État actuel de WebSocket : <span class="d-none websocketConnected text-success">Connecté</span><span class="websocketDisconnected text-warning">Déconnecté</span>.</p>
    <p>Pour commencer, vous devez importer une rencontre via l'une des options suivantes :</p>
    <p>
      <ul>
        <li>Faites glisser et déposez un fichier log depuis <code>%APPDATA%/Advanced Combat Tracker/FFXIVLogs/</code> sur la page</li>
        <li>Cliquez sur le bouton <code>Charger Network Log</code> dans le tiroir du bas et sélectionnez un fichier log dans <code>%APPDATA%/Advanced Combat Tracker/FFXIVLogs/</code></li>
      </ul>
    </p>
    <p>Ensuite, sélectionnez une rencontre via le tiroir du bas.</p>
    <p>Une fois que vous avez chargé une rencontre, vous pouvez :</p>
    <p>
      <ul>
        <li>Modifiez la perspective actuelle en sélectionnant un membre du groupe sur la droite</li>
        <li>Recherchez n'importe quel point de la rencontre en cliquant sur la barre en haut</li>
        <li>Passez la souris sur les indicateurs des triggers dans la barre supérieure pour voir leurs noms</li>
        <li>Voir des informations détaillées sur les triggers déclenchés en cliquant sur leur bouton</li>
      </ul>
    </p>`,
    ja: `<p>レイド・エミュレーターへようこそ。</p>
    <p>このツールはバトルを再生し、トリガーが何時に発動されたかを表示し、任意プレイヤーの視点からバトルを再生することができます。</p>
    <p>このツールは <strong>OVERLAY_WS</strong> というオプションを受け入れることができます。これにより、ngld様のOverlayPluginとcactbotのプラグインを搭載したACTのWebSocketに接続することができます。</p>
    <p>WebSocketに接続されている場合、このツールはcactbot/raidbossの設定ファイルを読み込み、それらを使用します。</p>
    <p>オーバーレイは作成する必要はありません。</p>
    <p>現在のWebSocketの状態: <span class="d-none websocketConnected text-success">接続済</span><span class="websocketDisconnected text-warning">切断中</span>。</p>
    <p>まず、以下のいずれかの方法でバトルをインポートしてください:</p>
    <p>
      <ul>
        <li><code>%APPDATA%/Advanced Combat Tracker/FFXIVLogs/</code>からネットワークログをドラッグ＆ドロップして、ページにドロップしてください</li>
        <li>下の<code>ネットワークログを読み込む</code>ボタンをクリックして、<code>%APPDATA%/Advanced Combat Tracker/FFXIVLogs/</code>にあるネットワークログを選択してください</li>
      </ul>
    </p>
    <p>次に、バトルを選択してください。</p>
    <p>バトルを選択したら、以下のように行動できます:</p>
    <p>
      <ul>
        <li>バトル内の視点を変更するには、右側のパーティーメンバー名を選択します</li>
        <li>上部バーのトリガーインジケーターをクリックするとトリガー名を確認できます</li>
        <li>トリガーをマウスオーバーして、トリガー名を確認できます</li>
        <li>トリガーが有効になっている場合、トリガーの詳細情報を表示するにはトリガーをクリックします</li>
      </ul>
    </p>`,
    cn: `<p>欢迎来到Raid模拟器。</p>
    <p>此工具可以回放战斗，显示各个触发器的触发时机，你还可以从任意小队成员的角度查看战斗。</p>
    <p>你可以向此工具传送<strong>OVERLAY_WS</strong>参数，以连接到同时加载了ngld的OverlayPlugin和Cactbot插件的ACT Websocket接口。</p>
    <p>若连接成功，此工具将加载并遵循cactbot/raidboss的用户配置文件。</p>
    <p>你不需要创建悬浮窗。</p>
    <p>当前WebSocket连接状态: <span class="d-none websocketConnected text-success">已连接</span><span class="websocketDisconnected text-warning">已断开</span>.</p>
    <p>首先，你需要通过以下方法之一导入一场战斗: </p>
    <p>
      <ul>
        <li>从<code>%APPDATA%/Advanced Combat Tracker/FFXIVLogs/</code>中选取一个网络日志文件拖放到页面上。</li>
        <li>点击下方的<code>加载网络日志</code>按钮，从<code>%APPDATA%/Advanced Combat Tracker/FFXIVLogs/</code>中选取一个网络日志文件。</li>
      </ul>
    </p>
    <p>然后，在窗口底部选择一场战斗。</p>
    <p>一旦你加载了一场战斗，你可以: </p>
    <p>
      <ul>
        <li>通过在右边选择一名队员来改变当前视角</li>
        <li>通过点击顶部的条状图来寻找战斗中的任何一个时间点</li>
        <li>悬停在顶栏的触发器指示器上，可以看到它们的名称</li>
        <li>点击触发器的按钮，可以看到关于它们的详细信息</li>
      </ul>
    </p>`,
  },
} as const;

const emulatorDisconnectedModal: Translation = {
  '.disconnectedModal .modal-title': {
    en: 'Currently Disconnected',
    de: 'Momentan nicht vebunden',
    fr: 'Actuellement déconnecté',
    ja: '切断されています',
    cn: '已断开连接',
  },
  '.disconnectedModal .modal-body': {
    en: `<p>Raid Emulator is currently disconnected from ACT.</p>
    <p>Raid Emulator will use the default settings for raidboss. These are:</p>
    <ul>
      <li>Display language: <span class="discLangDisplay"></span></li>
      <li>Default alert output: Text and Sound</li>
      <li>Alerts language: <span class="discLangAlerts"></span></li>
      <li>Timeline language: <span class="discLangTimeline"></span></li>
    </ul>`,
    de: `<p>Raid Emulator ist momentan nicht mit ACT verbunden.</p>
    <p>Raid Emulator wird die Standardeinstellungen für Raidboss benutzen. Diese snd:</p>
    <ul>
      <li>Anzeigesprache: <span class="discLangDisplay"></span></li>
      <li>Standard Alarm Ausgabe: Text und Ton</li>
      <li>Alarmsprache: <span class="discLangAlerts"></span></li>
      <li>Timeline Sprache: <span class="discLangTimeline"></span></li>
    </ul>`,
    fr: `<p>Raid Emulator est actuellement déconnecté d'ACT.</p>
    <p>Raid Emulator utilise les paramètres par défaut pour raidboss :</p>
    <ul>
      <li>Langue d'affichage : <span class="discLangDisplay"></span></li>
      <li>Alerte par défaut : Texte et Son</li>
      <li>Langue des alertes : <span class="discLangAlerts"></span></li>
      <li>Langue des timelines : <span class="discLangTimeline"></span></li>
    </ul>`,
    ja: `<p>現在、レイド・エミュレーターはACTとの接続が切断されています。</p>
    <p>レイド・エミュレーターはraidbossモジュールの既定値を使用します。これらは次のとおりです:</p>
    <ul>
      <li>表示言語: <span class="discLangDisplay"></span></li>
      <li>警告情報出力既定値: テキストと音</li>
      <li>警告情報言語: <span class="discLangAlerts"></span></li>
      <li>タイムライン言語: <span class="discLangTimeline"></span></li>
    </ul>`,
    cn: `<p>Raid模拟器目前与ACT断开了连接。</p>
    <p>Raid模拟器将使用raidboss的默认设置。这些设置是:</p>
    <ul>
      <li>显示语言: <span class="discLangDisplay"></span></li>
      <li>默认警报提示信息输出方式: 文字显示与提示音</li>
      <li>警报提示文字的语言: <span class="discLangAlerts"></span></li>
      <li>时间轴文本的语言: <span class="discLangTimeline"></span></li>
    </ul>`,
  },
} as const;

const emulatorLabels: Translation = {
  ' label[for=hideSkipped]': {
    en: 'Hide Skipped',
    de: 'Verstecke Übersprungene Einträge',
    fr: 'Masquer les entrées sautées',
    ja: 'スキップした項目を隠す',
    cn: '隐藏已跳过项目',
  },
  ' label[for=hideCollector]': {
    en: 'Hide Collectors',
    de: 'Verstecke "Sammel" Einträge',
    fr: 'Masquer les entrées collectées',
    ja: '無出力トリガーを隠す',
    cn: '隐藏收集器',
  },
} as const;

const emulatorTooltips: Translation = {
  '.triggerHideSkipped': {
    en: 'Hide triggers that were not executed',
    de: 'Verstecke Trigger, die nicht ausgeführt wurden',
    fr: 'Masquer les triggers non-executés',
    ja: '実行されなかったトリガーを隠す',
    cn: '隐藏未执行的触发器',
  },
  '.triggerHideCollector': {
    en: 'Hide triggers that had no output',
    de: 'Verstecke Trigger, die keine Ausgabe hatten',
    fr: 'Masquer les triggers sans sortie',
    ja: '出力がないトリガーを隠す',
    cn: '隐藏没有输出的触发器',
  },
  '.connectedIndicator': {
    en: 'Connected to websocket',
    de: 'Mit Websocket verbunden',
    fr: 'Connecté au Websocket',
    ja: 'WebSocketに接続済み',
    cn: '连接到websocket',
  },
  '.disconnectedIndicator': {
    en: 'Disconnected from websocket',
    de: 'Keine Verbindung zum Websocket',
    fr: 'Déconnecté du Websocket',
    ja: 'WebSocketに接続していません',
    cn: '与websocket断开连接',
  },
} as const;

const emulatorEncounterInfo: Translation = {
  '.encounterLoad': {
    en: 'Load Encounter',
    de: 'Lade Kampf',
    fr: 'Charger combat',
    ja: 'エンカウントを読み込む',
    cn: '加载战斗',
  },
  '.encounterParse': {
    en: 'Reparse Encounter',
    de: 'Kampf erneut analysieren',
    fr: 'Reparser le combat',
    ja: 'エンカウントを再解析',
    cn: '重新解析战斗',
  },
  '.encounterPrune': {
    en: 'Prune Encounter',
    de: 'Kampf leeren',
    fr: 'Combat vide',
    ja: 'エンカウントをカット',
    cn: '裁剪战斗',
  },
  '.encounterDelete': {
    en: 'Delete Encounter',
    de: 'Kampf löschen',
    fr: 'Effacer combat',
    ja: 'エンカウントを削除',
    cn: '删除战斗',
  },
  '.encounterZone': {
    en: 'Zone: <span class="label"></span>',
    de: 'Zone: <span class="label"></span>',
    fr: 'Zone : <span class="label"></span>',
    ja: 'ゾーン: <span class="label"></span>',
    cn: '区域: <span class="label"></span>',
  },
  '.encounterStart': {
    en: 'Start: <span class="label"></span>',
    de: 'Start: <span class="label"></span>',
    fr: 'Début : <span class="label"></span>',
    ja: '開始: <span class="label"></span>',
    cn: '开始: <span class="label"></span>',
  },
  '.encounterDuration': {
    en: 'Duration: <span class="label"></span>',
    de: 'Dauer: <span class="label"></span>',
    fr: 'Durée : <span class="label"></span>',
    ja: '持続時間: <span class="label"></span>',
    cn: '持续时间: <span class="label"></span>',
  },
  '.encounterName': {
    en: 'Name: <span class="label"></span>',
    de: 'Name: <span class="label"></span>',
    fr: 'Nom : <span class="label"></span>',
    ja: '名前: <span class="label"></span>',
    cn: '名称: <span class="label"></span>',
  },
  '.encounterStartStatus': {
    en: 'Start Status: <span class="label"></span>',
    de: 'Start Status: <span class="label"></span>',
    fr: 'État du démarrage : <span class="label"></span>',
    ja: '開始状態: <span class="label"></span>',
    cn: '开始状态: <span class="label"></span>',
  },
  '.encounterEndStatus': {
    en: 'End Status: <span class="label"></span>',
    de: 'Endstatus: <span class="label"></span>',
    fr: 'État de fin : <span class="label"></span>',
    ja: '終了状態: <span class="label"></span>',
    cn: '结束状态: <span class="label"></span>',
  },
} as const;

// These elements get their innerHTML set to the translated value
export const emulatorTranslations: Translation = {
  ...emulatorButtons,
  ...emulatorTitle,
  ...emulatorImportModal,
  ...emulatorDeleteModal,
  ...emulatorIntroModal,
  ...emulatorDisconnectedModal,
  ...emulatorLabels,
} as const;

// These elements get their title set to the translated value
export const emulatorTooltipTranslations: Translation = {
  ...emulatorTooltips,
} as const;

// Template elements need special handling, any templates that have translatable elements
// should be listed here
export const emulatorTemplateTranslations: { [selector: string]: Translation } = {
  'template.encounter-info': emulatorEncounterInfo,
};

export const emulatorStartStatuses = {
  unknown: {
    en: 'Unknown',
    de: 'Unbekannt',
    fr: 'Inconnu',
    ja: '不明',
    cn: '未知',
  },
  countdown: {
    en: 'Countdown',
    de: 'Countdown',
    fr: 'Compte à rebours',
    ja: 'カウントダウン',
    cn: '倒计时',
  },
  seal: {
    en: 'Seal',
    de: 'Versiegeln',
    fr: 'Fermeture',
    ja: '封鎖',
    cn: '封锁',
  },
  engage: {
    en: 'Engage',
    de: 'Start',
    fr: 'À l\'attaque',
    ja: '戦闘開始',
    cn: '战斗中',
  },
};

export const emulatorEndStatuses = {
  unknown: {
    en: 'Unknown',
    de: 'Unbekannt',
    fr: 'Inconnu',
    ja: '不明',
    cn: '未知',
  },
  win: {
    en: 'Win',
    de: 'Gewonnen',
    fr: 'Gagné',
    ja: '勝利',
    cn: '胜利',
  },
  wipe: {
    en: 'Wipe',
    de: 'Wipe',
    fr: 'Wipe',
    ja: 'ワイプ',
    cn: '团灭',
  },
  cactbotWipe: {
    en: 'Cactbot Wipe',
    de: 'Cactbot Wipe',
    fr: 'Cactbot Wipe',
    ja: 'Cactbotによるワイプ',
    cn: 'Cactbot团灭',
  },
  unseal: {
    en: 'Unseal',
    de: 'Entsiegeln',
    fr: 'Ouverture',
    ja: '解除',
    cn: '解封',
  },
};

// @TODO: Change encounter to store keys for statuses instead of english values as a
// comma-separated string.
export const lookupStartStatuses = (lang: Lang, statusesStr: string): string => {
  const engStatuses = statusesStr.split(', ');
  const transStatuses: string[] = [];
  for (const status of engStatuses) {
    for (const map of Object.values(emulatorStartStatuses)) {
      if (map.en === status) {
        transStatuses.push(translate(lang, map));
        break;
      }
    }
  }
  return transStatuses.join(', ');
};

export const lookupEndStatus = (lang: Lang, status: string): string => {
  for (const map of Object.values(emulatorEndStatuses)) {
    if (map.en === status)
      return translate(lang, map);
  }
  return status;
};
