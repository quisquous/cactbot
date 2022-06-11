import logDefinitions from '../../resources/netlog_defs';
import NetRegexes from '../../resources/netregexes';
import { addOverlayListener } from '../../resources/overlay_plugin_api';

import FisherUI from './fisher-ui';
import SeaBase from './seabase';
import UserConfig from '../../resources/user_config';

import '../../resources/defaults.css';
import './fisher.css';

const defaultOptions = {
  IQRHookQuantity: 100,
  IQRTugQuantity: 10,
  Colors: {
    'unknown': 'rgba(0, 0, 0, 0.5)',
    'light': 'rgba(99, 212, 152, 0.5)',
    'medium': 'rgba(245, 241, 32, 0.5)',
    'heavy': 'rgba(250, 15, 19, 0.5)',
  },
};

class Fisher {
  constructor(options, element) {
    this.options = options;
    this.element = element;
    this.name = undefined;

    this.zone = null;
    this.job = null;

    this.baseBait = { id: null, name: null };
    this.moochBait = { id: null, name: null };
    this.lastCatch = { id: null, name: null };
    this.place = { id: null, name: null };
    this.fishing = false;
    this.mooching = false;
    this.snagging = false;
    this.chum = false;
    this.chumOnCatch = false;

    this.placeFish = null;
    this.hookTimes = null;
    this.tugTypes = null;

    this.castStart = null;
    this.castEnd = null;
    this.castGet = null;

    this.updateNameRegexes();

    this.regex = {
      // Localized strings from: https://xivapi.com/LogMessage?pretty=1&columns=ID,Text_de,Text_en,Text_fr,Text_ja&ids=1110,1111,1112,1113,1115,1116,1117,1118,1119,1120,1121,1127,1129,3511,3512,3515,3516,3525
      // 1110: cast
      // 1111: quit (stop)
      // 1112: quit (death)
      // 1113: quit (combat)
      // 1115: discovered (area)
      // 1116: bite
      // 1117: nocatch (lose bait)
      // 1118: nocatch (lose lure)
      // 1119: nocatch (gets away)
      // 1120: nocatch (break)
      // 1121: mooch
      // 1127: nocatch (wrong bait)
      // 1128: nocatch (early hook)
      // 3511: nocatch (moving)
      // 3512: catch
      // 3515: nocatch (lose lure)
      // 3516: nocatch (anti-bot)
      // 3525: nocatch (inventory full)

      en: {
        undiscovered: /undiscovered fishing hole/,
        cast: NetRegexes.gameLog({
          code: '08c3',
          line:
            '(?:[\\w\']\\.?)(?:[\\w\'\\s]+\\.?)? cast(?:s?) (?:your|his|her) line (?:on|in|at) (?:the )?(?<place>[\\w\\s\'&()]+)\\..*?',
        }),
        bite: NetRegexes.gameLog({ code: '08c3', line: 'Something bites!.*?' }),
        catch: NetRegexes.gameLog({
          code: '0843',
          line:
            '(?:[\\w\']\\.?)(?:[\\w\'\\s]+\\.?)? land(?:s?) (?:a|an|[\\d]+ )?.+?(?<fish>[\\w\\s\\-\'\\#\\d]{3,})(?: | [^\\w] |[^\\w\\s].+ )measuring \\d.*?',
        }),
        nocatch: NetRegexes.gameLog({
          code: '08c3',
          line:
            '(?:Nothing bites\.|You reel in your line|You lose your bait|The fish gets away|You lose your |Your line breaks|The fish sense something amiss|You cannot carry any more).*?',
        }),
        mooch: NetRegexes.gameLog({
          code: '08c3',
          line:
            '(?:[\\w\']\\.?)(?:[\\w\'\\s]+\\.?)? recast(?:s?) (?:your|his|her)? line with the fish still hooked\\..*?',
        }),
        quit: NetRegexes.gameLog({
          code: '08c3',
          line:
            '(?:(?:[\\w\']\\.?)(?:[\\w\'\\s]+\\.?)? put(?:s?) away (?:your|his|her) rod\\.|Fishing canceled).*?',
        }),
        discovered: NetRegexes.gameLog({
          code: '08c3',
          line: '(?:Data on (?<place>[\\w\\s\'&()]+)) is added to your fishing log\\..*?',
        }),
      },
      de: {
        // Note, the preposition in German is stored in the cast string, so is ignored here.
        // We could attempt to trim prepositions in the fishing data and then include all
        // potential prepositions here, but I don't know German that well.
        undiscovered: /unerforschten Angelplatz/,
        cast: NetRegexes.gameLog({
          code: '08c3',
          line: 'Du hast mit dem Fischen (?<place>.+) begonnen\\..*?',
        }),
        bite: NetRegexes.gameLog({ code: '08c3', line: 'Etwas hat angebissen!.*?' }),
        catch: NetRegexes.gameLog({
          code: '0843',
          line:
            'Du (?:hast eine?n? |ziehst \\d+ )?.+?\\s?(?<fish>[\\w\\s\\-\'\\.\\d\u00c4-\u00fc]{3,})(?: | [^\\w] |[^\\w\\s\\-\'\u00c4-\u00fc].+ )(?:\\(\\d|mit ein).*?',
        }),
        nocatch: NetRegexes.gameLog({
          code: '08c3',
          line:
            '(?:Der Fisch hat den Köder vom Haken gefressen|.+ ist davongeschwommen|Der Fisch konnte sich vom Haken reißen|Die Leine ist gerissen|Nichts beißt an|Du hast nichts gefangen|Du hast das Fischen abgebrochen|Deine Beute hat sich aus dem Staub gemacht und du hast|Die Fische sind misstrauisch und kommen keinen Ilm näher|Du hast .+ geangelt, musst deinen Fang aber wieder freilassen, weil du nicht mehr davon besitzen kannst).*?',
        }),
        mooch: NetRegexes.gameLog({ code: '08c3', line: 'Du hast die Leine mit.*?' }),
        quit: NetRegexes.gameLog({
          code: '08c3',
          line: '(?:Du hast das Fischen beendet\\.|Das Fischen wurde abgebrochen).*?',
        }),
        discovered: NetRegexes.gameLog({
          code: '08c3',
          line:
            'Die neue Angelstelle (?<place>[^\\w\\s\\-\'\u00c4-\u00fc].+ ) wurde in deinem Fischer-Notizbuch vermerkt\\..*?',
        }),
      },
      fr: {
        undiscovered: /Zone de pêche inconnue/,
        cast: NetRegexes.gameLog({
          code: '08c3',
          line:
            'Vous commencez à pêcher. Point de pêche: (?<place>[\\w\\s\\-\'\\(\\)\u00b0\u00c0-\u017f]+).*?',
        }),
        bite: NetRegexes.gameLog({ code: '08c3', line: 'Vous avez une touche!.*?' }),
        catch: NetRegexes.gameLog({
          code: '0843',
          line:
            'Vous avez pêché (?:un |une )?.+?\\s?(?<fish>[\\w\\s\\-\'\\(\\)\u00b0\u00c0-\u017f]{3,})\ue03c?.+de \\d.*?',
        }),
        nocatch: NetRegexes.gameLog({
          code: '08c3',
          line:
            '(?:L\'appât a disparu|Vous avez perdu votre|L\'appât a disparu|Le poisson a réussi à se défaire de l\'hameçon|Le fil s\'est cassé|Vous n\'avez pas eu de touche|Vous n\'avez pas réussi à ferrer le poisson|Vous arrêtez de pêcher|Le poisson s\'est enfui et a emporté avec lui votre|Les poissons sont devenus méfiants|Vous avez pêché .+, mais ne pouvez en posséder davantage et l\'avez donc relâché).*?',
        }),
        mooch: NetRegexes.gameLog({ code: '08c3', line: 'Vous essayez de pêcher au vif avec.*?' }),
        quit: NetRegexes.gameLog(
          { code: '08c3', line: '(?:Vous arrêtez de pêcher\\.|Pêche interrompue).*?' },
        ),
        discovered: NetRegexes.gameLog({
          code: '08c3',
          line:
            'Vous notez le banc de poissons “(?<place>[\\w\\s\\-\'\\(\\)\u00b0\u00c0-\u017f]+)” dans votre carnet\\..*?',
        }),
      },
      ja: {
        undiscovered: /未知の釣り場/,
        cast: NetRegexes.gameLog({
          code: '08c3',
          line:
            '(?:[\\w\\s-\']+)\u306f(?<place>[\u3000-\u30ff\u3400-\u4dbf\u4e00-\u9faf\d\uff1a]+)で釣りを開始した。.*?',
        }),
        bite: NetRegexes.gameLog({ code: '08c3', line: '魚をフッキングした！.*?' }),
        catch: NetRegexes.gameLog({
          code: '0843',
          line:
            '(?:[\\w\\s-\']+)\u306f.+?(?<fish>[\u3000-\u30ff\u3400-\u4dbf\u4e00-\u9faf\d\uff1a]+)(?:[^\u3000-\u30ff\u3400-\u4dbf\u4e00-\u9faf]+)?（\\d+\\.\\dイルム）を釣り上げた。.*?',
        }),
        nocatch: NetRegexes.gameLog({
          code: '08c3',
          line:
            '(?:[\\w\\s-\']+)?(?:いつの間にか釣り餌をとられてしまった……。|いつの間にか.+をロストしてしまった！|いつの間にか釣り餌をとられてしまった……。|釣り針にかかった魚に逃げられてしまった……。|ラインブレイク！！|何もかからなかった……。\n\n釣り餌が釣り場にあってないようだ。|何もかからなかった……。|.+は釣りを中断した。|魚に逃げられ、.+をロストしてしまった……。|魚たちに警戒されてしまったようだ……|.+を釣り上げたが、これ以上持てないためリリースした。).*?',
        }),
        mooch: NetRegexes.gameLog({
          code: '08c3',
          line: '(?:[\\w\\s-\']+)は釣り上げた.+を慎重に投げ込み、泳がせ釣りを試みた。.*?',
        }),
        quit: NetRegexes.gameLog({
          code: '08c3',
          line:
            '(?:[\\w\\s-\']+)?(?:は釣りを終えた。|戦闘不能になったため、釣りが中断されました。|は釣りを終えた。|敵から攻撃を受けたため、釣りが中断されました。).*?',
        }),
        discovered: NetRegexes.gameLog({
          code: '08c3',
          line:
            '釣り手帳に新しい釣り場「(?<place>[\u3000-\u30ff\u3400-\u4dbf\u4e00-\u9faf\\d\uff1a]+)」の情報を記録した！.*?',
        }),
      },
      cn: {
        undiscovered: /未知钓场/,
        cast: NetRegexes.gameLog({
          code: '08c3',
          line:
            '(?:[\\w\\s-\'\u4e00-\u9fa5·]+)在(?<place>[\\w\\s-\'\u4e00-\u9fa5·\uff08\uff09]+)甩出了鱼线开始钓鱼。.*?',
        }),
        bite: NetRegexes.gameLog({ code: '08c3', line: '有鱼上钩了！.*?' }),
        catch: NetRegexes.gameLog({
          code: '0843',
          line:
            '(?:[\\w\\s-\'\u4e00-\u9fa5·]+)?成功钓上了.*?(?<fish>[\u3000-\u30ff\u3400-\u4dbf\u4e00-\u9faf·]+\\d*).*（\\d+\\.\\d星寸）。.*?',
        }),
        nocatch: NetRegexes.gameLog({
          code: '08c3',
          line:
            '(?:[\\w\\s-\'\u4e00-\u9fa5·]+)?(?:不经意间鱼饵被吃掉了……|不经意间丢掉了.+……|不经意间.+不见了……|不经意间鱼饵被吃掉了……|上钩的鱼逃走了……|鱼线断了！|没有钓到任何东西……\n\n现在使用的鱼饵可能不太适合这片钓场。|没有钓到任何东西……|.+收竿停止了钓鱼。|鱼带着.+逃走了……|这里的鱼现在警惕性很高，看来还是换个地点比较好。|无法持有更多的.+，(?:[\\w\\s-\'\u4e00-\u9fa5·]+)?将刚钓上的东西放生了。).*?',
        }),
        mooch: NetRegexes.gameLog({
          code: '08c3',
          line:
            '(?:[\\w\\s-\'\u4e00-\u9fa5·]+)开始利用上钩的.*?([\u3000-\u30ff\u3400-\u4dbf\u4e00-\u9faf·]+\\d*).*尝试以小钓大。.*?',
        }),
        quit: NetRegexes.gameLog({
          code: '08c3',
          line:
            '(?:[\\w\\s-\'\u4e00-\u9fa5·]+)?(?:收回了鱼线。|陷入了战斗不能状态，钓鱼中断。|收回了鱼线。|受到了敌人的攻击，钓鱼中断。).*?',
        }),
        discovered: NetRegexes.gameLog({
          code: '08c3',
          line: '将新钓场.*(?<place>[\u3000-\u30ff\u3400-\u4dbf\u4e00-\u9faf·]+\\d*).*记录到了钓鱼笔记中！.*?',
        }),
      },
      ko: {
        undiscovered: /미지의 낚시터/,
        cast: NetRegexes.gameLog({
          code: '08c3',
          line: '(?:[\\w\'가-힣]+) 님이 (?<place>[\\s\\w\'\\-\\.\\(\\):가-힣]+)에서 낚시를 시작합니다\\..*?',
        }),
        bite: NetRegexes.gameLog({ code: '08c3', line: '낚싯대를 낚아챘습니다!.*?' }),
        catch: NetRegexes.gameLog({
          code: '0843',
          line:
            '(?:[\\w\'가-힣]+) 님이 (?<fish>[\\s\\w\'\\-\\.\\(\\)\?:가-힣]+)\\(?:\\d+\\.\\d일름\\)(?:을|를) 낚았습니다.*?',
        }),
        nocatch: NetRegexes.gameLog({
          code: '08c3',
          line:
            '(?:어느새 미끼만 먹고 도망간 것 같습니다……\\.|물고기가 도망갔습니다……\\.|낚싯줄이 끊어졌습니다!!|아무것도 낚이지 않았습니다\\.|이곳에는 물고기가 없는 것 같습니다……\\.|물고기는 있는 것 같지만,|.+놓쳐버렸습니다!|물고기를 놓치고 .+도 잃었습니다……\\.|물고기들이 경계하기 시작했습니다\.|소지품에 공간이 부족하여).*?',
        }),
        mooch: NetRegexes.gameLog({
          code: '08c3',
          line:
            '(?:[\\w\'가-힣]+) 님이 방금 낚은 (?:[\\s\\w\'\\-\\.\\(\\)\?:가-힣]+)(?:을|를) 조심스럽게 물에 넣고 생미끼 낚시를 시도합니다\\..*?',
        }),
        quit: NetRegexes.gameLog({
          code: '08c3',
          line:
            '(?:(?:[\\w\'가-힣]+) 님이 낚시를 마쳤습니다.|전투불능이 되어 낚시가 중단되었습니다\.|적의 공격을 받아 낚시가 중단되었습니다\.).*?',
        }),
        discovered: NetRegexes.gameLog({
          code: '08c3',
          line: '낚시 수첩에 새로운 낚시터 (?<place>[\\s\\w\'\\-\\.\\(\\):가-힣]+)의 정보를 기록했습니다!.*?',
        }),
      },
    };

    this.ui = new FisherUI(this.options, element);
    this.seaBase = new SeaBase(this.options);
  }

  getActiveBait() {
    if (this.mooching)
      return this.moochBait;

    return this.baseBait;
  }

  updateFishData() {
    // We can only know data for both of these
    if (!this.place || !this.getActiveBait()) {
      return new Promise(
        ((resolve, reject) => {
          resolve();
        }),
      );
    }

    const _this = this;
    this.hookTimes = {};
    this.tugTypes = {};

    // Get the list of fish available at this particular place
    this.placeFish = this.seaBase.getFishForPlace(this.place);

    // We should update twice for each fish, one for hook times and one for tugs
    let queue = this.placeFish.length * 2;

    return new Promise(
      ((resolve, reject) => {
        for (const index in _this.placeFish) {
          const fish = _this.placeFish[index];

          // Get the hook min and max times for the fish/bait/chum combo
          _this.seaBase.getHookTimes(fish, _this.getActiveBait(), _this.chum)
            .then((hookTimes) => {
              _this.hookTimes[fish.name] = hookTimes;
              queue -= 1;
              if (!queue) {
                _this.ui.redrawFish(_this.hookTimes, _this.tugTypes);
                resolve();
              }
            });

          // Get the tug type for the fish
          _this.seaBase.getTug(fish).then((tug) => {
            _this.tugTypes[fish.name] = tug;
            queue -= 1;
            if (!queue) {
              _this.ui.redrawFish(_this.hookTimes, _this.tugTypes);
              resolve();
            }
          });
        }
      }),
    );
  }

  handleBait(bait) {
    let name = '';
    // Mooching: bait is the last fish
    if (this.mooching) {
      this.moochBait = bait;
      name = bait.name;
    } else {
      this.baseBait = this.seaBase.getBait(bait);
      name = this.baseBait.name;
    }
    this.ui.setBait(name);
  }

  handleCast(place) {
    this.element.style.opacity = 1;
    this.castStart = new Date();
    this.castEnd = null;
    this.castGet = null;
    this.fishing = true;

    // undiscovered fishing hole
    if (this.regex[this.options.ParserLanguage]['undiscovered'].test(place)) {
      // store this for now
      // if we catch anything we'll pull the data then
      // "data on 'x' is added to your fishing log" is printed before the catch
      this.place = place;
      this.ui.setPlace(this.place);
      // clear previous fish data (if any)
      this.ui.redrawFish({}, {});

      this.ui.startFishing();
      return;
    }
    // Set place (set this every cast because it can change during ocean fishing)
    this.place = this.seaBase.getPlace(place);
    // This lookup could fail and, for German,
    // this.place.name may differ from place
    // due to differing cast vs location names.
    if (this.place.id)
      this.ui.setPlace(this.place.name);
    const _this = this;

    this.updateFishData().then(() => {
      _this.ui.startFishing();
    });
  }

  handleBite() {
    this.castEnd = new Date();
    this.ui.stopFishing();
  }

  handleCatch(fish) {
    this.castGet = new Date();
    this.lastCatch = this.seaBase.getFish(fish);
    this.fishing = false;

    if (this.place) {
      this.seaBase.addCatch({
        'fish': this.lastCatch.id,
        'bait': this.getActiveBait().id,
        'place': this.place.id,
        'castTimestamp': +this.castStart,
        'hookTime': (this.castEnd - this.castStart),
        'reelTime': (this.castGet - this.castEnd),
        'chum': this.chumOnCatch ? 1 : 0,
        'snagging': this.snagging,
      });
    }

    this.chumOnCatch = false;
    if (this.mooching) {
      this.handleBait(this.baseBait);
      this.mooching = false;
    }
  }

  handleNoCatch() {
    this.fishing = false;
    this.castStart = null;
    this.castEnd = null;
    this.castGet = null;
    this.lastCatch = null;

    if (this.mooching) {
      this.handleBait(this.baseBait);
      this.mooching = false;
    }

    this.ui.stopFishing();
  }

  handleMooch() {
    this.mooching = true;

    this.handleBait(this.lastCatch);
    this.handleCast(this.place);
  }

  handleSnagGain() {
    this.snagging = true;
  }

  handleSnagFade() {
    this.snagging = false;
  }

  handleChumGain() {
    this.chum = true;
    this.updateFishData();
  }

  handleChumFade() {
    // Chum fades just before the catch appears
    this.chumOnCatch = true;
    this.chum = false;
  }

  handleQuit() {
    this.lastCatch = null;
    this.place = null;
    this.ui.setPlace(null);
    this.element.style.opacity = 0;
  }

  handleDiscover(place) {
    this.place = this.seaBase.getPlace(place);
    // This lookup could fail and, for German,
    // this.place.name may differ from place
    // due to differing cast vs location names.
    if (this.place.id)
      this.ui.setPlace(this.place.name);
    this.updateFishData();
  }

  parseLine(e) {
    const log = e.rawLine;
    const type = e.line[0];

    if (type === logDefinitions.GainsEffect.type) {
      if (this.gainEffectRegex.chum?.test(log))
        this.handleChumGain();
      else if (this.gainEffectRegex.snag?.test(log))
        this.handleSnagGain();
    } else if (type === logDefinitions.LosesEffect.type) {
      if (this.loseEffectRegex.chum?.test(log))
        this.handleChumFade();
      else if (this.loseEffectRegex.snag?.test(log))
        this.handleSnagFade();
    }
    if (type !== logDefinitions.GameLog.type)
      return;

    for (const type in this.regex[this.options.ParserLanguage]) {
      const result = this.regex[this.options.ParserLanguage][type].exec(log);
      if (result) {
        switch (type) {
          // case 'bait': this.handleBait(result[1]); break;
          case 'cast':
            this.handleCast(result.groups?.place);
            break;
          case 'bite':
            this.handleBite();
            break;
          case 'catch':
            this.handleCatch(result.groups?.fish);
            break;
          case 'nocatch':
            this.handleNoCatch();
            break;
          case 'mooch':
            this.handleMooch();
            break;
          case 'quit':
            this.handleQuit();
            break;
          case 'discovered':
            this.handleDiscover(result.groups?.place);
            break;
        }
      }
    }
  }

  updateNameRegexes() {
    if (!this.name) {
      this.gainEffectRegex = { chum: undefined, snag: undefined };
      this.loseEffectRegex = { chum: undefined, snag: undefined };
      return;
    }

    this.gainEffectRegex = {
      chum: NetRegexes.gainsEffect({ effectId: '2FB', target: this.name, capture: false }),
      snag: NetRegexes.gainsEffect({ effectId: '2F9', target: this.name, capture: false }),
    };
    this.loseEffectRegex = {
      chum: NetRegexes.losesEffect({ effectId: '2FB', target: this.name, capture: false }),
      snag: NetRegexes.losesEffect({ effectId: '2F9', target: this.name, capture: false }),
    };
  }

  OnNetLog(e) {
    if (this.job === 'FSH')
      this.parseLine(e);
  }

  OnChangeZone(e) {
    this.zone = e.zoneName;
    this.place = null;
    this.ui.setPlace(null);
  }

  OnPlayerChange(e) {
    if (this.name !== e.detail.name) {
      this.name = e.detail.name;
      this.updateNameRegexes();
    }
    this.job = e.detail.job;
    if (this.job === 'FSH') {
      this.element.style.display = 'block';
      if (!this.fishing)
        this.handleBait(e.detail.bait);
    } else {
      this.element.style.display = 'none';
    }
  }
}

UserConfig.getUserConfigLocation('fisher', defaultOptions, () => {
  const options = { ...defaultOptions };
  const fisher = new Fisher(options, document.getElementById('fisher'));

  addOverlayListener('LogLine', (e) => {
    fisher.OnNetLog(e);
  });

  addOverlayListener('ChangeZone', (e) => {
    fisher.OnChangeZone(e);
  });

  addOverlayListener('onPlayerChangedEvent', (e) => {
    fisher.OnPlayerChange(e);
  });
});
