Q = Game.Q

Q.scene "stats", (stage) ->
  container = stage.insert new Q.UI.Container
    x: Q.width/2,
    y: 20,
    w: Q.width,
    h: 40
    # fill: "rgba(0,0,0,0.5)"
    radius: 0


  # lifes indicator
  lifesLabel = container.insert new Q.UI.LivesCounter()
  lifesLabel.p.x = -container.p.w/2 + lifesLabel.p.w/2 + 20 # margin

  # enemies counter
  enemiesCounterLabel = container.insert new Q.UI.EnemiesCounter()
  enemiesCounterLabel.p.x = -container.p.w/2 + enemiesCounterLabel.p.w/2 + 160 # margin

  # enemies counter
  bulletsCounterLabel = container.insert new Q.UI.BulletsCounter()
  bulletsCounterLabel.p.x = -container.p.w/2 + bulletsCounterLabel.p.w/2 + 160 # margin

  # game info/progress label
  Game.infoLabel = new Q.UI.InfoLabel
  container.insert Game.infoLabel


  # pause button
  pauseButton = container.insert new Q.UI.Button
    x: container.p.w/2 - 80
    y: 0
    w: 120
    h: 60
    fill: "#CCCCCC"
    label: "Pause"
    keyActionName: "pause" # button that will trigger click event

  isPaused = false
  pausedScreen = new Q.UI.Container
    x: Q.width/2,
    y: Q.height/2,
    w: Q.width,
    h: Q.height
    fill: "rgba(0,0,0,0.5)"

  pauseButton.on 'click', ->
    if !isPaused
      Q.stage().pause()
      Q.AudioManager.stopAll()
      pauseButton.p.label = "Unpause"
      isPaused = true

      stage.insert pausedScreen

    else
      Q.stage().unpause()
      if !isMuted
        Q.AudioManager.playAll()

      pauseButton.p.label = "Pause"
      isPaused = false

      stage.remove pausedScreen

  audioButton = container.insert new Q.UI.Button
    x: container.p.w/2 - 80
    y: 80
    w: 120
    h: 60
    fill: "#CCCCCC"
    label: "Sound on"
    keyActionName: "mute" # button that will trigger click event

  isMuted = false

  audioButton.on 'click', ->
    if !isMuted
      Q.AudioManager.stopAll()
      audioButton.p.label = "Sound off"
      isMuted = true

    else
      Q.AudioManager.playAll()
      audioButton.p.label = "Sound on"
      isMuted = false


