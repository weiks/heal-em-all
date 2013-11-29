Q = Game.Q

Q.scene "levelSummary", (stage) ->

  # some math
  marginY = Q.height * 0.25

  # audio
  Q.AudioManager.stopAll()

  # add title
  stage.insert new Q.UI.Text
    x: Q.width/2
    y: marginY/2
    label: "Well done!"
    color: "#f2da38"
    family: "Jolly Lodger"
    size: 100

  # add level summary
  container = stage.insert new Q.UI.Container
    x: Q.width/2
    y: Q.height/2

  lineHeight = 50

  if stage.options.health
    container.insert new Q.UI.Text
      x: 0
      y: -lineHeight * 2
      label: "Health collected: " + stage.options.health.collected + "/" + stage.options.health.available
      color: "#c4da4a"
      family: "Boogaloo"
      size: 36

  if stage.options.zombies
    container.insert new Q.UI.Text
      x: 0
      y: -lineHeight
      label: "Zombies healed: " + stage.options.zombies.healed + "/" + stage.options.zombies.available
      color: "#c4da4a"
      family: "Boogaloo"
      size: 36

  if stage.options.bullets
    container.insert new Q.UI.Text
      x: 0
      y: 0
      label: "Bullets waisted: " + stage.options.bullets.waisted + "/" + stage.options.bullets.available
      color: "#c4da4a"
      family: "Boogaloo"
      size: 36

  if stage.options.zombieModeFound?
    container.insert new Q.UI.Text
      x: 0
      y: lineHeight
      label: "Zombie Mode: " + if stage.options.zombieModeFound then "done" else "not found"
      color: "#c4da4a"
      family: "Boogaloo"
      size: 36


  # button next
  buttonNext = stage.insert new Q.UI.Button
    y: Q.height - marginY
    w: Q.width/4
    h: 70
    fill: "#c4da4a"
    radius: 10
    fontColor: "#353b47"
    font: "400 58px Jolly Lodger"
    label: "Play next"
    keyActionName: "confirm"
    type: Q.SPRITE_UI | Q.SPRITE_DEFAULT

  buttonNext.p.x = Q.width/2 + buttonNext.p.w/2 + 40

  buttonNext.on "click", (e) ->
    Game.stageLevel(Q.state.get("currentLevel") + 1)

  # button back
  buttonBack = stage.insert new Q.UI.Button
    y: Q.height - marginY
    w: Q.width/4
    h: 70
    fill: "#f2da38"
    radius: 10
    fontColor: "#353b47"
    font: "400 58px Jolly Lodger"
    label: "All levels"
    type: Q.SPRITE_UI | Q.SPRITE_DEFAULT

  buttonBack.p.x = Q.width/2 - buttonBack.p.w/2 - 40

  buttonBack.on "click", (e) ->
    Game.stageLevelSelectScreen()

  # save progress in game
  if Q.state.get("currentLevel") >= Game.availableLevel
    Game.availableLevel = Q.state.get("currentLevel") + 1
    localStorage.setItem(Game.storageKey, Game.availableLevel)
