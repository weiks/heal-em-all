Q = Game.Q

Q.UI.PauseButton = Q.UI.Button.extend "UI.PauseButton",
  init: (p) ->
    @_super p,
      x: 0
      y: 0
      w: 120
      h: 60
      type: Q.SPRITE_UI | Q.SPRITE_DEFAULT
      fill: "#CCCCCC"
      label: "Pause"
      isPaused: false
      keyActionName: "pause" # button that will trigger click event

    @pausedScreen = new Q.UI.Container
      x: Q.width/2,
      y: Q.height/2,
      w: Q.width,
      h: Q.height
      fill: "rgba(0,0,0,0.5)"

    @on 'click', =>
      if !@isPaused
        Q.stage().pause()
        Q.AudioManager.stopAll()
        @p.label = "Unpause"
        @isPaused = true

        @stage.insert @pausedScreen

      else
        Q.stage().unpause()
        if !Game.isMuted
          Q.AudioManager.playAll()

        @p.label = "Pause"
        @isPaused = false

        @stage.remove @pausedScreen

