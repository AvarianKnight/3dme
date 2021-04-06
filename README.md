# 3dme
3dme made for OneSync with pma-voice proximity support

## Support

Please report any issues you have in the GitHub [Issues](https://github.com/AvarianKnight/3dme/issues)

# Compatibility Notice:

This script is only compatible with OneSync Infinity

# Config

All of the config is done via ConVars in order to streamline the process.

The ints are used like a boolean to 0 would be false, 1 true.

| ConVar                  | Default | Description                                | Parameter(s) |
|-------------------------|---------|--------------------------------------------|--------------|
| 3dme_cooldown           | 1500    | The default /me cooldown                   | int          |
| 3dme_enableProximity    | 0       | Enables proximity support for pma-voice    | int          |
| 3dme_maxRange           | 25      | The max range for /me to travel            | int          |
| 3dme_showChatMessage    | 1       | Enabled showing /me into chat              | int          |


#### Server

##### Export Adders

| Export               | Description                            | Parameter(s) |
|----------------------|----------------------------------------|--------------|
| addBlockedWord       | Adds blocked words to the filter       | array        |
| removeBlockedWord    | Removes a blocked word from the filter | string       |

##### Emitters

| Emitter                 | Description                                        | Arguments(s) |
|-------------------------|----------------------------------------------------|--------------|
| 3dme:voiceRangeExploit  | Sent when someone tried using range above maxRange | source       |
| 3dme:sent3dme           | Emits to the server the player & message, useful for logging | source, message |
| 3dme:blacklistedWord    | Emits when someone uses a blacklisted word         | source, message |

