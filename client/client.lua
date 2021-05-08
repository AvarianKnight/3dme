
local tags = {}
local plyNetId = GetPlayerServerId(PlayerId())
RegisterNetEvent('3dme:show3dme', function(serverId, text)
	local tgtPly = GetPlayerFromServerId(serverId)
	if tgtPly ~= 0 or plyNetId == serverId then
		if tags[serverId] then
			RemoveMpGamerTag(tags[serverId])
			Wait(50)
		end
		if GetConvarInt('3dme_showChatMessage', 1) == 1 then
			TriggerEvent('chat:addMessage', {
				args = {text}
			})
		end
		tags[serverId] = CreateFakeMpGamerTag(GetPlayerPed(tgtPly), text, false, false, "", false)
		Wait(GetConvarInt('3dme_displayTime', 10000))
		RemoveMpGamerTag(tags[serverId])
	end
end)