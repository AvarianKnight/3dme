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

local displayCount = {}
local currentDisplaying = {}
local sleepUntil3dMe = promise.new()
CreateThread(function()
    while true do
        Citizen.Await(sleepUntil3dMe)
        local plyPed = PlayerPedId()
        local tblLength = #currentDisplaying
        local displayOccurance = {}
        for i = tblLength, 1, -1 do 
            local display = currentDisplaying[i]
            displayOccurance[display.ply] = displayOccurance[display.ply] or 0
            displayOccurance[display.ply] += 1
            local tgtPed = GetPlayerPed(display.ply)
            local hasLos = HasEntityClearLosToEntity(plyPed, tgtPed, 13)
            local tgtCoords = GetEntityCoords(tgtPed)
            if hasLos then
                Draw3DText(tgtCoords + vector3(0, 0, 0.90 + (0.10 * displayOccurance[display.ply])), display.text)
            end
            if display.displayTime < GetGameTimer() then
                table.remove(currentDisplaying, i)
            end
        end
        if tblLength == 0 then
            sleepUntil3dMe = promise.new()
        end
        Wait(0)
    end
end)

local plyNetId = GetPlayerServerId(PlayerId())
RegisterNetEvent('3dme:show3dme', function(serverId, text)
	local tgtPly = GetPlayerFromServerId(serverId)
	if tgtPly ~= 0 or plyNetId == serverId then
		if GetConvarInt('3dme_showChatMessage', 1) == 1 then
			TriggerEvent('chat:addMessage', {
				args = {text}
			})
		end
        currentDisplaying[#currentDisplaying + 1] = {
            displayTime = GetConvarInt('3dme_displayTime', 10000) + GetGameTimer(),
            ply = tgtPly,
            text = text
        }
        sleepUntil3dMe:resolve()
	end
end)
