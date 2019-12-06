# Fisher Module Troubleshooting

## I can't see the overlay

The overlay is hidden by default until you cast your line at a fishing hole. 

## It doesn't show up when fishing

If the overlay doesn't register your casting/catches/reeling in your rod there are a few options you need to check:
- **Ingame chat log filter**
![image](https://user-images.githubusercontent.com/12807478/68880497-47da3300-0703-11ea-9cf2-2d785656bb04.png)
You need to have at least one chat log set to show `Own Gathering Messages` You can find this option in 
`Character Configuration` -> `Log Window Settings` -> `Log Filters 1/2/3/4` -> `Announcements`

- **ACT FFXIV Plugin options**
![image](https://user-images.githubusercontent.com/12807478/68882607-693d1e00-0707-11ea-96d1-ede45644842a.png)
You must have the `Hide Chat Log (for privacy)` option disabled.

- **fisher.js language setting**
If your game has a text language setting other than english you will need to open /ui/fisher/fisher.js and change the language option to your chosen language:
- `en` - English
- `de` - German
- `fr` - French
- `jp` - Japanese
- `cn` - Chinese

Korean is not supported at this time.
You will need to restart ACT for this setting to take effect.

## Other issues:
Open an issue [here](https://github.com/quisquous/cactbot/issues) with the fishing tag and we will try and help you out.


Last updated: 06/12/2019