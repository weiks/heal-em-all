Q = Game.Q

Q.Sprite.extend "Door",
  init: (p) ->
    @_super p,
      x: 0
      y: 0
      z: 10
      sheet: "door_closed"
      opened: false
      type: Game.SPRITE_PLAYER_COLLECTIBLE
      sensor: true

    # events
    @on "sensor", @, "sensor"

  sensor: (obj) ->
    if obj.isA("Player")
      if (Q.state.get "hasKey") && !@p.opened
        # remove the key and open the door
        Q.state.set "hasKey", false
        @p.opened = true
        @p.sheet = "door_open"
        Game.infoLabel.doorOpen()

      else if !@p.opened
        Game.infoLabel.keyNeeded()

      else if @p.opened and (Q.inputs['up'] or Q.inputs['action'])
        # enter the door
        Q.stageScene "end", 2,
          label: "You Won!"
        obj.destroy()

