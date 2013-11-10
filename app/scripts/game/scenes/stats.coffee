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

  # game info/progress label
  Game.infoLabel = new Q.UI.InfoLabel
  container.insert Game.infoLabel


  # pause button
  button = container.insert new Q.UI.Button
    x: container.p.w/2 - 40
    y: 0
    w: 80
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

  button.on 'click', ->
    if !isPaused
      Q.stage().pause()
      button.p.label = "Unpause"
      isPaused = true

      stage.insert pausedScreen

    else
      Q.stage().unpause()
      button.p.label = "Pause"
      isPaused = false

      stage.remove pausedScreen
