# 触发器文件格式

[[English](../RaidbossGuide.md)] [**简体中文**]

## 文件结构

每个触发器文件都是一个 JS 模块 (module)，并导出一个触发器集合 (Trigger Set)。

```javascript
import ZoneId from '../path/to/resources/zone_id';
// 其他导入语句。

export default {
  id: 'TheWeaponsRefrainUltimate',
  zoneId: ZoneId.TheWeaponsRefrainUltimate,
  zoneLabel: {
    en: 'The Weapon\'s Refrain (Ultimate)',
  },
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
    { /* ..触发器 1.. */ },
    { /* ..触发器 2.. */ },
    { /* ..触发器 3.. */ },
  ]
};
```

### 元素

**id**
该触发器集合的唯一标识字符串。该值必须是独一无二的，且不可重复。一般情况下，我们会写 `ZoneId` 的名称，以保证其一致性。如果存在多个触发器集合作用于同个区域，则自拟一个适合的名称即可。例如用于正统优雷卡 (英语：Eureka Orthos) 所有层的通用触发器可以写作`'EurekaOrthosGeneral'`。

**zoneId**
区域名缩写，用于规定触发器的适用范围。这些区域名缩写可以在 [zone_id.ts](../../resources/zone_id.ts) 文件中找到。我们倾向于使用该属性而非 `zoneRegex`。每个触发器集合都必须包含`zoneId` 或 `zoneRegex` (但二者不能并存)。

**zoneLabel**
可选的名称，用于指定触发器集合在配置页面中的名称。该属性会覆盖 [zone_info.ts](../../resources/zone_info.ts) 中的默认名称。

**initData**
函数，用于初始化该触发器集合所使用的数据 (data)。应当返回一个纯对象，包含所有 `data` 中应当被初始化的属性及其值。在区域转移或战斗结束等需要重置的情况下，该函数可能会被多次调用。示例的初始化方法可以参考 [t1.ts](../../ui/raidboss/data/02-arr/raid/t1.ts) 这个文件。

**zoneRegex**
正则表达式，用于匹配该触发器集合所适用的从 ACT 读取的区域名称。当正则表达式匹配当前区域名时，触发器就会被激活。

由于中国服和韩国服的区域名称分别是中文和韩文，但国际服却是英文。理论上你需要写一个能够覆盖所有语言的正则表达式，可以在 ACT 的标题或主界面中找到。

**overrideTimelineFile**
可选属性，布尔值。该值设定为true时，任何先前被读取的同区域的触发器文件将被该触发器集合中指定的 `timelineFile` 和 `timeline` 属性覆盖。此属性仅用于用户文件，cactbot本身不使用该值。

**timelineFile**
可选属性，指定当前区域对应的时间轴文件。这些文件与触发器文件存放在同一文件夹中 (例如放在 `raidboss/data/04-sb/raid/` 中)，并与触发器文件 (`.js`) 的命名一致，只是后缀名必须是 `.txt`。

**timeline**
可选属性，时间轴的补充行。该值可以是字符串或字符串的数组，也可以是一个返回字符串或字符串数组的形如 `function(data)` 的函数，还可以是一个包含上述所有类型的数组。

[test.ts](../../ui/raidboss/data/00-misc/test.ts) 中的 **timeline** 属性是一个很好的示例，展示了它的所有用途。

**locale**
可选属性，限定触发器仅在特定语言的客户端上生效。如 'en'、'ko'、'fr'。若该属性未设置，则应用于所有语言。

**replaceText**
键值对，用于在时间轴中搜索并替换技能名。在时间轴中显示的条目会被替换，但 `hideall`、`infotext`、`alerttext`、`alarmtext` 等依旧指向其原名称。 这一属性使我们可以对时间轴文件进行翻译/本地化，而不需要直接编辑时间轴文件。

**replaceSync**
键值对，用于在时间轴中搜索并替换同步正则表达式。当同步正则表达式包含了本地化名称时，该属性是必要的。

**resetWhenOutOfCombat**
布尔值，默认为true。该值为true时，时间轴和触发器均在脱战时自动重置。否则，需要手动调用`data.StopCombat()`使其重置。

## 触发器结构

```javascript
{
  id: 'id string',
  type: 'StartsUsing',
  disabled: false,
  // 提示：参见 [net_fields.d.ts](https://github.com/OverlayPlugin/cactbot/blob/main/types/net_fields.d.ts) 中的 `NetFields` 类型。
  // 提示：写成 `netRegex: NetRegexes({ id: 'some-id', source: 'some-name' })` 也是可以的，这个属性会向后兼容。
  netRegex: { id: 'some-id', source: 'some-name' },
  // 提示：推荐使用 [regexes.ts](https://github.com/OverlayPlugin/cactbot/blob/main/resources/regexes.ts) 中的辅助函数。
  regex: Regexes.ability({ id: 'some-id', source: 'some-name' }),
  condition: function(data, matches, output) { /* 当需要激活该触发器时返回 true */ },
  preRun: function(data, matches, output) { /* 触发器的预处理 */ },
  delaySeconds: 0,
  durationSeconds: 3,
  suppressSeconds: 0,
  promise: function(data, matches, output) { /* 执行异步操作，应当返回 Promise */ },
  sound: '',
  soundVolume: 1,
  response: Responses.doSomething(severity),
  alarmText: {en: 'Alarm Popup'},
  alertText: {en: 'Alert Popup'},
  infoText: {en: 'Info Popup'},
  tts: {en: 'TTS text'},
  run: function(data, matches, output) { /* 执行某些操作 */ },
  outputStrings: {
    key1: { en: 'output1 ${value}'},
    key2: { en: 'output2 ${value}'},
  },
  comment: { en: 'comment text' },
},
```

### data、matches 和 output

几乎所有的触发器属性都可以定义字面量值或者一个形如 `function(data, matches, output)` 的函数，这些参数的功能如下：

- `data` 是一个上下文对象，可以传递数据给所有的触发器。同时触发器也可以修改该对象，以便在后续的触发器中使用。
- `matches` 是当前触发器的正则表达式匹配结果，一般情况下我们关心 `matches.groups` 这个属性。
- `output` 是一个特殊对象，能够讲触发器中的 `outputStrings` 的值转换为字符串。更多信息请参见 `outputStrings` 一节。
  对于 `delaySeconds` 或 `durationSeconds` 等需要返回数字的属性则需要返回数字，对于 `preRun` 和 `run` 等不应当有返回的函数则基本上可以无视该属性。

### 触发器元素

**id string**
字符串，触发器id。所有cactbot的内置触发器均包含一个独一无二的id。我们同样推荐在用户自定义触发器中包含该属性，但这不是强制要求。

触发器id不可重复。若当前触发器的id与某一已定义的触发器完全一致，原触发器的定义则会全部失效，并由其覆盖并替代其位置。这个机制让用户可以方便地复制触发器代码并粘贴到用户文件中，并修改为他们自己喜欢的方式。没有id的触发器无法被覆盖。

目前cactbot采用的 `Regexes/NetRegexes` 结构并不要求将技能名/效果名等名称写进正则表达式。因此，将注释写在代码附近尤为重要。因此我们强烈推荐在触发器id中写入效果名/技能名/NPC名称等，或者在旁边撰写包含这些信息的详尽注释。仅仅依赖触发器本体的上下文信息并不足以了解其用处。(与id一样，若您的触发器不是打算提交到cactbot仓库的，这些要求也可以忽略。)

**disabled: false**
若该值为true，则该触发器将被完全禁用/忽略。默认为false。

**netRegex / regex**
正则表达式，cactbot会将该正则表达式与每一条日志行做比对，并在匹配成功时触发当前触发器。`netRegex` 版本用于匹配网络日志行，而 `regex` 版本用于匹配普通的ACT日志行。

更多时候，相对于直接使用正则表达式字面量，我们更加推荐使用正则替换函数。正则替换函数是指定义在 [regexes.ts](https://github.com/OverlayPlugin/cactbot/blob/main/resources/regexes.ts) 和 [netregexes.ts](https://github.com/OverlayPlugin/cactbot/blob/main/resources/netregexes.ts) 中的辅助函数，这些函数可以接受特定参数值用于匹配日志，并通过正则捕获组的方式帮助你提取未定义的参数值。换句话说，这些函数用于自动构建能够匹配指定类型的日志行的正则表达式。顾名思义，`netRegex` 使用 `NetRegexes` 辅助函数，而 `regex` 使用 `Regexes` 辅助函数。

`regex` 和 `netRegex` 会使用 `timelineReplace` 中的值自动翻译到对应语言。

**condition: function(data, matches)**
当函数返回 `true` 时激活该触发器。若返回的不是 `true`，则当前触发器不会有任何响应。不管触发器对象里定义了多少函数，该函数总是第一个执行。([conditions.ts](https://github.com/OverlayPlugin/cactbot/blob/main/resources/conditions.ts) 中定义了一部分高阶条件函数。一般情况下，如果与情境相符，使用这些函数是最佳解决方案。)

**preRun: function(data, matches)**
当触发器被激活时，该函数会在条件判定成功后立刻执行。

**delaySeconds**
时间，单位为秒，定义从正则表达式匹配上到触发器激活之间的等待时间。其值可以是数字或返回数字的 `function(data, matches)`。该函数会在 `preRun` 之后，`promise` 之前执行。

**promise: function(data, matches)**
设置该属性为返回Promise的函数，则触发器会在其resolve之前等待。这个函数会在等待了 `delaySeconds` 秒之后执行。

**durationSeconds**
时间，单位为秒，显示触发器文本的时长。其值可以是数字或返回数字的 `function(data, matches)`。若该值未设置，默认为3。

**suppressSeconds**
等待时间，单位为秒，再次触发该触发器的冷却时间。其值可以是数字或返回数字的 function(data, matches)。该时间从正则表达式匹配之时开始计算，并且不受 delaySeconds 设置与否的影响。当设置了此元素的触发器被激活后，它在这段时间内无法再次被激活。

**sound**
用于播放声音的音频文件，也可以是 'Info'，'Alert'，'Alarm' 或者 'Long' 之一。文件路径是对于 `ui/raidboss/` 文件夹的相对路径。

**soundVolume**
从0到1的音量数值，触发器激活时播放的音量大小。

**response**
用于返回 infoText/alertText/alarmText/tts 的快捷方法。 这些函数定义于 `resources/responses.ts`。 Response 的优先级比直接指定的文字或TTS低，因此可以被覆盖。 (如同 `regex` 和 `condition` 一样，[responses.ts](https://github.com/OverlayPlugin/cactbot/blob/main/resources/responses.ts) 中定义了一些便于使用的高阶函数。)

**alarmText**
当触发器激活时显示**警报**级别的文本。该属性一般用于高危事件，如处理失败必死无疑的机制、会导致团灭的机制，或处理失败会导致通关变得更加困难的机制等。(例如T2的亚拉戈病毒，T7的诅咒之嚎，或是O7S里奥尔特罗斯先生的石肤等)。其值可以是字符串或返回字符串的 `function(data, matches)`。

**alertText**
当触发器激活时显示**警告**级别的文本。该属性一般用于中危事件，如处理失败可能会致死的机制、会造成全队伤害或全队Debuff的机制等等。(例如，针对坦克的死刑预告，或针对全队的击退预告等)。其值可以是字符串或返回字符串的 `function(data, matches)`。

**infoText**
当触发器激活时显示**信息**级别的文本。该属性一般用于低危事件，不需要玩家立即做出反应。(例如，小怪出现时的警告，或针对治疗职业的全体伤害预告等等)。其值可以是字符串或返回字符串的 `function(data, matches)`。

**tts**
字符串，替代上述文本，用于输出TTS。该值可以是包含本地化字符串的对象，与触发器文本类似。如果该属性存在，但是没有设置当前语言的本地化字符串，Raidboss 会使用文本属性的值用于 TTS。

```typescript
{
  ...
  infoText: {
    en: 'Tank Buster',
    de: 'AoE',
    fr: 'Cleave',
  },
  tts: {
    de: 'Spread',
  },
}
```

如果当前语言是英语 (`en`)，则会读出 `Tank Buster`。反之，如果你的语言是德语 (`de`)，则会读出 `Spread`。

**run: function(data, matches)**
当触发器被激活时，该函数会作为触发器最末尾的步骤执行。

**outputStrings**
该属性是一个可选的间接属性，用于让 cactbot 能够提供用户自定义输出字符串的功能。在自制触发器的时候该属性可以无视，你可以用 `alarmText`、`alertText` 和 `infoText` 这些属性，直接返回字符串。

这个对象可以将某些键映射到对应的可翻译字符串上，因此每一项都应该包含各个语言的字符串。在字符串中，你还可以使用 `${param}` 等占位符，用于在运行时替换为对应的变量。

这里有两个针对死刑的 `outputStrings` 的示例：

```javascript
outputStrings: {
  noTarget: {
    en: 'Tank Buster',
    de: 'Tank buster',
    fr: 'Tank buster',
    ja: 'タンクバスター',
    cn: '坦克死刑',
    ko: '탱버',
  },
  onTarget: {
    en: 'Tank Buster on ${name}',
    de: 'Tank buster auf ${name}',
    fr: 'Tank buster sur ${name}',
    ja: '${name}にタンクバスター',
    cn: '死刑 点 ${name}',
    ko: '"${name}" 탱버',
  },
},
```

`noTarget` 和 `onTarget` 分别是 `outputStrings` 的两个属性的键。

当你想要输出字符串时，可以通过以下方式将参数传递给 `onTarget`。

```javascript
alarmText: (data, matches, output) => {
  return output.onTarget({ name: matches.target });
},
```

调用 `output.onTarget()` 这个函数时，cactbot 会自动对应到 `outputStrings.onTarget` 这一项的当前语言的值。然后将传递的参数 (`param`) 替换形如 `${param}` 的值，从而组装出最终可以让 `alarmText` 输出的字符串。

同理，调用另一个无参数的字符串也是一样的：

```javascript
infoText: (data, matches, output) => {
  return output.noTarget();
},
```

但是在 `response` 属性里使用 `outputStrings` 会稍微有些不同。这种情况下不能在触发器上设置 `outputStrings` 这个值，而是应该让 `response` 返回一个函数，并调用 `output.responseOutputStrings {};`。其中 `{}` 的部分就是上面提到的 `outputStrings` 对象。这看起来非常怪异，但是可以让 response 能够使用 outputStrings 的同时可以正常返回，并保证 [resources/responses.ts](../../resources/responses.ts) 更加耦合。

例子：

```javascript
response: (data, matches, output) => {
  output.responseOutputStrings = { text: { en: 'Some Text: ${words}' } };
  return {
    alarmText: output.text({ words: 'words word words' }),
  };
},
```

**comment**
对象，键是可选的各个语言的字符串。该属性是一个可选的间接属性，用于在 cactbot 配置面板的触发器项附近展示文字。你可以用他解释你的触发器，或是留下一些说明性的文字，亦或是附上一份超链接。

示例：

```javascript
comment: {
  cn: `写下你的注解文本。<em>支持HTML标签</em>`,
},
```

## 其他事项

任何可以返回一个函数 (如 `infoText`、`alertText`、`alarmText` 和 `tts`)的元素都可以返回一个含有本地化字符串的对象。比如返回形如 `{en: 'Get Out', fr: 'something french'}` 的一维对象，用以支持多语言，而不是仅仅返回单个字符串如 `'Get Out'`。当然，其值也可以返回一个函数，再让该函数返回本地化字符串对象。若当前的区域语言不存在于该对象中，则会返回 `en` 的值。

如果有多个触发器同时匹配了同一行日志，触发器会按定义顺序依次执行。

触发器元素按以下顺序载入，定义元素时也应该按该顺序排序：

- id
- disabled
- netRegex
- regex
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
- outputStrings

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

为统一触发器构造，以及减轻翻译时的手动负担，cactbot的触发器元素广泛运用了高阶函数。诸如此类的工具函数使自动化测试更为简单，并让人们在审查拉取更改时更容易捕获错误及文本差异。

目前我们对于元素的独立预定义结构有4种：[Condition](https://github.com/OverlayPlugin/cactbot/blob/main/resources/conditions.ts)、[Regex](https://github.com/OverlayPlugin/cactbot/blob/main/resources/regexes.ts)、[NetRegex](https://github.com/OverlayPlugin/cactbot/blob/main/resources/netregexes.ts) 以及 [Response](https://github.com/OverlayPlugin/cactbot/blob/main/resources/responses.ts)。`Condition` 函数不接受参数，而几乎所有的 `Response` 函数都接受 `severity` 参数，用于定义触发器被激活时输出的警报文本的等级。`Regex` 和 `NetRegex` 函数根据匹配的日志行，接受若干参数 [(例如 `gainsEffect()`)](https://github.com/OverlayPlugin/cactbot/blob/0bd9095682ec15b35f880d2241be365f4bdf6a87/resources/regexes.ts#L348)，不管哪种日志行一般都接受 `source` 属性 (技能的咏唱者/释放者的名称)，`id` 属性 (十六进制的技能ID，例如 `2478`)，以及正则表达式匹配时是否启用捕获组 (`capture: false`)。`Regex` 和 `NetRegex` 函数默认开启捕获组，但按惯例应当仅对依赖捕获数据的触发器开启捕获。

以下是使用了这三种元素的示例触发器：

```javascript
{
  id: 'TEA Mega Holy Modified',
  netRegex: NetRegexes.startsUsing({ source: 'Alexander Prime', id: '4A83', capture: false }),
  condition: Conditions.caresAboutMagical(),
  response: Responses.bigAoe('alert'),
},
```

尽管由于我们需要定义所有语言的正则表达式，该方法并未减少代码行数，但仍然远远优于：

```javascript
{
  id: 'TEA Mega Holy Modified',
  netRegex: /^(?:20)\|(?:[^|]*)\|(?:[^|]*)\|(?:Alexander Prime)\|(?:4A83)\|/i,
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

使用正则表达式字面量的方式已被废弃。 *请务必*使用上述的高阶函数生成对应的正则表达式，除非您有特别的原因必须要这样做。在提交拉取请求时使用正则表达式字面量会导致构建失败。当的确存在特定的需求，不得不使用正则表达式字面量时 (例如ACT新增了其他类型的日志行)，我们强烈推荐开启一个拉取请求，直接更新 `regexes.ts` 文件。

(当然，若您正在撰写仅用于您个人的触发器，您可以随意发挥。此处的警告仅针对想为 cactbot 项目提交贡献的人们。)

可能的话，建议尽量使用在conditions和responses中定义的高阶函数，尽管SE的“天才”战斗设计组有时真的可以让它*无法生效*。

## 输出文本

为了减少不同触发器集合中的文本重复，cactbot 包含了一套常用的文本片段。如果你需要使用的输出文本已经存在，推荐直接使用 `Outputs` 而非手写。

以下是使用 `outputStrings` 和 `Outputs` 的例子：

```javascript
{
  id: 'E9S Zero-Form Devouring Dark',
  netRegex: NetRegexes.startsUsing({ id: '5623', source: 'Cloud Of Darkness' }),
  durationSeconds: 4,
  alertText: function(data, matches, output) {
    if (data.me === matches.target)
      return output.tankBusterOnYou();

    if (data.role === 'tank')
      return output.tankSwap();

    if (data.role === 'healer')
      return output.tankBusters({ player: data.party.member(matches.target) });
  },
  infoText: function(data, _matches, output) {
    if (data.role !== 'tank' && data.role !== 'healer')
      return output.avoidLaser();
  },
  outputStrings: {
    tankBusterOnYou: Outputs.tankBusterOnYou,
    tankBusters: Outputs.tankBusters,
    tankSwap: Outputs.tankSwap,
    avoidLaser: {
      en: 'Avoid Laser',
      de: 'Laser ausweichen',
      fr: 'Évitez le laser',
      ja: 'レーザー注意',
      cn: '躲避击退激光',
      ko: '레이저 피하기',
    },
  },
},
```

## 关于时间轴

触发器子目录内可能包含了一部分采用 ACT Timeline 插件格式定义的时间轴文本文件，您可以通过此链接了解： <http://dtguilds.enjin.com/forum/m/37032836/viewthread/26353492-act-timeline-plugin>

Cactbot的每一个时间轴文件均由同文件夹下某个对应的 [TRIGGER-FILE].js 加载。通常情况下，时间轴文件的名称需与触发器文件一致，同时此文件名应当至少与副本区域名称可以一一对应，即不具有歧义。

Cactbot在原基础上实现了一部分扩展语法。扩展语法可以在时间轴文本文件内或触发器的 `timeline` 属性中使用。

**infotext "event name" before 1**
在某个事件发生之前显示一个“信息”级别的文本。`event name` 与文件中的某个列出的事件名称匹配，并且在所有同名事件发生前均会显示指定文本。默认显示的文本为事件名称，但若您需要显示其他文本，添加指定文本至行末即可。`before` 参数是必填项，但您可以将其设置为0以令文本在事件发生的同时显示。当您需要使文本在事件之后显示时，也可以设置为负值。

**例1：在事件发生前1秒时显示“信息”等级文本**
`infotext "event name" before 1`

**例2：在事件发生前更早显示“信息”等级文本，并修改了默认文本**
`infotext "event name" before 2.3 "alternate text"`

**例3：与前述同事件名的“警告”等级文本**
`alerttext "event name" before 1`
`alerttext "event name" before 2.3 "alternate text"`

**例4：与前述同事件名的“警报”等级文本**
`alarmtext "event name" before 1`
`alarmtext "event name" before 2.3 "alternate text"`

## 关于翻译

本文档主要针对 Raidboss 组件编写，但是下方的内容适用于 cactbot 中所有需要翻译的部分。

大部分 cactbot 开发者都使用英语游玩 FFXIV，因此我们非常感谢所有能够提交翻译的拉取请求的人们，我们也欢迎针对 github 和 git 的使用的提问。

你可以运行 `npm run coverage-report` 以生成 cactbot 覆盖率报告，在[这里](https://overlayplugin.github.io/cactbot/util/coverage/coverage.html)还有当前主分支的在线版本。

覆盖率报告也包含了翻译内容的覆盖率，如：

- [德文覆盖率报告](https://overlayplugin.github.io/cactbot/util/coverage/missing_translations_de.html)
- [法文覆盖率报告](https://overlayplugin.github.io/cactbot/util/coverage/missing_translations_fr.html)
- [日文覆盖率报告](https://overlayplugin.github.io/cactbot/util/coverage/missing_translations_ja.html)
- [中文覆盖率报告](https://overlayplugin.github.io/cactbot/util/coverage/missing_translations_cn.html)
- [韩文覆盖率报告](https://overlayplugin.github.io/cactbot/util/coverage/missing_translations_ko.html)

待办事项：对于中国服/韩国服，更好地做法是将未公开的版本显示为无需翻译。

你可以运行 `npm run util` 然后选择 `find translation` 以查找需要翻译的内容。也可以直接输入 `npm run util -- findTranslations -f . -l cn` 查找缺失的中文翻译（对于法文则是 `-l fr`，对于德文则是 `-l de`，以此类推）。如果选择的是默认选项，该脚本会生成与在线版本完全相同的内容。

覆盖率报告会显示为不同的错误类别：

- other 其他：一般杂项错误，一般不需要关心。
- code 代码：一段需要翻译的 TypeScript 代码。
- sync 同步： 包含了需要翻译的 `sync /xxx/` 的触发器或时间轴。
- text 文本：需要翻译的时间轴文本（如： `2.0 "text"`）。

### 代码翻译

cactbot 中许多代码使用了 `LocaleText` 类型取代需要翻译的字符串。

`LocaleText` 是一个包含了多个语言的字符串的对象，并且按 `en` `de` `fr` `ja` `cn` `ko` 的顺序排列。单元测试会检测顺序是否正确。该顺序的考虑是“英语优先”，然后“国际服的语言按字母顺序排列”，最后是“其他服按字母顺序排列”。英语是唯一必选的语言。

下面是一个缺失了日语翻译的例子，测试报告会指出这个问题：`ui/oopsyraidsy/data/06-ew/raid/p4n.ts:78 [code] text: {`。其中 `text: {` 部分是缺失了日语翻译的代码起始部分。HTML 报告页面也有链接到对应代码的链接。

这个例子取自[这里](https://github.com/OverlayPlugin/cactbot/blob/e47d34b/ui/oopsyraidsy/data/06-ew/raid/p4n.ts#L78-L84)：

```typescript
          text: {
            en: 'DPS Tower',
            de: 'DD-Turm',
            fr: 'Tour DPS',
            cn: 'DPS塔',
            ko: '딜러 장판',
          },
```

正如上面的例子所示，这个对象缺失了 `ja` 字段，等待译者填写。

### Raidboss 翻译

对于 `sync 同步` 和 `text 文本` 错误，应当通过（名字取得很奇怪的）`timelineReplace` 属性进行翻译。（定义这个属性的时候，我们还仅用它翻译时间轴文本。而现在它也用于翻译触发器的 `netRegex` 和 `regex` 字段。但是，为了向后兼容，我们依旧叫它 `timelineReplace`。）

这个字段的形状如下：

```typescript
    {
      'locale': 'fr',
      'replaceSync': {
        'Kokytos\'s Echo': 'spectre de Cocyte',
        'Kokytos(?!\')': 'Cocyte',
        // etc
      },
      'replaceText': {
        'Aero IV': 'Giga Vent',
        'Archaic Demolish': 'Démolition archaïque',
        // etc
      },
    },
```

其中的 `replaceSync` 部分不仅会应用到时间轴文件的 `sync /xxx/` 行，还在触发器的 `netRegex` 行中起作用。`replaceText` 部分则会应用于时间轴的 `"Text"` 部分。匹配是大小写不敏感的。

在内部实现中，cactbot 会以下面所示的替换法则将 `timelineReplace` 部分的字段应用于时间轴和触发器中，但注意这仅作演示，实际要更加复杂：

```diff
# p9s.txt 时间轴文件
-168.7 "Archaic Demolish" sync / 1[56]:[^:]*:Kokytos:816D:/
+168.7 "Démolition archaïque" sync / 1[56]:[^:]*:Cocyte:816D:/
```

```diff
     // p9s.ts 触发器文件
     {
       id: 'P9S Archaic Demolish',
       type: 'StartsUsing',
-      netRegex: { id: '816D', source: 'Kokytos', capture: false },
+      netRegex: { id: '816D', source: 'Cocyte', capture: false },
       alertText: (_data, _matches, output) => output.healerGroups!(),
       outputStrings: {
         healerGroups: Outputs.healerGroups,
       },
     },
```

#### 通用翻译替换

为了避免重复翻译相似的字段很多次，[common_replacement.ts](https://github.com/OverlayPlugin/cactbot/blob/main/ui/raidboss/common_replacement.ts) 文件定义了 `export const commonReplacement` 变量，包含了 `replaceSync` 和 `replaceText`，这个变量会隐式地包含于所有触发器集合中。

因此这些字段不需要翻译（当你尝试翻译这些文本时，`npm run test` 也会报告错误）。

#### 翻译冲突 (collision)

这里有一个需要记住的重要概念：`replaceSync` 和 `replaceText` 中的字段在应用替换时**并不会**保证顺序。这让我们理论上可以更好地审查对于翻译替换的更改，因为最多只有一次替换。

因此 cactbot 的测试中会有专门的“冲突测试”保证翻译条目在应用时不会相互冲突，对于同一个文本也不会给出不同的翻译。这些测试可能让译者疲于解决冲突，但是避免了很多潜在问题。

如果你遇到了冲突错误不知道如何解决时，请上传你的翻译并开启一个包含错误的拉取请求，然后在评论中提出你的问题。我们会帮助你解决冲突。

#### 预翻译冲突

`npm run test` 可能会报告 **预翻译冲突** (pre-translation collision)，这表明你的 `replaceSync` 和 `replaceText` 中存在两条互相冲突的条目，这两个条目都可以应用于同一个文本，但是**不能同时应用**。

下面是一个 P9S 的例子，有一部分修改：

```typescript
    {
      'locale': 'fr',
      'replaceSync': {
        'Kokytos\'s Echo': 'spectre de Cocyte',
        'Kokytos': 'Cocyte',
        // etc
      },
    },
```

当我们要翻译 `Kokytos's Echo` 时，两个条目都可以匹配这个字符串，因此我们可能会先替换`Kokytos`，然后替换 `Kokytos's Echo`，当然反过来也是可能的。

这就导致了冲突问题：当我们先替换 `Kokytos's Echo`，它会变成 `spectre de Cocyte`，现在 `Kokytos` 无法匹配，因此我们得到了正确的翻译。

但是，当我们先替换 `Kokytos`，它会变成 `Cocyte's Echo`，现在 `Kokytos's Echo` 无法匹配，但这是错误的翻译。

你可以看到，这是由于两个条目都可以匹配同一个字符串，但是先后顺序不同导致了不同的结果，这就是预翻译冲突。

要解决这个问题，我们可以用正则表达式中的 **先行否定断言** (negative lookahead，即 `(?!text)`) 或者 **后行否定断言** (negative lookbehind，即 `(?<!text)`) 的断言语句使该正则表达式不会匹配到引导或者跟随在某个文本后面的字符串。更多信息可以参见[这个链接](https://www.regular-expressions.info/lookaround.html)。

在这个例子中，我们可以把 `'Kokytos'` 替换为 `'Kokytos(?!\')'`。它的意思是：“匹配 Kokytos，但是如果它后面是直引号就不要匹配”。于是我们不需要依赖替换顺序也能保证正确的翻译了。

题外话，如果没有冲突的话，同一个文本是可以被多个匹配条目翻译多次的。比如，当我们文本里有 `Front / Back` 这样的字符串，并且存在两个条目分别匹配 `Front` 和 `Back`，那么不管你以什么顺序应用这两个条目，最终都会得到同一个翻译。在这种情况下自然也不会有预翻译冲突。

#### 后翻译冲突 (post-translation collision)

后翻译冲突是指当一个条目已经被翻译之后，又有一个条目（也可以是同一个条目）匹配了这个翻译后的字符串，从而导致了翻译错误。这也是一种我们需要避免的翻译顺序的问题。尽管这通常是因为翻译后的非英语的字符串的一部分刚好是一个出现在原文中的英语单词，导致了翻译被应用了多次，因此这种情况非常少见。

下面是一个半自创的例子，能够说明后翻译冲突发生的原因：

```typescript
    {
      'locale': 'de',
      'replaceText': {
        'Time Explosion': 'Zeiteruption',
        'Eruption': 'Ausbruch',
      },
    },
```

当我们翻译 `Time Explosion` 时，它会变成 `Zeiteruption`，这个单词中间又能够匹配 `Eruption`（还记得字符串匹配是大小写不敏感吗），因此又被翻译了一次，导致了错误的翻译。同样地，这个冲突也可以通过改写成 `'(?<!t)Eruption': 'Ausbruch'` 来解决，意思是 `Eruption` 这个单词不能跟随在 t 后面。

还有一种潜在的后翻译冲突发生在匹配条目自身，比如 `'Bomb': 'Bombe'`。在 `Bomb` 翻译成 `Bombe` 之后又会匹配一次 `Bomb`，因此我们应当改写成 `'Bomb(?!e)': 'Bombe'`。你应该记得前面说过每个条目只会应用一次，但是这依旧会被考虑为一种后翻译冲突。

还有一种看起来非常像是后翻译冲突的条目，如 `'Ultima': 'Ultima'`，但是这种特殊情况下，这个条目相当于什么都没做。它存在的目的仅仅是为了把这个文本标注为“已翻译”，以让检测翻译缺失的脚本能够正确地报告问题。

#### missingTranslations 属性

`timelineReplace` 中还存在 `missingTranslations` 属性，默认为 false。如果某个条目存在，但是没有翻译所有字符串，那你需要将这个属性设置为 `true`（否则 `npm run test` 会报错）。这通常是因为更新了时间轴或触发器时添加了新的待翻译字符串，这让译者知道需要更新翻译。

而另一个情况是，当某个副本已经完全翻译完毕，但是有人不小心写错了单词，这时测试就能够找出问题所在。

当 `missingTranslations: true` 设置的时候，`npm run test` 不会报告翻译缺失问题，但是 findMissingTranslations 脚本会报告这些问题。

#### 转义

这时针对特殊字符转义的简要说明，附带一些例子。

所有的 `replaceSync` 和 `replaceText` 键都是字符串，会通过 `new RegExp(regexString, 'gi')` 解析为正则表达式。但是 `replaceSync` 比较特殊，它会同时应用于时间轴的 sync 语句和触发器的参数，这就导致了不同的转义需求。时间轴是文本，而触发器是代码，这意味着触发器的参数中的字符串会首先被 JS 解析器转义一次才能应用我们的正则表达式。

举个例子，当要匹配时间轴中的 `sync /Pand\u00e6monium/` 时，我们要写一个能够匹配字符串 `'Pand\\u00e6monium'` 的正则表达式。而当要匹配触发器中的 `netRegex: { source: 'Pand\u00e6monium' }`，那我们要写一个能匹配 `'Pand\u00e6monium'` 或 `'Pandæmonium'`（这两个是全等的）的正则表达式。

（抱歉，我想不出更好的例子了。）

当时间轴文本中存在形如 `Harrowing Hell (cast)` 时，要匹配这个字符串的 `cast` 部分，我们就需要把 `replaceText` 的键写成这样：`\\(cast\\)`。正则表达式要匹配括号 `(` 就必须转义，而当把反斜线写在字符串时，它也许要转义。所以这里就需要写两个反斜线。

另一个例子是 P10S 中有四个反斜线的 `'Pand\\\\u00e6monium'`。你可以考虑它分成两个部分 `'\\' + '\\'`。当作为字符串被 `new RegExp('Pand\\\\u00e6monium')` 解析时，它就变成了 `/Pand\\u00e6monium/` 这个样子。换句话说，它可以匹配 `Pand` 后面跟随着反斜线和 `u00e6`，最后是 `monium` 的字符串。

最后一个例子比较疯狂，它写作 `'724P-Operated Superior Flight Unit \\\\\\(A-Lpha\\\\\\)'`。`(` 是特殊字符，在正则表达式中必须写作 `\(`，所以我们要用字符串字面量匹配它就必须写成四个反斜线 `\\\\` 匹配单个反斜线，加上 `\\(` 匹配单个括号。这个例子如果写成正则表达式字面量应该是 `/724P-Operated Superior Flight Unit \\\(A-Lpha\\\)/`。

虽然转义非常烦人，但好消息是，譬如反斜线、括弧、方括号等这些需要转义的特殊字符在 FFXIV 中还是比较少的，所以不需要太过担心，遇到问题可以提问。
