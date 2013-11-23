Q = Game.Q

Q.Sprite.extend "Key",
  init: (p) ->
    @_super p,
      x: 0
      y: 0
      z: 10
      sheet: "key"
      type: Game.SPRITE_PLAYER_COLLECTIBLE
      sensor: true

    # events
    @on "sensor", @, "sensor"

  sensor: (obj) ->
    if obj.isA("Player")
      obj.p.hasKey = true
      Game.infoLabel.keyFound()

      Q.AudioManager.add Game.audio.collected
      @destroy()
