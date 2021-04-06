function Draw3DText(coords, str)
    local onScreen, worldX, worldY = World3dToScreen2d(coords.x, coords.y, coords.z)
	local camCoords = GetGameplayCamCoord()
	local scale = 200 / (GetGameplayCamFov() * #(camCoords - coords))
    if onScreen then
        SetTextScale(1.0, 0.5 * scale)
        SetTextFont(4)
        SetTextColour(255, 255, 255, 255)
        SetTextEdge(2, 0, 0, 0, 150)
		SetTextProportional(1)
		SetTextOutline()
		SetTextCentre(1)
        SetTextEntry("STRING")
        AddTextComponentString(str)
        DrawText(worldX, worldY)
    end
end

local plyNetId = GetPlayerServerId(PlayerId())
RegisterNetEvent('3dme:show3dme', function(serverId, text)
	local tgtPly = GetPlayerFromServerId(serverId)
	if tgtPly ~= 0 or plyNetId == serverId then
		if GetConvarInt('3dme_showChatMessage', 1) == 1 then
			TriggerEvent('chat:addMessage', {
				args = {text}
			})
		end

		CreateThread(function()
			local displayTime = GetConvarInt('3dme_displayTime', 10000) + GetGameTimer()
			while displayTime > GetGameTimer() do
				local tgtPed = GetPlayerPed(tgtPly)
				local tgtCoords = GetEntityCoords(tgtPed)
				Draw3DText(tgtCoords + vector3(0, 0, 1.0), text)
				Wait(0)
			end
		end)
	end
end)