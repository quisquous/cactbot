# How to run python utils

Download and install [python](https://www.python.org/).

Download [SaintCoinach.Cmd-master-\*-\*.zip](https://github.com/ufx/SaintCoinach/releases) and extract on C Drive root or D Drive root.

Saint coinach is only accepted in 2 directories by default, 'C:\\SaintCoinach\\' and 'D:\\SaintCoinach\\'  
These MUST include the one of those must include the SaintCoinach.Cmd.exe (with all other needed files for it to run).  
If you use a different path, you can add it to the coinach.py _DEFAULT_COINACH_PATHS variable

## Troubleshooting with SaintCoinach

### SaintCoinach FFXIV client version mismatch

When you run SaintCoinach manually, does it shows you need to update? This means that definitions are not updated to the latest patch. For minor patches, SaintCoinach does not need to update definitions, so you need to do is just change the version data to latest version.

In the SainCoinach dir open the \Definitions\game.ver file and change the version number to latest version which showed when you launch SaintCoinach manually.
