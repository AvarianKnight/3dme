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

setImmediate(() => {
	if (GetConvarInt('3dme_enableProximity', 0) && !GetConvarInt('voice_syncData', 0)) {
		console.log('[^1ERROR^7] You have `^13dme_enableProximity^7` enabled but dont have `^1voice_syncData^7` enabled in pma-voice!')
	}
})

const getDistance = (plyCoords, tgtCoords) => {
	return Math.hypot(plyCoords[0] - tgtCoords[0], plyCoords[1] - tgtCoords[1])
}

let meCooldown = {}
RegisterCommand('me', (source, args) => {
	const message = `* ${args.join(' ')} *`

	// check if the message contains any blacklisted words
	if (!blacklisted(message)) {
		// make sure they're not on cooldown (they could try spamming the command)
		if (!meCooldown[source] || meCooldown[source] < GetGameTimer()) {
			meCooldown[source] = GetConvarInt('3dme_cooldown', 1500) + GetGameTimer()

			let proximity

			// enable support for pma-voice, if the player has toggled it.
			if (GetConvarInt('3dme_enableProximity', 0) && GetConvarInt('voice_syncData', 0)) {
				proximity = Player(source).state.proximity.distance * (GetConvar('voice_useNativeAudio', 'false') === 'true' && 3 || 1)
				if (GetConvarInt('3dme_enableProximity', 0) && Math.floor(proximity) > GetConvarInt('3dme_maxRange', 25)) return emit('3dme:voiceRangeExploit', source)

			} else {
				proximity = GetConvarInt('3dme_maxRange', 25)
			}
			
			// useful for logging
			emit('3dme:sent3dme', source, message)

			const plyCoords = GetEntityCoords(GetPlayerPed(source))
			const players = getPlayers()
			players.forEach((plySrc) => {
				const tgtCoords = GetEntityCoords(GetPlayerPed(plySrc))
				if (getDistance(plyCoords, tgtCoords) < proximity) {
					emitNet('3dme:show3dme', plySrc, source, message)
				}
			})
		}
	} else {
		// useful for moderation/anticheat
		emit('3dme:blacklistedWord', source, message)
	}
})
emitNet('chat:addSuggestion', -1, `/me`, 'Sends a ranged message to the players around you.', {})

on('playerDropped', () => {
	meCooldown[source] = null
})