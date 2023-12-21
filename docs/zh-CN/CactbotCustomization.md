# Cactbot自定义教程

🌎 [[English](../CactbotCustomization.md)] [**简体中文**] [[繁體中文](./zh-TW/CactbotCustomization.md)] [[한국어](../ko-KR/CactbotCustomization.md)]

- [使用cactbot配置界面](#使用cactbot配置界面)
- [通过cactbot配置界面改变触发器文本](#通过cactbot配置界面改变触发器文本)
- [用户文件夹概览](#用户文件夹概览)
- [设置您自己的用户文件夹](#设置您自己的用户文件夹)
- [样式自定义](#样式自定义)
- [Raidboss触发器自定义](#raidboss触发器自定义)
  - [例1：改变输出文本](#例1改变输出文本)
  - [例2：使挑衅提示适用于全职业](#例2使挑衅提示适用于全职业)
  - [例3：添加自定义触发器](#例3添加自定义触发器)
- [Raidboss时间轴自定义](#raidboss时间轴自定义)
- [行为自定义](#行为自定义)
- [用户文件的调试](#用户文件的调试)
  - [检查OverlayPlugin的错误日志](#检查OverlayPlugin的错误日志)
  - [检查文件是否加载](#检查文件是否加载)
  - [检查文件是否有错误](#检查文件是否有错误)

## 使用cactbot配置界面

自定义cactbot时，推荐使用cactbot的配置界面进行操作。该界面位于 ACT -> Plugins -> OverlayPlugin.dll -> Cactbot。

它可以提供如下功能：

- 设置触发器输出TTS
- 禁用触发器
- 改变触发器输出
- 改变cactbot语言
- 音量设置
- 隐藏奶酪图标

您可能无法通过cactbot配置界面以配置所有您想要的更改。但这是所有自定义方式中最简单的，适合作为您开启定制化的第一步。 以后此界面会添加更多的选项。

此处的选项会存储于 `%APPDATA%\Advanced Combat Tracker\Config\RainbowMage.OverlayPlugin.config.json` 文件中。但您并不需要也不应当直接修改该文件。

## 通过cactbot配置界面改变触发器文本

在位于 ACT -> 插件 -> OverlayPlugin.dll -> Cactbot -> Raidboss 的 cactbot 配置界面中，罗列着所有的触发器。这里的列表让您可以更改每个触发器支持外部更改的配置设置。

名称旁边带有铃铛 (🔔) 的设置项的触发器输出文本是可以被覆盖的。举个例子，假设有一个🔔onTarget字段，其文本为 `死刑点${player}`。 当某人接到死刑技能时，这个字符串将出现在屏幕上（或通过tts播报）。 `${player}` 参数由触发器动态设置。任何类似于 `${param}` 的字符串都是动态参数。

比如，您可以将这个文本更改为 `${player} 即将死亡！`。或者，也许您不关心谁是目标，那么您可以将其改为 `死刑` 以使文本更加简短。如果您想撤消自己的更改，只需清空文本框即可。

但这个方式有一定的限制。例如，您无法更改逻辑；而且在大多数情况下，您无法使 `tts` 的播报内容与 `alarmText` 相区别、无法添加更多的参数。如果您想要对触发器做出更加复杂的覆盖操作，那么您需要查看 [Raidboss触发器自定义](#raidboss触发器自定义) 小节。

每一个引用玩家的参数（通常称为 ${player} ，但不总是），都可以进一步修改输出文本：

- `${player.job}`：职业缩写，例如 白魔
- `${player.jobFull}`：职业全名，例如 白魔法师
- `${player.role}`：职能，例如 治疗
- `${player.name}`：玩家的全名，例如 吉田直树
- `${player.nick}`：玩家的昵称/名，例如 吉田直树 （注：国服对于昵称和全名不做区分；国际服的昵称指代“first name”）
- `${player.id}`：玩家的ID（用于测试），例如 1000485F

当发生错误，或者玩家不在你的队伍中，或者使用了无效的后缀时，系统可能会退而使用默认昵称，以确保能够打印出相应的信息。

默认设置下，`${player}` 等同于 `${player.nick}`，但是你可以在 cactbot 配置界面的 raidboss 部分下的 “默认玩家代称” 选项来设置此默认值。

## 用户文件夹概览

若cactbot配置界面不存在您所需的选项，您可能需要考虑以用户文件覆盖的方式进行自定义。您需要编写JavaScript代码和CSS样式表，这意味着您可能需要掌握一点点编程知识。

Cactbot的设计哲学要求用户的任何自定义配置都应当存放于用户文件夹中。同时这也能防止您所做的更改在今后cactbot的更新中被覆盖失效。另外，目前您无法通过直接修改cactbot的文件应用您的更改，除非您了解如何构建您自己的项目。

所有的cactbot模块都会从 [user/](../../user/) 文件夹加载用户设置。 `raidboss` 模块会加载 `user/raidboss.js` 与 `user/raidboss.css`，以及所有 `user/raidboss/` 目录及子目录下的任意 `.js` 和 `.css` 文件。(时间轴`.txt` 文件必须与引用它们的 `.js`文件放在同一个文件夹中。) 这些用户自定义文件将在cactbot自身加载完毕后加载，并可以覆盖对应的模块的设置。

与之类似，`oopsyraidsy` 模块会加载 `user/oopsyraidsy.js` 与 `user/oopsyraidsy.css`，以及 `user/oopsyraidsy/` 目录及子目录下的所有 `.js` 和 `.css` 文件。依此类推，每个模块都支持以此方式加载对应名称的自定义文件。

cactbot将按照字母顺序优先加载user文件夹中的子文件夹里的文件，其次加载子文件夹外的文件。这就是为什么 `user/raidboss.js` 文件总是最后被加载并可以覆盖 `user/raidboss/` 文件夹中任何文件中的配置。例如，`user/alphascape/some_file.js` 先加载， `user/mystatic/some_file.js` 再加载，最后是 `user/raidboss.js` 加载。`.css` 文件自然也遵循同样的顺序。

在本文档中，“用户自定义js文件”指代以上两者。除了加载顺序以外，`user/raidboss.js` 和 `user/raidboss/some_file.js` 没有任何区别。同样地，“用户自定义css文件”同时指代 `user/radar.css` 和 `user/radar/some_file.css` 二者。用户文件夹中分出子目录是为了让触发器的分享和自定义配置更容易。

当开发者模式开启时，你可以从[调试信息](#检查文件是否加载)中得到更多关于加载顺序的信息。

`user/` 文件夹中包含了一部分示例配置文件，您可以对其重命名并直接使用。如 [user/raidboss-example.js](../../user/raidboss-example.js) 文件可重命名为 `user/raidboss.js`，对其所做的更改将应用于 `raidboss` 模块。

在修改了这些文件之后，单击ACT中OverlayPlugin插件页面对应悬浮窗设置中的“重载悬浮窗”按钮，即可应用更改。

## 设置您自己的用户文件夹

您可以通过cactbot配置界面设置用户文件夹：ACT -> Plugins -> OverlayPlugin.dll -> Cactbot -> cactbot用户文件夹。单击 `选择文件夹` 按钮，选择磁盘上的任意文件夹。

如果没有选择，cactbot将自动选择其安装目录下的默认文件夹。

建议您选择cactbot安装目录下的 `cactbot/user` 文件夹。 该文件夹通常为位于 `%APPDATA%\Advanced Combat Tracker\Plugins\cactbot-version\cactbot\user`。 有部分示例配置文件位于 [此文件夹](../../user) 下。

## 样式自定义

用户自定义css文件可以对UI模块的位置、尺寸、颜色等进行自定义。可用的选择器可以通过阅览 `ui/<name>/<name>.css` 文件找到。

例如您在 [ui/raidboss/raidboss.css](../../ui/raidboss/raidboss.css) 中，可发现诸如 `#popup-text-container` 与 `#timeline-container` 等选择器， 则您可以在 `user/raidboss.css` 中对其位置进行自定义。您可以在 `user/raidboss.css` 中或其他 `user/raidboss/` 下的 `.css` 中添加更多的样式。

同样地，您可以在 `.info-text` 类中添加新的CSS规则，对信息文字的尺寸和颜色进行自定义。例如：

```css
.info-text {
  font-size: 200%;
  color: rgb(50, 100, 50);
}
```

简单地说，您可以认为cactbot会将用户文件中的CSS规则添加至内置CSS文件的末尾。因此，您需要注意 [CSS优先级规则](https://developer.mozilla.org/en-US/docs/Web/CSS/Specificity)，有时需要添加 `!important` 让您的规则可以强制覆盖。另一方面，您可能需要重置某些属性为默认的 `auto` 值。

我们推荐使用 [Chrome DevTools](https://developers.google.com/web/tools/chrome-devtools) 以调试CSS。您可以通过 ACT -> Plugins -> OverlayPlugin.dll -> 您的悬浮窗名字 -> 启动Debug工具 按钮以开启DevTools。

**注意**：某些组件的自定义较为困难，甚至无法进行自定义，如时间轴的进度条等。原因是，这些组件属于自定义HTML元素，且没有开放外部配置的接口。如果您有特别的需求，但是不知道如何修改，您可以提出一个 [github issue](https://github.com/OverlayPlugin/cactbot/issues/new/choose)。

**警告**：cactbot不保证CSS的向后兼容性。在以后的更改中，cactbot可能会重新组织网页结构，改变元素名称和类名称，甚至重构所有样式。因此，您需知晓您的自定义CSS有在将来出现问题的风险。

## Raidboss触发器自定义

您可以通过用户自定义js文件(例如 `user/raidboss.js` 或 `user/raidboss/` 目录下的任意 `.js` 文件)自定义触发器行为。您可以修改输出文本、适用职业、文本显示的时间等等。

您可以在[这个分支](https://github.com/OverlayPlugin/cactbot/tree/triggers)查看所有触发器的 JavaScript 版本。我们推荐您查看、拷贝并粘贴这个分支中的代码实现您自己的触发器。主分支（main）中的触发器代码基于 TypeScript 写成，无法直接在ACT或浏览器中运行；而发行版本中的代码经过了编译与混淆，对于人类来说难以阅读，因此不作推荐。

在您的raidboss模块用户自定义js文件中，`Options.Triggers` 是一个存放了触发器集合的列表。您可以通过此变量添加新触发器，或修改已有的触发器。若用户文件中存在与现有触发器 (cactbot官方提供的) 相同id的触发器，则会将后者完全覆盖。

在您修改触发器前，我们推荐您阅读[触发器指南](RaidbossGuide.md)以了解各触发器的诸多属性的含义。

一般来说，你需要将形如以下的代码块加入到你的用户自定义js文件(例如 `user/raidboss.js`)中：

```javascript
Options.Triggers.push({
  // 在文件开头定义ZoneId，
  // 例如 ZoneId.MatchAll (指定所有区域) 或 ZoneId.TheBozjanSouthernFront 等
  zoneId: ZoneId.PutTheZoneFromTheTopOfTheFileHere,
  triggers: [
    {
      // 这里定义的是触发器(trigger)对象。
      // 例如 id, netRegex或infoText等
    },
  ],
});
```

最简单的定制触发器的方式是直接复制上面那一大块代码粘贴到此文件再进行修改。您可以修改 `zoneId` 一行为您想要触发器响应的区域id，通常位于cactbot触发器文件的顶部。[该文件](../../resources/zone_id.ts)中列出了所有可用的区域id。若您定义了错误的id，OverlayPlugin的日志窗口将会输出警告信息。然后[复制触发器文本](https://github.com/OverlayPlugin/cactbot/tree/triggers)并粘贴至此，按您的喜好进行修改。当你修改完成后，重载raidboss悬浮窗以应用更改。

**注意**：此方式会将原触发器完全移除，因此请在修改时不要删除任何逻辑代码。触发器均采用JavaScript编写，因此必须采用标准JavaScript语法。若您不是字面意义上的程序员，您需要格外注意这点。

### 例1：改变输出文本

假定您正在攻略巴哈姆特绝境战(UCOB)，但您的固定队采用的不是cactbot中默认的火1集合吃的打法，而是先单吃火1。此外，您*同时*还想让触发器通过tts播报与显示文本不同的内容。比如，您总是忘记出人群，因此您想让它重复播报数次。

若您只是想修改 `信息文本`，你可以 [通过cactbot配置界面改变触发器文本](#通过cactbot配置界面改变触发器文本) 实现。

其中一种调整方式是编辑触发器的输出。您可以在 [ui/raidboss/data/04-sb/ultimate/unending_coil_ultimate.js](https://github.com/OverlayPlugin/cactbot/blob/triggers/04-sb/ultimate/unending_coil_ultimate.js#:~:text=UCU%20Nael%20Fireball%201) 中找到原本的 fireball #1 触发器。

您需要将以下的代码粘贴至您的用户自定义js文件底部。

```javascript
Options.Triggers.push({
  zoneId: ZoneId.TheUnendingCoilOfBahamutUltimate,
  triggers: [
    {
      id: 'UCU Nael Fireball 1',
      netRegex: NetRegexes.ability({ source: 'Ragnarok', id: '26B8', capture: false }),
      delaySeconds: 35,
      suppressSeconds: 99999,
      // infoText 是绿色的文字。
      infoText: {
        en: 'Fire OUT',
        cn: '火球，出人群',
      },
      tts: {
        en: 'out out out out out',
        cn: '出去出去出去！',
      },
      run: function(data) {
        data.naelFireballCount = 1;
      },
    },
  ],
});
```

这里仅包含了英文和中文。

### 例2：使挑衅提示适用于全职业

目前，只有团队成员的挑衅会触发提示，并且不是所有职业都能收到提示。该例子展示了如何使其适用于所有职业。挑衅触发器可以在 [ui/raidboss/data/00-misc/general.js](https://github.com/OverlayPlugin/cactbot/blob/triggers/00-misc/general.js#:~:text=General%20Provoke) 中找到。

我们需要修改 `condition` 函数(function)。此处的id应当与内置的 `General Provoke` 触发器一致，才能正确覆盖同名的内置触发器。

您需要将以下的代码粘贴至您的用户自定义js文件底部。

```javascript
Options.Triggers.push({
  zoneId: ZoneId.MatchAll,
  triggers: [
    {
      id: 'General Provoke',
      netRegex: NetRegexes.ability({ id: '1D6D' }),
      condition: function(data, matches) {
        // 我希望看到所有的挑衅提示，不管他们在不在我的队伍中，
        // 也不管我是不是坦克。
        return true;
      },
      infoText: (data, matches, output) => {
        return output.text!({ player: data.party.member(matches.source) });
      },
      outputStrings: {
        text: {
          en: 'Provoke: ${player}',
          de: 'Herausforderung: ${player}',
          fr: 'Provocation: ${player}',
          ja: '挑発: ${player}',
          cn: '挑衅: ${player}',
          ko: '도발: ${player}',
        },
      },
    },
  ],
});
```

当然，您也可以直接删除整个 `condition` 函数，毕竟没有condition的触发器在匹配到正则时永远会运行。

### 例3：添加自定义触发器

您也可以用同样的办法添加您的自定义触发器。

这是一个示例触发器，当您中了“叉形闪电”效果时，会在1秒后显示“快出去!!!”。

```javascript
Options.Triggers.push([
  {
    zoneId: ZoneId.MatchAll,
    triggers: [
      {
        // 这是一个自定义的id，因此不会覆盖任何现有的触发器。
        id: 'Personal Forked Lightning',
        regex: Regexes.gainsEffect({ effect: 'Forked Lightning' }),
        condition: (data, matches) => { return matches.target === data.me; },
        delaySeconds: 1,
        alertText: '快出去!!!',
      },

      // 您的其他触发器……
    ],
  },

  // 其他区域的触发器集合……
]);
```

我们推荐阅读 [触发器指南](RaidbossGuide.md) 以了解如何撰写cactbot的触发器，当然您也可以直接看 [ui/raidboss/data](../../ui/raidboss/data) 中现有的触发器代码。

## Raidboss时间轴自定义

一些自定义操作可以通过 [cactbot 配置界面](#使用cactbot配置界面) 实现。你可以在这个界面隐藏或重命名现有的时间轴条目，也可以添加自定义时间轴条目等。

仅当你需要做的操作超出了配置界面所能提供的范围时才考虑使用本章节的操作，比如完全替换整个时间轴。替换时间轴的操作与 [替换触发器](#替换raidboss触发器) 类似。

自定义时间轴的步骤如下：

1) 复制原有的时间轴文本文件内容至您的用户文件夹

    例如，您可以复制
    [ui/raidboss/data/05-shb/ultimate/the_epic_of_alexander.txt](../ui/raidboss/data/05-shb/ultimate/the_epic_of_alexander.txt)
    至 `user/the_epic_of_alexander.txt`。

1) 在 user/raidboss.js 中添加代码

    如同我们添加触发器一样，您依旧需要定义 `zoneId`、 `overrideTimelineFile: true`，
    以及定义文本文件名称的 `timelineFile` 属性。

    ```javascript
    Options.Triggers.push({
      zoneId: ZoneId.TheEpicOfAlexanderUltimate,
      overrideTimelineFile: true,
      timelineFile: 'the_epic_of_alexander.txt',
    });
    ```

    （假设您已经做完了第一步，并且该文本文件的名称为 `user/the_epic_of_alexander.txt` ）

    设置 `overrideTimelineFile: true` 是为了告诉cactbot将内置的时间轴完全替换为您添加的文件。

1) 按您的喜好编辑您自己的时间轴文件

    阅读 [时间轴指南](TimelineGuide.md) 学习更多关于时间轴的知识。

**注意**：编辑时间轴文件有一定的风险，因为部分触发器依赖于时间轴的特定文字。例如在绝亚历山大中，`Fluid Swing` 与 `Propeller Wind` 都有对应的时间轴触发器。如果这些文字被替换或移除，时间轴触发器也同样会失效。

## 行为自定义

这一文段将讨论自定义cactbot的其他方式。Cactbot中有一些不在配置界面显示，也不是触发器的变量。

每个cactbot模块都有一个名为 `Options` 的变量，它包含了若干控制选项。可用的 `Options` 变量会在每个 `ui/<name>/<name>.js` 文件的顶部列出。

例如在 [ui/raidboss/raidboss.js](../../ui/raidboss/raidboss.js) 文件中，您可以通过 `PlayerNicks` 选项定义玩家的昵称。

```javascript
Options.PlayerNicks = {
  // 国际服的格式为 '名 姓': '昵称',
  // 国服的格式为 '名': '昵称',
  'Banana Nana', 'Nana',
  'The Great\'one', 'Joe', //  =>  这里需要一个反斜杠转义单引号
  'Viewing Cutscene': 'Cut',
  // 等等
};
```

你也可以通过 `Options.TransformTts` 函数全局替换 TTS 的文本，如：

```javascript
Options.TransformTts = (text) => {
  return text.replace('a', 'b');
};
```

**警告**：用户文件夹中的文件会静默覆盖cactbot配置窗口的同名选项。 该行为可能会造成一些困惑，因此您应当直接通过配置窗口设置这些变量，当且仅当配置窗口不提供设置方法时可以采用此方式覆盖默认行为。

## 触发器全局可用变量

用户文件以 `eval` 的方式加载，因此无法像内置的触发器文件那样使用 import 语句。
用户文件可以访问如下的变量：

- [Conditions](../../resources/conditions.ts)
- [ContentType](../../resources/content_type.ts)
- [NetRegexes](../../resources/netregexes.ts)
- [Regexes](../../resources/regexes.ts)
- [Responses](../../resources/responses.ts)
- [Outputs](../../resources/outputs.ts)
- [Util](../../resources/util.ts)
- [ZoneId](../../resources/zone_id.ts)
- [ZoneInfo](../../resources/zone_info.ts)

## 用户文件的调试

### 检查OverlayPlugin的错误日志

您可以在 ACT -> Plugins -> OverlayPlugin.dll 找到位于该窗口的底部的OverlayPlugin日志窗口，它是一个自动滚动的文本窗口。

当运行错误时，错误信息会显示在此处。

### 检查文件是否加载

首先，您需要开启raidboss模块的调试模式。 打开cactbot配置窗口，启用 `显示开发者选项` ，然后重新加载悬浮窗。 然后，勾选raidboss模块下的 `启用调试模式`，再次重载悬浮窗。

当raidboss模块的调试模式启用时，OverlayPlugin的日志窗口中会打印更多信息。 每次本地的用户文件加载时都会输出类似于这样的信息： `[10/19/2020 6:18:27 PM] Info: raidbossy: BrowserConsole: local user file: C:\Users\tinipoutini\cactbot\user\raidboss.js`

确认您的用户文件是否正常加载。

文件名的打印顺序就是它们的加载顺序。

### 检查文件是否有错误

用户文件采用JavaScript编写，若代码语法本身有错误，日志窗口会输出错误，您的用户文件也会被跳过而不会被加载。 在文件加载时检查OverlayPlugin的错误日志。

此处有一个例子：

```log
[10/19/2020 6:18:27 PM] Info: raidbossy: BrowserConsole: local user file: C:\Users\tinipoutini\cactbot\user\raidboss.js (Source: file:///C:/Users/tinipoutini/cactbot/resources/user_config.ts, Line: 83)
[10/19/2020 6:18:27 PM] Info: raidbossy: BrowserConsole: *** ERROR IN USER FILE *** (Source: file:///C:/Users/tinipoutini/cactbot/resources/user_config.ts, Line: 95)
[10/19/2020 6:18:27 PM] Info: raidbossy: BrowserConsole: SyntaxError: Unexpected token :
    at loadUser (file:///C:/Users/tinipoutini/cactbot/resources/user_config.ts:92:28) (Source: file:///C:/Users/tinipoutini/cactbot/resources/user_config.ts, Line: 96)
```
