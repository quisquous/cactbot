# Remote Cactbot

This is a guide for allowing others to hear or see your cactbot callouts.
This is ideal for PS4 users who can't use ACT as well as DX9 users.

The recommended method is to use port forwarding.
Port forwarding can give personalized triggers to each person connected.
This method also will allow others to view dps meters
or any other kind of overlay.

Another way is to use the [discord bot plugin](https://github.com/Makar8000/ACT-Discord-Triggers/wiki/First-Time-Setup-Guide).
The discord bot will play all of the tts from cactbot that you would hear
and play it for the rest of the party.
This is less great,
because many cactbot triggers are personalized
and it is not meant to be a generalized "raid caller"
even if it sort of works that way.
Currently, cactbot sounds do not play through the plugin.

This guide will only cover port forwarding.
(Patches welcome to explain anything specific for ACT Discord Triggers + cactbot.)

## Port Forwarding Overview

Here are the steps you need to follow as the person running ACT:

- [Setup OverlayPlugin WSServer](#setup-overlayplugin-wsserver)
- [Setup ngrok Tunneling](#setup-ngrok-tunnelling)

Once you're done,
these are the steps that players who want to connect to your ACT instance need to follow:

- [Connect to Remote ACT](#connect-to-remote-act)
- [Configure Raidboss](#configure-raidboss)
- [Configure cactbot user/](#configure-cactbot-user)

If you get lost, see the [HALP](#halp) section.

## Setup OverlayPlugin WSServer

OverlayPlugin runs a server which accepts [WebSocket](https://en.wikipedia.org/wiki/WebSocket) connections
that allows other applications to use ACT's data.
This is different from [ACTWebSocket](https://github.com/ZCube/ACTWebSocket/releases)
which is no longer maintained.
It is recommended that you use OverlayPlugin's built-in WebSocket support
instead of using ACTWebSocket.

To set this up in ACT,
go to **Plugins** -> **OverlayPlugin WSServer**.

![image](images/remote_wsserver.png)

On this page, click the "Generate SSL Certificate".
Click "Enable SSL".
Then, start the server.
Your screen should look like the above image,
with "Status: Running".
This guide assumes that you are running on port 10501.

If this is set up properly,
you can select an existing overlay
and it will give you a url to open in a browser, e.g.
<file:///C:/Users/tinipoutini/cactbot/ui/raidboss/raidboss.html?OVERLAY_WS=wss://127.0.0.1:10501/ws>

This selection box is just for convenience,
as you can open any overlay file even ones you haven't added to OverlayPlugin
by appending the query string `?OVERLAY_WS=wss://127.0.0.1:10501/ws` to the url.

For example,
you should be able to open this remote cactbot test url in a browser:
<https://quisquous.github.io/cactbot/ui/test/test.html?OVERLAY_WS=wss://127.0.0.1:10501/ws>

That file is a web page being served by github,
but the query string tells the overlay web page to connect to your ACT instance.

With ACT and FFXIV open, you should see the test data update based on your actions in game.

![image](images/remote_testui.png)

## Setup ngrok Tunnelling

Now that you've set up WebSocket support,
you are set up for other people on your local network to connect to your ACT.
Most of the time, you are going to want people outside of your local internet to connect.

One alternative to ngrok tunneling is to just set up your router to forward ports to your machine.
See: [https://www.howtogeek.com/66214/how-to-forward-ports-on-your-router/](https://www.howtogeek.com/66214/how-to-forward-ports-on-your-router/).
This is complicated and router-specific, and also gives you less control.
This guide will not cover this as an option,
but this may be more comfortable for you if you are network savvy.

### Sign Up For ngrok

First, sign up for [ngrok](https://ngrok.com/), if you don't have an account:
<https://dashboard.ngrok.com/signup>

The free account will cover everything you need to do.
The worst part about a free account is that the url will change every time you start ngrok,
and you will need to re-share this with everybody.

There are alternate services you can use to do this sort of tunneling,
but this guide will not cover them.

### Download And Install

Once you've logged in, click the "Download for Windows" button.
This will give you a zip file.
Place the `ngrok.exe` file somewhere in your path.

The rest of this section assumes you're not that comfy with a command line.

In this example, I'll unzip `ngrok.exe` directly into my `C:\Users\tinipoutini\` folder.
Putting this in your own user folder or any other place in your `PATH` is a good choice.

Now, open up `cmd.exe` by hitting Windows Key+R,
then typing cmd, and hitting enter.
This will open up a command line that looks something like this:

```Batchfile
Microsoft Windows [Version 6.1.7601]
Copyright (c) 2009 Microsoft Corporation.  All rights reserved.

C:\Users\tinipoutini>
```

The first thing to do is to set up your auth token.
The command to do this is listed in your [ngrok dashboard](https://dashboard.ngrok.com/get-started/setup).
The below is an example authtoken and will not work.
Replace it with your own.

```Batchfile
C:\Users\tinipoutini>ngrok authtoken FKdtYBn57YTfpTRcqhr80xD_bW2KscKKIMRiHvIcDWeeZpEak
Authtoken saved to configuration file: C:\Users\tinipoutini/.ngrok2/ngrok.yml
```

Next, start up the ngrok server via a command like this:

```Batchfile
ngrok http -host-header=rewrite -inspect=false --bind-tls "true" https://localhost/10501
```

This will create a window with server information.
Closing this window or hitting Ctrl+C will close the server.

```text
ngrok by @inconshreveable                                       (Ctrl+C to quit)

Session Status                online
Account                       tini poutini (Plan: Free)
Version                       2.3.35
Region                        United States (us)
Web Interface                 http://127.0.0.1:4040
Forwarding                    https://a31a5403.ngrok.io -> https://localhost:105

Connections                   ttl     opn     rt1     rt5     p50     p90
                              0       0       0.00    0.00    0.00    0.00
```

You will need to run this last step any time you want to start a server.

### Test Your Connection

Now that you've established port forwarding, test your connection.
In all of these examples in the rest of the documentation,
replace the `a31a5403.ngrok.io` with the url shown in the server window.
Going to <https://a31a5403.ngrok.io/>
(substituting your server url) should give you the following "It Works" page.
This is the same page you would see going to <https://localhost:10501>.

![image](images/remote_itworks.png)

The next thing to do is to test WebSocket forwarding.
On this step, remove the `https://` scheme from your url
and use `wss://` instead.

If everything is working, then this remote url:
<https://quisquous.github.io/cactbot/ui/test/test.html?OVERLAY_WS=wss://a31a5403.ngrok.io/ws>

...should now look the same as this local connection:
<https://quisquous.github.io/cactbot/ui/test/test.html?OVERLAY_WS=wss://127.0.0.1:10501/ws>

If this is not working or you are not seeing any information, see the [HALP](#halp) section.

## Connect to Remote ACT

Now, friends can connect to your ACT remotely.
Unfortunately, all of the overlay html pages needs to be hosted remotely.

Assume your ngrok server is `a31a5403.ngrok.io`.
There are two query string suffixes that you can append to urls:

- `?OVERLAY_WS=wss://a31a5403.ngrok.io/ws`
- `?HOST_PORT=wss://a31a5403.ngrok.io/ws`

The `OVERLAY_WS` version is for cactbot and OverlayPlugin resources (like enmity).
The `HOST_PORT` version is for older overlays that were built on top of ACT WebSocket.
You should pick one of these versions, depending on the overlay type.

### Some Examples

For all of these examples, replace the `a31a5403.ngrok.io`
with the `ngrok.io` url that you got when starting the server.

- Kagerou DPS display: <http://kagerou.hibiya.moe/overlay/?HOST_PORT=wss://a31a5403.ngrok.io/ws>

- rdmty DPS overlay: <https://quisquous.github.io/cactbot/ui/dps/rdmty/dps.html?OVERLAY_WS=wss://a31a5403.ngrok.io/ws>

- cactbot oopsy: <https://quisquous.github.io/cactbot/ui/oopsyraidsy/oopsyraidsy.html?OVERLAY_WS=wss://a31a5403.ngrok.io/ws>

### Configure Raidboss

Raidboss itself is different, because it is player-specific.

Again, assume your ngrok server is `a31a5403.ngrok.io`.
The query string you need to append is:
`?OVERLAY_WS=wss://a31a5403.ngrok.io/ws&player=FirstName%20LastName`

If your name was `FirstName LastName`,
you could use this raidboss url:
<https://quisquous.github.io/cactbot/ui/raidboss/raidboss.html?OVERLAY_WS=wss://a31a5403.ngrok.io/ws&player=FirstName%20LastName>

You can use <https://meyerweb.com/eric/tools/dencoder/>
to encode a string as a url parameter.
For example, `P'otato Chippy` becomes `P%27otato%20Chippy`.

### Configure cactbot user/

Users can have custom files in their [user directory](AdvancedCactbot.md#user-directory)
that modify the way that cactbot behaves.

cactbot loads user/ directories in the following order,
finding the first directory that works.

1) The `cactbot user directory` set in the **Plugins** -> **OverlayPlugin.dll** -> **Cactbot** config panel
1) Relative to the html file, e.g. trying to find `cactbot/user/` adjacent to `cactbot/ui/raidboss/raidboss.html`.
1) Relative to the plugin, e.g. trying to find `cactbot/user/` adjacent to `cactbot/CactbotOverlay.dll`.

If the remote player wants their own customization,
they should set the `cactbot user directory` setting.

If the remote player wants to share the customization of the player hosting ACT,
the easiest thing to do is to share that user/ directory
and have each remote player copy that locally and set it as their `cactbot user directory`.
Alternatively, you can have the host player put all of their customization relative to their `CactbotOverlay.dll`.

If you have custom triggers with custom sounds,
those custom sounds will need to have a remotely accessible url.

## HALP

If you get stuck or confused on any of these steps,
the best place to get help is the [FFXIV ACT discord](https://discord.gg/ahFKcmx) #troubleshooting channel.
There is no cactbot discord; you should go here.

Port forwarding is not really part of cactbot,
so please only file a cactbot github issue if your raidboss party override doesn't work.

### Troubleshooting Hints

If you are looking at url in the browser like
<https://quisquous.github.io/cactbot/ui/test/test.html?OVERLAY_WS=wss://127.0.0.1:10501/ws>
and you don't see any data, even though you are in game,
ACT is running,
and the ACT WSServer is running, then you should look at devtools.

In Chrome, right click on the page and go to `Inspect` (or hit Ctrl+Shift+I).
Then click on `Console` to show the console output:

![image](images/remote_devtools.png)

This will give you more information to help diagnose your problem.
