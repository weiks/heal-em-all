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
  pauseButton = container.insert new Q.UI.PauseButton
  pauseButton.p.x = container.p.w/2 - 80

  # audio button
  audioButton = container.insert new Q.UI.AudioButton
  audioButton.p.x = container.p.w/2 - 80
