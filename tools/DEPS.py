# If you're familiar with Chromium or other Google projects:
#   Sorry, this file actually has nothing to do with gclient.
#   I just borrowed the basic concept and naming scheme.

deps = {
    'ACT': {
        'url': 'https://github.com/EQAditu/AdvancedCombatTracker/releases/download/3.4.5.265/ACTv3.zip',
        'dest': 'plugin/ThirdParty/ACT',
        'strip': 0,
        'hash': ['sha256', 'adf13a38d0938ce90f8e674f8365b227d933b91636ddf72b26c85702f6e3b808'],
    },
    'OverlayPlugin': {
        'url': 'https://github.com/ngld/OverlayPlugin/releases/download/v0.13.2/OverlayPlugin-0.13.2.zip',
        'dest': 'plugin/ThirdParty/OverlayPlugin',
        'strip': 1,
        'hash': ['sha256', '2447517c11c54ea4fc5f92ca74ce5ff2ff6b2527d6137e37780e9d5114cfd540'],
    },
}
