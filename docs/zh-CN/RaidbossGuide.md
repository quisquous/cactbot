# 触发器文件格式

[[English](../RaidbossGuide.md)] [**简体中文**]

## 文件结构

```javascript
[{
  zoneId: ZoneId.TheWeaponsRefrainUltimate,
  overrideTimelineFile: false,
  timelineFile: 'filename.txt',
  timeline: `hideall`,
  timelineReplace: [
  {
     locale: 'en',
     replaceText: {
      'regexSearch': 'strReplace',
     },
     replaceSync: {
      'regexSearch': 'strReplace',
     },
   },
  ],
  resetWhenOutOfCombat: true,
  triggers: [
    { /* ..trigger 1.. */ },
    { /* ..trigger 2.. */ },
    { /* ..trigger 3.. */ },
  ]
},
{
  zoneRegex: /Eureka Hydatos/,
  triggers: [
    { /* ..trigger 1.. */ },
    { /* ..trigger 2.. */ },
    { /* ..trigger 3.. */ },
  ]
}]
```

### 元素

**zoneId** 区域名缩写，用于规定触发器的适用范围。 这些区域名缩写可以在 [zone_id.ts](../resources/zone_id.ts) 文件中找到。 我们倾向于使用该属性，而非zoneRegex。 每个触发器集合都必须包含zoneId或zoneRegex(但二者不能并存)。

**zoneRegex** 用于匹配区域名称的正则表达式(匹配ACT读取的区域名)。 当正则表达式匹配到当前的区域名，则该集合中的触发器会应用于该区域。

**overrideTimelineFile** 可选属性，布尔值。该值设定为true时，任何先前被读取的同区域的触发器文件将被该触发器集合中指定的 `timelineFile` 和 `timeline` 属性覆盖。 此属性仅用于用户文件，cactbot本身不使用该值。

**timelineFile** 可选属性，指定当前区域对应的时间轴文件。 这些文件与触发器文件存放在同一文件夹中。 (例如 `raidboss/data/04-sb/raid/`)

**timeline** 可选属性，时间轴的补充行。

**locale** 可选属性，限定触发器仅在特定语言的客户端上生效。如 'en'、'ko'、'fr'。 若该属性未设置，则应用于所有语言。

**replaceText** 键值对，用于在时间轴中搜索并替换技能名。 显示的技能名会被替换，但 `hideall`、`infotext`、`alerttext`、`alarmtext` 等依旧指向其原名称。 这一属性使我们可以对时间轴文件进行翻译/本地化，而不需要直接编辑时间轴文件。

**replaceSync** 键值对，用于在时间轴中搜索并替换同步正则表达式。 当同步正则表达式包含了本地化名称时，该属性是必要的。

**resetWhenOutOfCombat** 布尔值，默认为true。 该值为true时，时间轴和触发器均在脱战时自动重置。 否则，需要手动调用`data.StopCombat()`使其重置。

## 触发器结构

```javascript
{
  id: 'id string',
  disabled: false,
  // 提示：推荐使用 [regexes.ts](https://github.com/quisquous/cactbot/blob/main/resources/regexes.ts) 中的工具函数自动生成正则表达式
  netRegex: /trigger-regex-for-network-log-lines/,
  netRegexFr: /trigger-regex-for-network-log-lines-but-in-French/
  regex: /trigger-regex-for-act-log-lines/,
  regexFr: /trigger-regex-for-act-log-lines-but-in-French/,
  condition: function(data, matches) { return true if it should run },
  preRun: function(data, matches) { do stuff.. },
  delaySeconds: 0,
  durationSeconds: 3,
  suppressSeconds: 0,
  promise: function(data, matches) { return promise to wait for resolution of },
  sound: '',
  soundVolume: 1,
  response: Responses.doSomething(severity),
  alarmText: {en: 'Alarm Popup'},
  alertText: {en: 'Alert Popup'},
  infoText: {en: 'Info Popup'},
  tts: {en: 'TTS text'},
  run: function(data, matches) { do stuff.. },
},
```

### 触发器元素

**id string** 字符串，触发器id。 所有cactbot的内置触发器均包含一个独一无二的id。 我们同样推荐在用户自定义触发器中包含该属性，但这不是强制要求。

触发器id不可重复。 若当前触发器的id与某一已定义的触发器完全一致，后者的定义将会完全失效，并由前者覆盖并替代其位置。 这个机制让用户可以方便地复制触发器代码并粘贴到用户文件中，以修改为他们自己喜欢的方式。 没有id的触发器无法被覆盖。

目前cactbot采用的 `Regexes/NetRegexes` 结构并不要求将技能名/效果名等名称写进正则表达式。 因此，将注释写在附近尤为重要。 我们强烈推荐在触发器id中写入效果名/技能名/NPC名称等， 或者在旁边撰写包含这些信息的详尽注释。 仅仅依赖触发器本体的上下文信息并不足以了解其用处。 (与id一样，若您的触发器不是打算提交到cactbot仓库的，这些要求也可以忽略。)

**disabled: false** 若该值为true，则该触发器将被完全禁用/忽略。 默认为false。

**netRegex / regex** 正则表达式，cactbot会将该正则表达式与每一条日志行做比对， 并在匹配成功时触发当前触发器。 `netRegex` 版本用于匹配网络日志行， 而 `regex` 版本用于匹配普通的ACT日志行。

更多时候，相对于直接使用正则表达式字面量，我们更加推荐使用正则替换函数。 正则替换函数是指定义在 [regexes.ts](https://github.com/quisquous/cactbot/blob/main/resources/regexes.ts) 和 [netregexes.ts](https://github.com/quisquous/cactbot/blob/main/resources/netregexes.ts) 中的辅助函数， 这些函数可以接受特定参数值用于匹配日志，并通过正则捕获组的方式帮助你提取未定义的参数值。 换句话说，这些函数用于自动构建能够匹配指定类型的日志行的正则表达式。 顾名思义，`netRegex` 使用 `NetRegexes` 辅助函数， 而 `regex` 使用 `Regexes` 辅助函数。

**netRegexFr / regexFr** 语言特定正则表达式（以fr为示例）。 若设置了 `Options.ParserLanguage == 'fr'`，则 `regexFr` (如果存在的话) 优先于 `regex` 对日志行进行匹配。 否则，该值将会被忽略。  这里虽然只有法语的例子，但其他语言也是可用的。例如：regexEn, regexKo。 就像 `netRegex` 对于 `regex` 一样， `netRegexFr` 匹配法语的网络日志行 而 `regexFr` 匹配法语的ACT日志行。

这些语言特定正则表达式并没有明确的顺序规定。 但是我们定义的顺序通常为：`de`、`fr`、`ja`、`cn`、`ko` 。 同样，比起 `正则表达式字面量`，使用上述的正则替换函数更好。

(理论上，以后我们可能不再需要独立的语言特定正则表达式， 而是采用 `timelineReplace` 对象自动地替换这些正则表达式。 我们还没有确定具体的实现方式，但条条大路通罗马。)

**condition: function(data, matches)** 当函数返回 `true` 时激活该触发器。 若返回的不是 `true`，则当前触发器不会有任何响应。 不管触发器对象里定义了多少函数，该函数总是第一个执行。 ([conditions.ts](https://github.com/quisquous/cactbot/blob/main/resources/conditions.ts) 中定义了一部分高阶条件函数。 一般情况下，如果与情境相符，使用这些函数是最佳解决方案。)

**preRun: function(data, matches)** 当触发器被激活时，该函数会在条件判定成功后立刻执行。

**promise: function(data, matches)** 设置该属性为返回Promise的函数，则触发器会在其resolve之前等待。 这个函数会在 `preRun` 之后，`delaySeconds` 之前执行。

**delaySeconds** 时间，单位为秒，规定从正则表达式匹配上到触发器激活之间的等待时间。 其值可以是数字或返回数字的 `function(data, matches)`。

**durationSeconds** 时间，单位为秒，显示触发器文本的时长。 其值可以是数字或返回数字的 `function(data, matches)`。 若该值未设置，默认为3。

**suppressSeconds** 等待时间，单位为秒，再次触发该触发器的冷却时间。  其值可以是数字或返回数字的 function(data, matches)。  该时间从正则表达式匹配之时开始计算，并且不受 delaySeconds 设置与否的影响。 当设置了此元素的触发器被激活后，它在这段时间内无法再次被激活。

**sound** 用于播放声音的音频文件，也可以是 'Info'，'Alert'，'Alarm' 或者 'Long'。 文件路径是对于 ui/raidboss/ 文件夹的相对路径。

**soundVolume** 从0到1的音量数值，触发器激活时播放的音量大小。

**response** 用于返回 infoText/alertText/alarmText/tts 的快捷方法。 这些函数定义于 `resources/responses.ts`。 Response 的优先级比直接指定的文字或TTS低，因此可以被覆盖。 (如同 `regex` 和 `condition` 一样，[responses.ts](https://github.com/quisquous/cactbot/blob/main/resources/responses.ts) 中定义了一些便于使用的高阶函数。)

**alarmText** 当触发器激活时显示“警报”级别的文本。 该属性一般用于高危事件，如处理失败必死无疑的机制、会导致团灭的机制，或处理失败会导致通关变得更加困难的机制等。 (例如T2的亚拉戈病毒，T7的诅咒之嚎，或是O7s里奥尔特罗斯先生的石肤等。 ) 其值可以是字符串或返回字符串的 `function(data, matches)`。

**alertText** 当触发器激活时显示“警告”级别的文本。 该属性一般用于中危事件，如处理失败可能会致死的机制、会造成全队伤害或全队Debuff的机制等等。(例如，针对坦克的死刑预告，或针对全队的击退预告等。) 其值可以是字符串或返回字符串的 `function(data, matches)`。

**infoText** 当触发器激活时显示“信息”级别的文本。 该属性一般用于低危事件，不需要玩家立即做出反应。 (例如，小怪出现时的警告，或针对治疗职业的全体伤害预告等等。) 其值可以是字符串或返回字符串的 `function(data, matches)`。

**tts** 字符串，用于输出TTS的另一种方式。 该值可以是包含本地化字符串的对象，与触发器文本类似。

**run: function(data, matches)** 当触发器被激活时，该函数会作为触发器最末尾的步骤执行。

## 触发器杂项属性

任何可以返回一个函数 (如 `infoText`、`alertText`、`alarmText` 和 `tts`)的元素都可以返回一个含有本地化字符串的对象。 本地化字符串对象是指形如 {en: 'Get Out', fr: 'something french'} 的一维对象，用以支持多语言，而不是仅仅返回单个字符串如 'Get Out'。  当然，其值也可以返回一个函数，再让该函数返回本地化字符串对象。  若当前的区域语言不存在于该对象中，则会返回 en 的值。

触发器元素按以下顺序载入，定义元素时也应该按该顺序排序：

- id
- disabled
- netRegex (以及 netRegexDe、netRegexFr 等等)
- regex (以及 regexDe、regexFr 等等)
- beforeSeconds (仅存在于 timelineTriggers 中)
- (休眠的触发器会在此处直接退出)
- condition
- preRun
- delaySeconds
- durationSeconds
- suppressSeconds
- (等待delaySeconds延迟结束)
- promise
- (等待Promise执行完成)
- sound
- soundVolume
- response
- alarmText
- alertText
- infoText
- tts
- run

## 正则表达式扩展

若您很了解正则表达式， 您会注意到 `\y{Name}` 和 `\y{AbilityCode}` 是个没见过的用法。 这些是cactbot提供的便捷扩展， 以让您不需要针对所有可能出现的Unicode字符撰写正则表达式， 也不需要完整学习 FFXIV ACT Plugin 的输出格式。

目前可用的扩展名如下所示：

- `\y{Float}`：匹配浮点数，包含某些区域特定的编码。
- `\y{Name}`：匹配任意角色名称 (同样包括 FFXIV ACT Plugin 针对未知名字生成的空字符串)。
- `\y{ObjectId}`：在网络日志行中匹配8位十六进制的角色对象id。
- `\y{AbilityCode}`：匹配 FFXIV ACT Plugin 针对技能或能力生成的数字格式。
- `\y{Timestamp}`：匹配所有日志前端的时间戳，如 `[10:23:34.123]`。
- `\y{LogType}`：匹配 FFXIV ACT Plugin 生成的用于描述日志类型的数字格式，位于每行日志的稍前方。

## 高阶辅助函数

为统一触发器构造，以及减轻翻译时的手动负担， cactbot的触发器元素广泛运用了高阶函数。 诸如此类的工具函数使自动化测试更为简单， 并让人们在审查拉取更改时更容易捕获错误及不一致。

目前我们对于元素的独立预定义结构有3种： [Condition](https://github.com/quisquous/cactbot/blob/main/resources/conditions.ts)、[Regex](https://github.com/quisquous/cactbot/blob/main/resources/regexes.ts) 以及 [Response](https://github.com/quisquous/cactbot/blob/main/resources/responses.ts)。 `Condition` 函数不接受参数。 几乎所有的 `Response` 函数都接受 `severity`参数， 用于定义触发器被激活时输出的警报文本的等级。 `Regex` 函数根据匹配的日志行，接受若干参数 [(例如 `gainsEffect()`)](https://github.com/quisquous/cactbot/blob/0bd9095682ec15b35f880d2241be365f4bdf6a87/resources/regexes.ts#L348)， 不管哪种日志行一般都接受 `source` 属性 (技能的咏唱者/释放者的名称)， `id` 属性 (十六进制的技能ID，例如 `2478`)， 以及正则表达式匹配时是否启用捕获组 (`capture: false`)。 `Regex` 函数默认开启捕获组，但按惯例应当仅对依赖捕获数据的触发器开启捕获。

以下是使用了这三种元素的示例触发器：

```javascript
{
  id: 'TEA Mega Holy Modified',
  regex: Regexes.startsUsing({ source: 'Alexander Prime', id: '4A83', capture: false }),
  regexDe: Regexes.startsUsing({ source: 'Prim-Alexander', id: '4A83', capture: false }),
  regexFr: Regexes.startsUsing({ source: 'Primo-Alexander', id: '4A83', capture: false }),
  regexJa: Regexes.startsUsing({ source: 'アレキサンダー・プライム', id: '4A83', capture: false }),
  regexCn: Regexes.startsUsing({ source: '至尊亚历山大', id: '4A83', capture: false }),
  regexKo: Regexes.startsUsing({ source: '알렉산더 프라임', id: '4A83', capture: false }),
  condition: Conditions.caresAboutMagical(),
  response: Responses.bigAoe('alert'),
},
```

尽管由于我们需要定义所有语言的正则表达式，该方法并未减少代码行数，但仍然远远优于：

```javascript
{
  id: 'TEA Mega Holy Modified',
  regex:  / 14:........:Alexander Prime starts using Mega Holy/,
  regexDe: / 14:........:Prim-Alexander starts using Super-Sanctus/,
  regexFr: / 14:........:Primo-Alexander starts using Méga Miracle/,
  regexJa: / 14:........:アレキサンダー・プライム starts using メガホーリー/,
  regexCn: / 14:........:至尊亚历山大 starts using 百万神圣/,
  regexKo: / 14:........:알렉산더 프라임 starts using 지진/,
  condition: function(data) {
    return data.role == 'tank' || data.role == 'healer' || data.CanAddle();
  },
  alertText: {
    en: 'big aoe!',
    de: 'Große AoE!',
    fr: 'Grosse AoE !',
    ja: '大ダメージAoE',
    cn: '大AoE伤害！',
    ko: '강한 전체 공격!',
  },
},
```

使用正则表达式字面量的方式已被废弃。 *请务必*使用上述的高阶函数生成对应的正则表达式，除非您有特别的原因必须要这样做。 在提交拉取请求时使用正则表达式字面量会导致构建失败。 当的确存在特定的需求，不得不使用正则表达式字面量时 (例如ACT新增了其他类型的日志行)， 我们强烈推荐开启一个拉取请求，直接更新 `regexes.ts` 文件。

(当然，若您正在撰写仅用于您个人的触发器，您可以随意发挥。 此处的警告仅针对想为cactbot项目提交贡献的人们。)

可能的话，建议尽量使用在conditions和responses中定义的高阶函数，尽管SE的“天才”战斗设计组有时真的可以让它*变得*不可能。

## 关于时间轴

触发器子目录内可能包含了一部分采用 ACT Timeline 插件格式定义的时间轴文本文件，您可以通过此链接了解： <http://dtguilds.enjin.com/forum/m/37032836/viewthread/26353492-act-timeline-plugin>

Cactbot的每一个时间轴文件均由同文件夹下某个对应的 [TRIGGER-FILE].js 加载。 通常情况下，时间轴文件的名称需与触发器文件一致，同时此文件名应当至少与副本区域名称可以一一对应，即不具有歧义。

Cactbot在原基础上实现了一部分扩展语法。 扩展语法可以在时间轴文本文件内或触发器的 `timeline` 属性中使用。

**infotext "event name" before 1** 在某个事件发生之前显示一个“信息”级别的文本。 `event name` 与文件中的某个列出的事件名称匹配，并且在所有同名事件发生前均会显示指定文本。 默认显示的文本为事件名称，但若您需要显示其他文本，添加指定文本至行末即可。 `before` 参数是必填项，但您可以将其设置为0以令文本在事件发生的同时显示。 当您需要使文本在事件之后显示时，也可以设置为负值。

**例1：在事件发生前1秒时显示“信息”等级文本** `infotext "event name" before 1`

**例2：在事件发生前更早显示“信息”等级文本，并修改了默认文本** `infotext "event name" before 2.3 "alternate text"`

**例3：与前述同事件名的“警告”等级文本** `alerttext "event name" before 1` `alerttext "event name" before 2.3 "alternate text"`

**例4：与前述同事件名的“警报”等级文本** `alarmtext "event name" before 1` `alarmtext "event name" before 2.3 "alternate text"`
