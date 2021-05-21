# cactbot (ffxiv raiding overlay)

<img align="right" src="../../screenshots/cactbot-logo-320x320.png">

[![GitHub Workflow Status (branch)](https://img.shields.io/github/workflow/status/quisquous/cactbot/Test/main)](https://github.com/quisquous/cactbot/actions?query=workflow%3ATest+branch%3Amain)
[![GitHub release (latest SemVer)](https://img.shields.io/github/v/release/quisquous/cactbot?color=brightgreen&sort=semver)](https://github.com/quisquous/cactbot/releases/latest)

🌎 [[English](../../README.md)] [[简体中文](../zh-CN/README.md)] [**한국어**]

1. [정보](#정보)
1. [설치하기](#설치하기)
1. [소스코드 빌드하기](#소스코드-빌드하기)
1. [UI 모듈 개요](#ui-모듈-개요)
1. [문제 해결](#문제-해결)
1. [Cactbot 사용자 설정](#cactbot-사용자-설정)
1. [지원 언어](#지원-언어)

## 정보

cactbot은 [파이널 판타지 14](http://www.ff14.co.kr/)를 위한 레이드 툴을 제공하는 ACT 오버레이 입니다. 이 프로젝트는
[Advanced Combat Tracker](http://advancedcombattracker.com/)의 플러그인인
[ngld의 OverlayPlugin](https://github.com/ngld/OverlayPlugin)에서 작동하는
오버레이 플러그인 입니다.

cactbot은 다음 모듈을 지원합니다:

* raidboss: 미리 설정된 타임라인과 트리거:

![타임라인 스크린샷](../../screenshots/promo_raidboss_timeline.png)
![트리거 스크린샷](../../screenshots/promo_raidboss_triggers.png)

* oopsyraidsy: 실수와 데스 리포트

![oopsy 스크린샷](../../screenshots/promo_oopsy.png)

* jobs: 간결한 게이지와 버프와 프록 트래킹

![rdm jobs 스크린샷](../../screenshots/promo_jobs.png)

* eureka: 에우레카 NM 트래커 지도

![eureka 스크린샷](../../screenshots/promo_eureka.png)

* fisher: 낚시 캐스팅 시간 트래커

![fisher 스크린샷](../../screenshots/promo_fishing.png)

* radar: 마물 방향, 첫 어글자 알림

![radar 스크린샷](../../screenshots/promo_radar.png)

* dps: DPS 미터기 추가 기능

![xephero 스크린샷](../../screenshots/xephero.png)

### 동영상 예시

* [O4S raidboss + 몽크 jobs](https://www.twitch.tv/videos/209562337)
* [O3S spellblade callouts](https://clips.twitch.tv/StrangeHungryGarageShadyLulu)

## 설치하기

**참고**: 해루봇을 사용하는 경우에는 이 문단을 읽지 말고 해루봇에서 다운로드하면 됩니다.

### 의존성 프로그램 설치

[.NET Framework](https://www.microsoft.com/net/download/framework) 4.6.1 버전 이상을 설치하세요.

반드시 파이널 판타지 14를 [DirectX 11](http://imgur.com/TjcnjmG)로 실행해야 합니다.

아직 [Advanced Combat Tracker](http://advancedcombattracker.com/)를 설치하지 않았다면, 64비트 버전을 설치하세요.

### FFXIV ACT Plugin 설치

만약 방금 ACT를 설치했다면,
Startup Wizard가 나타날 것 입니다.
Startup Wizard를 다른 방법으로 실행하려면,
`Options`를 클릭하고, `Show Startup Wizard`를 클릭하세요.

![startup wizard 스크린샷](../../screenshots/ffxiv_plugin_show_startup_wizard.png)

Startup Wizard에서,
`FFXIV Parsing Plugin`을 선택하고 `Download/Enable Plugin` 버튼을 클릭하세요.
이렇게 해서 `%APPDATA%Advanced Combat Tracker\Plugins\FFXIV_ACT_Plugin.dll`를 다운로드하고
플러그인 리스트에서 활성화시킵니다.

![startup wizard 다운로드 스크린샷](../../screenshots/ffxiv_plugin_parsing_plugin.png)

더해서, 네트워크를 통해 파싱해야 하기 때문에 ACT가 방화벽에서 차단되어 있지 않도록 하세요.
FFXIV plugin 설정에 "Include HP for Triggers" 버튼이 체크되어 있는지 확인하세요.
이 설정은 `Plugins` ->`FFXIV Settings` -> `Options`에 있습니다.

다른 FFXIV Plugin 가이드:

* [fflogs 동영상 가이드](https://www.fflogs.com/help/start/)
* [TomRichter 가이드](https://gist.github.com/TomRichter/e044a3dff5c50024cf514ffb20a201a9#installing-act--ffxiv-plugin)

### ngld OverlayPlugin 설치

이제, `Plugins` 탭을 선택하고 `Plugin Listing`을 클릭해보면,
플러그인 리스트가 다음과 같이 보여야 합니다.

![blank plugin listing 스크린샷](../../screenshots/get_plugins_blank.png)

`Get Plugins`을 클릭해서 ACT plugin 설치 도우미를 여세요.

`Overlay Plugin`을 선택하고 `Download and Enable`을 클릭하세요.

![overlay plugin 선택 스크린샷](../../screenshots/get_plugins_overlayplugin.png)

이렇게 해서 ngld OverlayPlugin을
`%APPDATA%Advanced Combat Tracker\Plugins\OverlayPlugin`에 다운로드하고
`OverlayPlugin.dll`을 플러그인 리스트에서 활성화합니다.

참고로, RainbowMage 버전이나 hibiyasleep 버전이 아니라
반드시 [ngld](https://github.com/ngld) 버전 OverlayPlugin을 사용해야 합니다.

### cactbot 설치

다시, `Plugins` 탭을 선택하고 `Plugin Listing`을 클릭한 다음,
`Get Plugins`를 클릭하세요.

`Cactbot`을 선택하고 `Download and Enable`을 클릭하세요.

![cactbot selection 스크린샷](../../screenshots/get_plugins_cactbot.png)

이렇게 해서 cactbot을
`%APPDATA%Advanced Combat Tracker\Plugins\cactbot-version\cactbot`에 다운로드하고
`CactbotOverlay.dll`을 플러그인 리스트에서 활성화합니다.

**참고**: ACT가 기대하는 압축 파일 구조와
cactbot이 zip 파일을 생성하는 구조와의 차이점 때문에
처음 cactbot을 받았던 버전을 포함한
`cactbot-0.15.2`과 같은 폴더가 생성될 것입니다.
이 폴더명은 상관이 없고 딱히 의미가 없습니다.

플러그인이 올바른 순서로 배치되었는지 확인하세요.
순서는 반드시 FFXIV Plugin가 가장 먼저, 그 다음 OverlayPlugin, 그 다음으로 cactbot 순서여야 합니다.
만약 위 절차를 그대로 따랐다면, 다음과 같이 보일겁니다.

![플러그인 순서](../../screenshots/get_plugins_complete.png)

마지막으로, ACT를 재시작하세요.

## 오버레이 모듈 추가하기

이하 내용은 raidboss 오버레이 모듈을 설치하는 예제입니다.
다른 cactbot 오버레이를 설정하는 방법 또한 모두 동일합니다.

1. ACT를 여세요.
1. cactbot 플러그인을 추가한 후에 반드시 ACT를 재시작했는지 확인하세요.
1. `Plugins` 탭 안의 `OverlayPlugin.dll` 탭으로 이동하세요.
1. "추가" 버튼을 클릭하고 리스트 안에 있는 `Cactbot Raidboss`를 선택하세요.

    ![overlay plugin 추가 스크린샷](../../screenshots/overlay_plugin_new.png)

1. 이제, 화면에 어떤 테스트 UI가 보일겁니다.
cactbot은 테스트 UI를 기본으로 제공합니다.
두꺼운 빨간색 경계선과
파란색 배경화면은 오버레이를 화면에서 크기를 조절하고 위치를 정하는데 도움을 줍니다.
이것들은 오버레이 설정 패널에서 위치 잠금을 설정하면 사라집니다.
크기를 조정하고 위치를 정하는 것이 끝나면 반드시 오버레이 위치를 잠가야 합니다.

    ![raidboss plugin 위치 잠금 해제](../../screenshots/overlay_plugin_new_raidboss_unlocked.png)

1. 이 오버레이의 이름을 짓고 싶은 대로 입력하세요. 예시) `raidbossy`
1. `OK` 버튼을 클릭해서 오버레이를 추가하세요.
이제 `Plugins` -> `OverlayPlugin.dll` 탭에 있는 오버레이 리스트에 나타날 것입니다.

1. 드래그하고 크기를 조절해서 오버레이를 원하는대로 위치시키세요.

1. `Raidboss` 오버레이의 `일반` 탭에서, `위치 잠금`와 `클릭 무시`체크 박스를 선택하세요.
테스트 타임라인 바, 디버그 텍스트, 빨간색 경계선과 옅은 파란색 배경은 오버레이가 잠기면 사라집니다.

    ![raidboss plugin 설정](../../screenshots/overlay_plugin_new_raidboss_locked.png)

1. raidboss 플러그인을 테스트하고 싶다면, 중부 라노시아 여름여울 농장으로 텔레포한 다음, `/초읽기 5`를 실행하세요.

1. 다른 cactbot 오버레이를 추가하는 것도 비슷한 과정을 거칩니다.
같은 방법을 따라하고 cactbot 프리셋만 다른 것을 선택하세요.

## 소스코드 빌드하기

먼저 상기 안내에 따라 cactbot을 설치하세요.
의존성 파일들을 설치하기 위해서는 **스크립트 방식** 또는 **수동**, 두 가지 방법이 있습니다.

### 의존성 설치: 스크립트 방식

1. `curl`이 반드시 설치되어 있어야 합니다. (의존성 파일들을 다운로드하기 위해 사용됩니다.)
1. `./util/fetch_deps.py` 스크립트를 실행하세요.
1. **빌드하는 단계**로 이동하세요.

### 의존성 설치: 수동

1. <https://github.com/EQAditu/AdvancedCombatTracker/releases/>에서 최신 Zip 파일을 다운로드 하세요.
1. `Advanced Combat Tracker.exe`를 `cactbot/plugin/ThirdParty/ACT/`에 압축 해제하세요.
1. <https://github.com/ravahn/FFXIV_ACT_Plugin/>에서 최신 SDK Zip 파일을 받으세요. (파일 이름에 SDK라는 문구가 포함되어 있는지 반드시 확인하세요)
1. `FFXIV_ACT_Plugin.dll`를 포함해서 `SDK folder`를 `cactbot/plugin/ThirdParty/FFXIV_ACT/`에 압축 해제하세요.
1. <https://github.com/ngld/OverlayPlugin/releases/>에서 최신 Zip 파일을 다운로드 하세요.
1. `OverlayPlugin.dll`를 포함해서 `libs folder`를 `cactbot/plugin/ThirdParty/OverlayPlugin/`에 압축 해제하세요.
1. **빌드하는 단계**로 이동하세요.

폴더 구조가 다음과 유사해야 합니다. (파일 목록은 추후 업데이트로 변경될 수 있음에 주의):

```plaintext
ThirdParty
|- ACT
|  |- Advanced Combat Tracker.exe
|- FFXIV_ACT
|  |- SDK
|  |  |- FFXIV_ACT_Plugin.Common.dll
|  |  |- FFXIV_ACT_Plugin.Config.dll
|  |  |- FFXIV_ACT_Plugin.LogFile.dll
|  |  |- FFXIV_ACT_Plugin.Memory.dll
|  |  |- FFXIV_ACT_Plugin.Network.dll
|  |  |- FFXIV_ACT_Plugin.Overlay.dll
|  |  |- FFXIV_ACT_Plugin.Parse.dll
|  |  |- FFXIV_ACT_Plugin.Resource.dll
|  |- FFXIV_ACT_Plugin.dll
|- OverlayPlugin
   |- libs
   |  |- HtmlRenderer.dll
   |  |- Markdig.Signed.dll
   |  |- Newtonsoft.Json.dll
   |  |- OverlayPlugin.Common.dll
   |  |- OverlayPlugin.Core.dll
   |  |- OverlayPlugin.Updater.dll
   |  |- SharpCompress.dll
   |  |- System.ValueTuple.dll
   |  |- websocket-sharp.dll
   |- OverlayPlugin.dll
```

### 플러그인을 빌드하는 단계

1. 솔루션을 Visual Studio로 여세요. (Visual Studio 2017에서 작동을 테스트하고 있습니다).
1. "Release"와 "x64" 설정으로 빌드하세요.
1. 플러그인은 **bin/x64/Release/CactbotOverlay.dll**에 빌드될 겁니다.
1. 빌드된 플러그인을 ACT에 플러그인으로 직접 추가하세요.
ACT -> Plugins -> Plugin Listing 탭에서, `Browse` 버튼을 클릭하고 이 파일이 빌드된 **bin/x64/Release/CactbotOverlay.dll**을 찾으세요.  그리고 `Add/Enable Plugin`을 클릭하세요.

### npm과 webpack

cactbot 개발자가 아니고
개인적인 목적으로 수정하는 경우에는
[Cactbot 사용자 설정](./CactbotCustomization.md) 문서를 참고해야 합니다.
cactbot 파일을 직접 수정하는 것은 권장하지 않습니다.

npm을 설치하고 Webpack을 실행하려면, 다음 과정을 따르세요:

1. [nodejs와 npm](https://nodejs.org/ko/download/)을 설치합니다.
1. cactbot 최상위 디렉토리에서 `npm install`을 실행합니다.
1. `npm run build` 또는 `npm start`를 실행합니다.

Webpack에 대해 더 자세히 알고 싶다면
[기여하기](../../CONTRIBUTING.md#validating-changes-via-webpack) 문서를 보세요.

## UI 모듈 개요

[ui/](../../ui/) 디렉토리는 cactbot의 ui 모듈을 가지고 있습니다.
만약 cactbot을 상기 설명에 따라 설치했다면,
이 디렉토리는 `%APPDATA%Advanced Combat Tracker\Plugins\cactbot-version\cactbot\ui\`에 있을 것입니다.

각각의 cactbot ui 모듈은 분리된 오버레이로 따로 추가되어야 합니다.
더욱 자세한 오버레이 설치 방법을 확인하려면 [오버레이 모듈 추가하기](#오버레이-모듈-추가하기) 문단을 확인하세요.

### [raidboss](../../ui/raidboss) 모듈

To use this module,
point cactbot at **ui/raidboss/raidboss.html** or use the `Cactbot Raidboss` preset.

이 모듈은 레이드의 타임라인과 레이드에서 놓칠만한 정보들을 알려주는 텍스트/사운드 알림을 제공합니다. 텍스트와 사운드 알람은 ACT의 "커스텀 트리거" 기능과 비슷한 방식으로, 전투 타임라인이나 게임에서 찍히는 로그 메시지를 기반으로 제공됩니다.
이 모듈은 월드 오브 워크래프트의 [BigWigs Bossmods](https://www.curseforge.com/wow/addons/big-wigs) 애드온과 비슷하게 보이고 느껴지도록 디자인 되었습니다.

[이 페이지](https://quisquous.github.io/cactbot/util/coverage/coverage.html?lang=ko)에는
현재 cactbot이 지원하는 컨텐츠 목록이 나열되어 있습니다.
지원하는 컨텐츠는 계속해서 늘리고 있습니다.
하지만 많은 수의 오래된 컨텐츠들은 아직도 지원되지 않습니다.

전투 타임라인은 [ACT Timeline](https://github.com/grindingcoil/act_timeline)플러그인에 맞게 디자인된 파일들을 사용합니다. [이 곳](http://dtguilds.enjin.com/forum/m/37032836/viewthread/26353492-act-timeline-plugin)에 규칙이 정리되어 있으며,
cactbot에서는 [약간의 확장 기능](../TimelineGuide.md)을 추가했습니다.

텍스트 알람에는 세 단계가 있으며, 중요도에 따라 다음과 같이 분류됩니다: `info`, `alert`, 그리고 `alarm`.
텍스트 메시지는 이 세 개 중 한가지이며, 더 중요한 알림일수록 크고 눈에 잘 띄는 색으로 표현됩니다. 화면에 나오는 텍스트보다는 TTS를 선호하는 경우 TTS로 나오도록 설정할 수 있습니다.

타임라인 파일과 트리거 파일은 [ui/raidboss/data](../../ui/raidboss/data)에서 찾을 수 있습니다. 타임라인 파일은 `.txt` 확장자를 가지며, 트리거 파일은 `.js` 확장자를 갖습니다.

스크린샷에서, raidboss 모듈이 하이라이트되어 있습니다. 빨간색 동그라미로 표시된 것이 타임라인이고, 노란색 동그라미로 표시된 것이 `alert` 단계의 텍스트 알람입니다.

![raidboss 스크린샷](../../screenshots/Raidboss.png)

### raidboss emulator

If you are writing triggers or timelines and want to test them, you can use the raidboss emulator:
**ui/raidboss/raidemulator.html**.

This currently can only be loaded in a browser and not as an overlay.
This will work in current version of Chrome,
and should work in other browsers as well but this is less tested.

Instructions:

1. Start ACT.
1. Make sure the WS Server is started via Plugins -> OverlayPlugin WSServer -> Stream/Local Overlay.
1. Select `Cactbot Raidboss (Combined Alerts and Timelines)` from the URL Generator list.
1. Edit the url to say `raidemulator.html` instead of `raidboss.html`.
1. Copy and paste this edited url into Chrome.
1. Drag and drop a [network log](../FAQ-Troubleshooting.md#how-to-find-a-network-log) onto the page.
1. Select the zone and encounter, and then click `Load Encounter`.

If the emulator is not working, check the console log in the inspector for errors.
No buttons will work until it is connected to ACT via websocket.

![raidboss emulator screenshot](../../screenshots/raidboss_emulator.png)

### [oopsyraidsy](../../ui/oopsyraidsy) 모듈

To use this module,
point cactbot at **ui/oopsyraidsy/oopsyraidsy.html** or use the `Cactbot OopsyRaidsy` preset.

This module provides mistake tracking and death reporting.  Oopsy raidsy is meant to reduce the time wasted understanding what went wrong on fights and how people died.  During the fight, only a limited number of mistakes are shown (to avoid clutter), but afterwards a full scrollable list is displayed.

When somebody dies, the last thing they took damage from is listed in the log.  For example, if the log specifies: ":skull: Poutine: Iron Chariot (82173/23703)" this means that Poutine most likely died to Iron Chariot, taking 82173 damage and having 23703 health at the time.  The health value itself is not perfect and may be slightly out of date by a ~second due to a hot tick or multiple simultaneous damage sources.

When mistakes are made that are avoidable, oopsy logs warning (:warning:) and failure (:no_entry_sign:) messages, explaining what went wrong.

Mistake triggers are specified for individual fights in the [ui/oopsyraidsy/data](../../ui/oopsyraidsy/data) folder.

![oopsy screenshot](../../screenshots/promo_oopsy.png)

### [jobs](../../ui/jobs) 모듈

To use this module,
point cactbot at **ui/jobs/jobs.html** or use the `Cactbot Jobs` preset.

This module provides health, mana, and tp bars, as well as icons and timer bars for big raid buffs such as
The Balance and Trick Attack. It also features a food buff warning to keep up your food buff when leveling
or raiding, and a visual pull countdown.

It has more fleshed out support for some jobs but is *strongly* a Work In Progress for others.

<details>
<summary>지원하는 잡 (클릭해서 확장)</summary>

|잡|기능|
|:-:|:-:|
|<img src="../../resources/ffxiv/jobs/pld-large.png" width="30px"/><br> 나이트|Shows current Oath amount, and atonement stacks. Also tracks Goring Blade DoT. |
|<img src="../../resources/ffxiv/jobs/war-large.png" width="30px"/><br> 전사|Shows the beast amount, and tracks the remaining Storm's Eye buff time in gcds, and shows combo time remaining.|
|<img src="../../resources/ffxiv/jobs/drk-large.png" width="30px"/><br> 암흑기사|Shows the blood amount and darkside time, BloodWeapon&Delirium&LivingShadow duration and cooldown, and shows combo time remaining.|
|<img src="../../resources/ffxiv/jobs/gnb-large.png" width="30px"/><br> 건브레이커|Shows No Mercy duration&cooldown, Bloodfest&Gnashing Fang cooldown, Cartridge amount, and shows combo time remaining.|
|<img src="../../resources/ffxiv/jobs/whm-large.png" width="30px"/><br> 백마도사|Shows Heal&Blood Lily amount, time to next Lily, DoTs remaining time, and shows Assize&Lucid Dreaming cooldown.|
|<img src="../../resources/ffxiv/jobs/sch-large.png" width="30px"/><br> 학자|Shows Aetherflow stacks, Fairy gauge amount/time remaining, DoTs remaining time, and shows Aetherflow&Lucid Dreaming cooldown.|
|<img src="../../resources/ffxiv/jobs/ast-large.png" width="30px"/><br> 점성술사|Shows Seals amount, notify who or whether to play the current card, DoTs remaining time, and shows Draw&Lucid Dreaming cooldown.|
|<img src="../../resources/ffxiv/jobs/mnk-large.png" width="30px"/><br> 몽크|Shows chakra count, <del>remaining greased lightning time</del> and form time, and tracks monk buffs and debuffs.|
|<img src="../../resources/ffxiv/jobs/drg-large.png" width="30px"/><br> 용기사|용혈과 용눈 갯수, 몸통 가르기 버프 남은 시간, 점프 쿨, 돌격하는 창과 용의 시선 지속 시간/쿨타임을 보여줍니다.|
|<img src="../../resources/ffxiv/jobs/nin-large.png" width="30px"/><br> 닌자|Shows Ninki amount, Huton remaining time, Trick Attack duration&cooldown, Bunshin&Mudras cooldown, and shows combo time remaining.|
|<img src="../../resources/ffxiv/jobs/sam-large.png" width="30px"/><br> 사무라이|Shows Kenki amount, Meditation stacks, Shifu&Jinpu&Higanbana duration, Tsubame-gaeshi cooldown, and shows combo time remaining.|
|<img src="../../resources/ffxiv/jobs/brd-large.png" width="30px"/><br> 음유시인|Shows songs playing and remaining time, Repertoire stack, Soul Voice amount, StraightShotReady track, DoT remaining time, and a bar that show when your DoTs will tick.|
|<img src="../../resources/ffxiv/jobs/mch-large.png" width="30px"/><br> 기공사|Shows Heat gauge, Battery gauge, Combo Timer, Drill/Bioblaster&Air Anchor Cooldown, Wild Fire Cooldown&Duration. When Wild Fire is active, there will be a gauge to show how many GCD you have landed.|
|<img src="../../resources/ffxiv/jobs/dnc-large.png" width="30px"/><br> 무도가|Shows Combo Timer, Feather Guage, Esprit Guage, Standard Step Cooldown, Technical Step&Flourish Cooldown & Duration.|
|<img src="../../resources/ffxiv/jobs/blm-large.png" width="30px"/><br> 흑마도사|Shows DoTs remaining time, firestarter&thundercloud proc duration, time to next xeno, MP ticker, Fire/Ice stack and umbral heart stack.|
|<img src="../../resources/ffxiv/jobs/smn-large.png" width="30px"/><br> 소환사|Shows DoTs remaining time, Energy Drain Cooldown, Trance Cooldown, Aetherflow stack, Demi-Summoning time and FurtherRuin Stack Guage.|
|<img src="../../resources/ffxiv/jobs/rdm-large.png" width="30px"/><br> 적마도사|Shows white/black mana, tracks procs for Verstone&Verfire and show cooldown of lucid dreaming.|
|<img src="../../resources/ffxiv/jobs/blu-large.png" width="30px"/><br> 청마도사|Shows cooldown of offguard&lucid dreaming, and Song Of Torment DoT remaining time.|

</details>

In this screenshot, the jobs module is highlighted for the Red Mage job. The health and mana bars, as well
as Red Mage white/black mana tracking is circled in purple, with the large raid buff tracking pointed to
beside it in orange. <del>The first step of the melee combo has been executed, which is displayed as the yellow
box above the health bar.</del> The proc tracking is circled below in green.

![jobs screenshot](../../screenshots/Jobs.png)

### [eureka](../../ui/eureka) 모듈

To use this module,
point cactbot at **ui/eureka/eureka.html** or use the `Cactbot Eureka` preset.

이 모듈은 자동으로 소환되었거나 죽은 NM을 기록하는 트래커를 제공합니다. 폭풍/밤 타이머를 보여주고, 채팅창에 올라온 에우레카 트래커 링크를 보여줍니다.
채팅창에 올라온 깃발(\<flag\>)도 지도에 표시해 주고 있습니다.

현재 트래커 정보를 직접적으로 불러오지는 못하지만,
현재 소환 불가능한 NM 목록을 복사해주는 왼쪽의 빨간색 "토벌한 마물" 버튼을 클릭하면, 게임에 입력할 수 있습니다. 예시)
`/ㄷ 토벌한 마물: 대왕 (89분) → 넘버즈 (97분) → 하즈마트 (104분) → 기수 (107분) → 카임 (119분)`

이모지가 보이지 않는다면, [이 Windows 업데이트](https://support.microsoft.com/en-us/help/2729094/an-update-for-the-segoe-ui-symbol-font-in-windows-7-and-in-windows-ser)를 설치했는지 확인하세요.

![eureka 스크린샷](../../screenshots/promo_eureka.png)

### [radar](../../ui/radar) 모듈

To use this module,
point cactbot at **ui/radar/radar.html** or use the `Cactbot Radar` preset.

이 모듈은 주위 마물(S급, A급, 등)을 알 수 있게 해줍니다.
하나를 발견하면, 대상으로의 화살표(캐릭터의 전방 기준)나 거리를 알려줍니다.

누가 마물을 처음 공격 또는 애드냈는지 알려주는 옵션도 있습니다.
또, 다른 등급끼리 개별적인 옵션을 설정할 수도 있습니다.(예를 들어, S급에는 소리 알림을 주게 하고, B급에는 조용히 하게 할 수 있습니다.) 다른 어떤 몬스터 이름이든 커스텀 트리거로 만들 수도 있습니다.

`cactbot/user/radar-example.js`에서 더 많은 옵션을 확인할 수 있습니다.

![radar 스크린샷](../../screenshots/promo_radar.png)

### [fisher](../../ui/fisher) 모듈

To use this module,
point cactbot at **ui/fisher/fisher.html** or use the `Cactbot Fisher` preset.

When you cast your line at a fishing hole, this module keeps track of when you reel in particular fish so that you know what you might be getting when you hook it.

![fishing screenshot](../../screenshots/promo_fishing.png)

Cast times are currently only logged as you fish, so there won't be any data until you've caught each fish. Green bars represent light tugs, yellow is a medium tug and red bars are legendary/heavy tugs.

[See here](https://www.youtube.com/watch?v=GHgWIA-Zhug) for examples of the different tug types.

Check [here](../FAQ-Troubleshooting.md#fisher-module) for common troubleshooting tips.

### [dps](../../ui/dps) 미터기

cactbot can be used with any dps meter overlay designed for OverlayPlugin's miniparse
addon, with the option to build out more features through cactbot's additional Javascript
APIs.  cactbot also auto-stops fights on wipes, so you can configure ACT's fight time to
infinity.

The [xephero](../../ui/dps/xephero) dps meter is based on the same dps meter built for miniparse,
with the additional ability to do per-phase dps tracking, displayed in additional columns.
In the screenshot below the phases are named B1, B2, B3.  These autogenerate from dungeon bosses, but could be used to differentiate raid fight phases.

![xephero screenshot](../../screenshots/xephero.png)

The [rdmty](../../ui/dps/rdmty) dps meter is based on the same dps meter for miniparse, and updated
for Stormblood jobs and recolored to match [fflogs](http://fflogs.com).

![rdmty screenshot](../../screenshots/rdmty.png)

### [pull counter](../../ui/pullcounter) 모듈

This small module sticks the current pull count for raiding bosses on screen.
This is primarily for folks who stream a lot and want to review video footage.
Having a number on screen makes it easy to scrub through video and find
particular pulls to review.

In most cases, you can reset the count for the current boss/zone by typing
`/echo pullcounter reset`.
You can also edit the counts directly in your
`%APPDATA%\Advanced Combat Tracker\Config\RainbowMage.OverlayPlugin.config.json`
file.

![pull counter screenshot](../../screenshots/pullcounter.png)

### [test](../../ui/test) 모듈

To use this module,
point cactbot at **ui/test/test.html** or use the `Cactbot Test` preset.

이 모듈은 cactbot 변수들을 화면에 보여주는 테스트용 모듈입니다. 게임을 플레이 하는 도중에 사용하도록 만들어지지 않았습니다.
모든 것들이 제대로 작동하고 있는지 확인하거나 오버레이 문제를 디버그할 때 유용합니다.

![테스트 스크린샷](../../screenshots/test.png)

## 문제 해결

자주 나타나는 Cactbot 문제를 포함한 일반적인 FAQ는 [여기](../FAQ-Troubleshooting.md)에서 확인할 수 있습니다.

## Cactbot 사용자 설정

대부분의 cactbot 사용자 설정은 ACT 안에 있는 설정 패널을 통해 할 수 있습니다.

![설정 패널](../../screenshots/config_panel.png)

이 화면은
Plugins -> OverlayPlugin.dll -> Cactbot으로 이동하면 확인할 수 있습니다.

특히,
만약 raidboss 알림에 TTS를 사용하고 싶다면,
"기본 알람 출력 방식"을
"TTS만" 또는 "텍스트와 TTS"으로 바꿀 수 있습니다.
이 설정을 각 트리거마다 따로 적용시킬 수도 있습니다.

또는, 어떤 이유 때문에 (???) 준비 확인 소리 알림을 원치 않을 수도 있습니다.
이 소리는 설정 패널에서 비활성화할 수 있습니다.
Raidboss -> 공용 트리거 -> General -> General Ready Check로 가서,
`기본` 대신 `비활성화`로 설정하세요.

이 옵션들은
`%APPDATA%\Advanced Combat Tracker\Config\RainbowMage.OverlayPlugin.config.json`
파일에 저장됩니다.
이 파일을 직접 수정하는 것은 권장하지 않습니다.
이 파일은 [엄격한 json](https://jsonlint.com/) 문법으로 작성되어야 하고
파일이 잘못 작성되면 ACT에서 불러오지 못할 수 있기 때문입니다.

user 파일을 사용하기 보다는
대부분의 설정들은 이 설정 패널을 통해서 하기를 권장합니다.
`cactbot/user/`에 있는 파일들은 더 강력하며
설정 패널에 있는 모든 것들을 덮어쓸 수 있습니다.
하지만, `cactbot/user/` 파일이 조용히 덮어쓰고 있고
설정 패널이 제대로 적용되지 않을 때 혼란스러울 수 있습니다.

사용자 Javascript와 css 파일에 대해 더 자세히 알고 싶다면
[이 문서](CactbotCustomization.md)를 확인하세요.

## 지원 언어

cactbot은 현재 서비스 중인 글로벌 서버 버전(영어, 독일어, 프랑스어, 일본어)
중국 서버 버전(중국어),
그리고 한국 서버 버전(한국어)에서
테스트되고 작동합니다.
일부 번역은 계속 진행 중입니다.

## 라이선스, 상표, 저작권

cactbot은 [아파치 2.0 라이선스](../../LICENSE)에 따른 오픈 소스 프로젝트입니다.

FINAL FANTASY / 파이널 판타지는 Square Enix Holdings Co., Ltd의 등록 상표입니다.

파이널 판타지 아트와 아이콘는 [FINAL FANTASY® XIV Materials Usage License](https://support.na.square-enix.com/rule.php?id=5382)에 따라 비상업적 목적으로 재사용됩니다.

다른 번들 프로젝트에 대한 자세한 내용은 [LICENSE](../../LICENSE) 파일을 참조하세요.
