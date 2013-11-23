Q = Game.Q

Q.UI.AudioButton = Q.UI.Button.extend "UI.AudioButton",
  init: (p) ->
    @_super p,
      x: 0
      y: 80
      w: 120
      h: 60
      type: Q.SPRITE_UI | Q.SPRITE_DEFAULT
      fill: "#CCCCCC"
      label: "Sound on"
      keyActionName: "mute" # button that will trigger click event

    Game.isMuted = false

    @on 'click', =>
      if !Game.isMuted
        Q.AudioManager.mute()
        @p.label = "Sound off"
        Game.isMuted = true

      else
        Q.AudioManager.unmute()
        @p.label = "Sound on"
        Game.isMuted = false

