/*
 * wordfilter
 * https://github.com/dariusk/wordfilter
 *
 * Copyright (c) 2013 Darius Kazemi
 * Licensed under the MIT license.
 */

let regex;
let blacklist = [];

const rebuild = () => {
  regex = new RegExp(blacklist.join('|'), 'i');
}

blacklist = JSON.parse(LoadResourceFile(GetCurrentResourceName(), 'server/filterwords.json'));
rebuild();
const blacklisted = (string) => {
	return !!blacklist.length && regex.test(string);
}
const addWords = (array) => {
	blacklist = blacklist.concat(array);
	rebuild();
}
exports('addBlockedWord', addWords)
const removeWord = (word) => {
	const index = blacklist.indexOf(word);
	if (index > -1) {
		blacklist.splice(index, 1);
		rebuild();
	}
}
exports('removeBlockedWord', removeWord)
const clearList = () => {
	blacklist = [];
	rebuild();
}

let meCooldown = {}
RegisterCommand('me', (source, args) => {
	const message = `* ${args.join(' ')} *`

	// check if the message contains any blacklisted words
	if (!blacklisted(message)) {
		// make sure they're not on cooldown (they could try spamming the command)
		if (!meCooldown[source] || meCooldown[source] < GetGameTimer()) {
			meCooldown[source] = GetConvarInt('3dme_cooldown', 1500) + GetGameTimer()
			// useful for logging
			emit('3dme:sent3dme', source, message)

			// enable support for pma-voice, if the player has toggled it.
			const proximity = Player(source).state.proximity * (GetConvar('voice_useNativeAudio', 'false') === 'true' && 3 || 1)
			if (GetConvarInt('3dme_enableProximity', 0) && Math.floor(proximity) > GetConvarInt('3dme_maxRange', 25)) return emit('3dme:voiceRangeExploit', source)

			const plyCoords = GetEntityCoords(GetPlayerPed(source))
			const players = getPlayers()
			players.forEach((plySrc) => {
				const tgtCoords = GetEntityCoords(GetPlayerPed(plySrc))
				if (Math.hypot(plyCoords[0] - tgtCoords[0], plyCoords[1] - plyCoords[1]) < (GetConvarInt('3dme_enableProximity', 0) && proximity || GetConvarInt('3dme_maxRange', 25))) {
					emitNet('3dme:show3dme', plySrc, source, message)
				}
			})
		}
	} else {
		// useful for moderation/anticheat
		emit('3dme:blacklistedWord', source, message)
	}
})