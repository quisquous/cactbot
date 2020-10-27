# Cactbot自定义教程

🌎 [[English](../CactbotCustomization.md)] [**简体中文**] [[한국어](../ko-KR/CactbotCustomization.md)]

- [使用cactbot配置界面](#使用cactbot配置界面)
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

自定义cactbot时，推荐使用cactbot的配置界面进行操作。 该界面位于 ACT -> Plugins -> OverlayPlugin.dll -> Cactbot。

它可以提供如下功能：

- 设置触发器输出TTS
- 禁用触发器
- 改变cactbot语言
- 音量设置
- 隐藏奶酪图标

您可能无法通过cactbot配置界面以配置所有您想要的更改。 但是它是最容易的方法，适合作为您定制化的第一步。 以后此界面会添加更多的选项。

此处的选项会存储于 `%APPDATA%\Advanced Combat Tracker\Config\RainbowMage.OverlayPlugin.config.json` 文件中。 但您并不需要也不应当直接修改该文件。

## 用户文件夹概览

若cactbot配置界面不存在您所需的选项，您可能需要考虑以用户文件覆盖的方式进行自定义。 您需要编写JavaScript代码和CSS样式，这意味着您可能需要掌握一些编程知识。

Cactbot的设计哲学要求任何用户的自定义配置应当存放于用户文件夹的文件中。 同时这也能防止您所做的更改在今后cactbot的更新中被覆盖失效。 不仅如此，以后您将无法通过直接修改cactbot的文件应用您的更改，除非您了解如何构建您自己的项目。

所有的cactbot模块都会从 [user/](../../user/) 文件夹加载用户设置。 `raidboss` 模块会加载 `user/raidboss.js` 与 `user/raidboss.css`。 `oopsyraidsy` 模块会加载 `user/oopsyraidsy.js` 与 `user/oopsyraidsy.css`。 以此类推，每一个模块都支持此方式。 这些文件在cactbot自身加载完成后被加载，并可以覆盖对应的模块的设置。

`user/` 文件夹中包含了一部分示例配置文件，您可以对其重命名并直接使用。 如 [user/raidboss-example.js](../../user/raidboss-example.js) 文件 可被重命名为 `user/raidboss.js`，对其所做的更改可应用于 `raidboss` 模块。

在修改了这些文件之后，单击ACT中OverlayPlugin插件设置中的“重载悬浮窗”按钮，即可应用更改。

## 设置您自己的用户文件夹

您可以通过cactbot配置界面设置此用户文件夹： ACT -> Plugins -> OverlayPlugin.dll -> Cactbot -> cactbot用户文件夹 单击 `选择文件夹` 按钮，选择磁盘上的一个文件夹。 单击 `选择文件夹` 按钮，选择磁盘上的一个文件夹。

若您没有选择，cactbot会尝试选择安装目录下的默认文件夹。

建议您选择cactbot安装目录下的 `cactbot/user` 文件夹。 该文件夹通常为位于 `%APPDATA%\Advanced Combat Tracker\Plugins\cactbot-version\cactbot\user`。 有部分示例配置文件位于 [此文件夹](../../user) 下。

## 样式自定义

您可以通过修改 `user/<name>.css` 等文件，对UI模块的位置、尺寸、颜色等进行自定义。 可用的选择器可以通过阅览 `ui/<name>/<name>.css` 文件找到。

如您在 [ui/raidboss/raidboss.css](../../ui/raidboss/raidboss.css) 中 可发现诸如 `#popup-text-container` 与 `#timeline-container` 等选择器， 则您可以在 `user/raidboss.css` 中对其位置进行自定义。 您可以在 `user/raidboss.css` 中添加更多的样式。

同样地，您可以通过修改 `.info-text` 类，添加新的CSS规则，以对信息文字的尺寸和颜色进行自定义。

```css
.info-text {
  font-size: 200%;
  color: rgb(50, 100, 50);
}
```

简单地说，您可以认为cactbot会将用户文件中的CSS规则添加至内置CSS规则的末尾。 也就是说，您需要注意 [CSS优先级规则](https://developer.mozilla.org/en-US/docs/Web/CSS/Specificity)， 例如添加 `!important` 让您的规则可以强制覆盖。 另一方面，您可能需要重置某些属性为默认的 `auto` 值。

我们推荐使用 [Chrome DevTools](https://developers.google.com/web/tools/chrome-devtools) 以调试CSS问题。 您可以通过 ACT -> Plugins -> OverlayPlugin.dll -> 您的悬浮窗名字 -> 启动Debug工具 以开启DevTools。

**注意**：某些组件的自定义较为困难，甚至无法进行自定义，如时间轴的进度条等。 原因是，这些组件属于自定义HTML元素，且没有导出所有的可配置项。 如果您有特别的需求，但是您不知道如何修改此进度条，您可以提出一个 [github issue](https://github.com/quisquous/cactbot/issues/new/choose)。

**警告**：cactbot不保证CSS的向后兼容性。 在以后的更改中，cactbot可能会重新组织网页结构，改变元素名称和类名称，甚至完全重构所有样式。 因此，您需知晓您的自定义CSS有在将来出现问题的风险。

## Raidboss触发器自定义

您可以通过 `cactbot/user/raidboss.js` 文件自定义触发器行为。 您可以修改输出文本、适用职业、界面滞留时间等等。

在 `cactbot/user/raidboss.js` 文件中， `Options.Triggers` 是一个存放了触发器集合的列表。 您可以通过此变量添加新触发器，或修改已有的触发器。 若用户文件中存在与现有触发器 (cactbot官方提供的) 相同id的触发器，则会将后者其覆盖。

在您修改触发器前，我们推荐阅读 [触发器指南](RaidbossGuide.md) 以了解各触发器的诸多字段的含义。

通常情况下，在 `cactbot/user/raidboss.js` 中添加的代码应当形如：

```javascript
Options.Triggers.push({
  // 在文件开头定义ZoneId，
  // 例如 ZoneId.MatchAll (指定所有区域) 或ZoneId.TheBozjanSouthernFront 等
  zoneId: ZoneId.PutTheZoneFromTheTopOfTheFileHere,
  triggers: [
    {
      // 这里定义的是触发器(trigger)对象。
  zoneId: ZoneId.PutTheZoneFromTheTopOfTheFileHere,
  triggers: [
    {
      // 这里定义的是触发器(trigger)对象。
      // 例如 id, netRegex或infoText等
    },
  ],
});
```

最简单的方式是直接复制对应的触发器代码并粘贴到此文件再进行修改。 您可以修改 `zoneId` 一行为您想要触发器响应的区域id，这一行通常位于cactbot触发器文件的顶部。 [该文件](../../resources/zone_id.js) 列出了所有可用的区域id。 若您定义了错误的id，OverlayPlugin的日志窗口将会输出警告信息。 然后复制触发器文本并粘贴至此。 按您的喜好进行修改。 对您想修改的所有触发器均进行此步骤。 重载raidboss悬浮窗以应用更改。

**注意**：此方式会将原触发器完全移除，因此请在修改时不要删除任何逻辑。 此外，触发器均采用JavaScript编写，因此必须采用标准JavaScript语法。 若您不是程序员，您需要格外注意编辑方法。

### 例1：改变输出文本

假定您正在攻略巴哈姆特绝境战(UCOB)， 您的固定队采用的不是cactbot默认的火1集合吃的打法， 而是先单吃火1。

其中一种调整方式是编辑触发器的输出。 您可以在 [ui/raidboss/data/04-sb/ultimate/unending_coil_ultimate.js](https://github.com/quisquous/cactbot/blob/cce8bc6b10d2210fa512bd1c8edd39c260cc3df8/ui/raidboss/data/04-sb/ultimate/unending_coil_ultimate.js#L715-L743) 中找到原本的 fireball #1 触发器。

您需要将以下的代码粘贴至您的 `cactbot/user/raidboss.js` 中。

```javascript
Options.Triggers.push({
  zoneId: ZoneId.TheUnendingCoilOfBahamutUltimate,
  triggers: [
    {
      id: 'UCU Nael Fireball 1',
      netRegex: NetRegexes.ability({ source: 'Ragnarok', id: '26B8', capture: false }),
      netRegexDe: NetRegexes.ability({ source: 'Ragnarök', id: '26B8', capture: false }),
      netRegexFr: NetRegexes.ability({ source: 'Ragnarok', id: '26B8', capture: false }),
      netRegexJa: NetRegexes.ability({ source: 'ラグナロク', id: '26B8', capture: false }),
      netRegexCn: NetRegexes.ability({ source: '诸神黄昏', id: '26B8', capture: false }),
      netRegexKo: NetRegexes.ability({ source: '라그나로크', id: '26B8', capture: false }),
      delaySeconds: 35,
      suppressSeconds: 99999,
      // infoText 是绿色的文字。
      infoText: {
        en: 'Fire OUT',
      },
      run: function(data) {
        data.naelFireballCount = 1;
      },
    },
  ],
});
```

此处还修改了 `tts` 部分，并且移除了英语以外的其他语言。

### 例2：使挑衅提示适用于全职业

目前，只有团队成员的挑衅会触发提示，并且不是所有职业都能收到提示。 该例子展示了如何使其适用于所有职业。 该挑衅触发器可以在 [ui/raidboss/data/00-misc/general.js](https://github.com/quisquous/cactbot/blob/cce8bc6b10d2210fa512bd1c8edd39c260cc3df8/ui/raidboss/data/00-misc/general.js#L11-L30) 中找到。

我们需要修改 `condition` 函数(function)。 由于此处的id与内置的 `General Provoke` 触发器一致，因此会覆盖同名的内置触发器。

您需要将以下的代码粘贴至您的 `cactbot/user/raidboss.js` 中。

```javascript
Options.Triggers.push([{
  zoneId: ZoneId.MatchAll,
  triggers: [
    {
      id: 'General Provoke',
      netRegex: NetRegexes.ability({ id: '1D6D' }),
      condition: function(data, matches) {
        // 我希望看到所有的挑衅提示，即便他们不在我的队伍中，
        // 即便我不是坦克。
        return true;
      },
      infoText: function(data, matches) {
        let name = data.ShortName(matches.source);
        return {
          en: 'Provoke: ' + name,
          de: 'Herausforderung: ' + name,
          fr: 'Provocation: ' + name,
          ja: '挑発: ' + name,
          cn: '挑衅: ' + name,
          ko: '도발: ' + name,
        };
      },
    },
  ],
]);
```

当然，您也可以直接删除整个 `condition` 函数， 这是因为没有condition的触发器在匹配到正则时永远会运行

### 例3：添加自定义触发器

您也可以添加您的自定义触发器。

这是一个示例触发器，当您中了“Forked Lightning”效果时，会在1秒后显示“Get out!!!”。

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
        alertText: 'Get out!!!',
      },

      // 您的其他触发器……
    ],
  },

  // 其他区域的触发器集合……
]);
```

我们推荐阅读 [触发器指南](RaidbossGuide.md) 以了解如何撰写cactbot的触发器， 当然您也可以直接看 [ui/raidboss/data](../../ui/raidboss/data) 中现有的触发器代码。

## Raidboss时间轴自定义

自定义时间轴与 [自定义触发器](#overriding-raidboss-triggers) 差不多。

自定义时间轴的步骤如下：

1) 复制原有的时间轴文本文件内容至您的用户文件夹

    例如，您可以复制
    [ui/raidboss/data/05-shb/ultimate/the_epic_of_alexander.txt](../ui/raidboss/data/05-shb/ultimate/the_epic_of_alexander.txt)
    至 `user/the_epic_of_alexander.txt`。

1) 在 user/raidboss.js 中添加代码

    如同我们添加触发器一样，您依旧需要定义 `zoneId`，
    以及 `overrideTimelineFile: true`，
    `timelineFile` 的值必须是文本文件的名称。

    ```javascript
    Options.Triggers.push({
      zoneId: ZoneId.TheEpicOfAlexanderUltimate,
      overrideTimelineFile: true,
      timelineFile: 'the_epic_of_alexander.txt',
    });
    ```

    此时，我们假设您已经做完了第一步，并且该文本文件的名称为 `user/the_epic_of_alexander.txt` 。

    设置 `overrideTimelineFile: true`，
    告诉cactbot将内置的时间轴完全替换为您添加的文件。

1) 按您的喜好编辑您自己的时间轴文件

    阅读 [时间轴指南](TimelineGuide.md) 学习更多关于时间轴的知识。

**注意**：编辑时间轴文件有一定的风险， 这是因为部分触发器依赖于时间轴的特定文字。 例如在绝亚历山大中，`Fluid Swing` 与 `Propeller Wind` 都有对应的时间轴触发器。 如果这些文字被替换或移除，时间轴触发器也同样会失效。

## 行为自定义

这一文段将讨论自定义cactbot的其他方式。 Cactbot中有一些不在配置界面显示，也不可在触发器中访问的变量。

每个cactbot模块都有一个名为 `Options` 的变量，它包含了若干控制选项。 每一个 `ui/<name>/<name>.js` 文件的顶部都会修改并注释 `Options` 的各个变量。

例如在 [ui/raidboss/raidboss.js](../../ui/raidboss/raidboss.js) 文件中， 您可以通过 `PlayerNicks` 选项定义玩家的昵称。

```javascript
Options.PlayerNicks = {
  // 'Firstname Lastname': 'Nickname',
  'Banana Nana', 'Nana',
  'The Great\'one', 'Joe', // The Great'one => Joe 这里需要一个反斜杠转义单引号
  'Viewing Cutscene': 'Cut',
  // 等等
};
```

**警告**：用户文件夹中的文件会静默覆盖cactbot配置窗口的同名选项。 该行为可能会造成一些困惑，因此您应当直接通过配置窗口设置这些变量， 仅当配置窗口不提供设置方法时采用此方式覆盖默认行为。

## 用户文件的调试

### 检查OverlayPlugin的错误日志

您可以在 ACT -> Plugins -> OverlayPlugin.dll 找到OverlayPlugin的日志窗口， 位于该窗口的底部，为一自动滚动的文本窗口。

当运行错误时，错误信息会显示在此处。

### 检查文件是否加载

首先，开启raidboss模块的调试模式。 打开cactbot配置窗口，启用 `显示开发者选项` ，然后重新加载悬浮窗。 然后，勾选raidboss模块下的 `启用调试模式`，再次重载悬浮窗。

当raidboss模块的调试模式启用时，OverlayPlugin的日志窗口中会打印更多信息。 每次本地的用户文件加载时都会输出类似信息： `[10/19/2020 6:18:27 PM] Info: raidbossy: BrowserConsole: local user file: C:\Users\tinipoutini\cactbot\user\raidboss.js`

确认您的用户文件是否正常加载。

### 检查文件是否有错误

用户文件采用JavaScript编写，若代码语法本身有错误，日志窗口会输出错误，您的用户文件也会被跳过而不会被加载。 在文件加载时检查OverlayPlugin的错误日志。

此处有一个例子：

```log
[10/19/2020 6:18:27 PM] Info: raidbossy: BrowserConsole: local user file: C:\Users\tinipoutini\cactbot\user\raidboss.js (Source: file:///C:/Users/tinipoutini/cactbot/resources/user_config.js, Line: 83)
[10/19/2020 6:18:27 PM] Info: raidbossy: BrowserConsole: *** ERROR IN USER FILE *** (Source: file:///C:/Users/tinipoutini/cactbot/resources/user_config.js, Line: 95)
[10/19/2020 6:18:27 PM] Info: raidbossy: BrowserConsole: SyntaxError: Unexpected token :
    at loadUser (file:///C:/Users/tinipoutini/cactbot/resources/user_config.js:92:28) (Source: file:///C:/Users/tinipoutini/cactbot/resources/user_config.js, Line: 96)
```
