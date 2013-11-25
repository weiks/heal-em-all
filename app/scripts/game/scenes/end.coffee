Q = Game.Q

Q.scene "end", (stage) ->

  # some math
  marginY = Q.height * 0.2

  # audio
  Q.AudioManager.stopAll()

  # add title
  stage.insert new Q.UI.Text
    x: Q.width/2
    y: marginY/2
    label: "Well done! Let's see the level summary:"
    size: 30
    color: "#fff"
    family: "Ubuntu"

  # add level summary
  if stage.options.health
    stage.insert new Q.UI.Text
      x: Q.width/2
      y: marginY/2 + 100
      label: "Health collected: " + stage.options.health.collected + "/" + stage.options.health.available
      size: 30
      color: "#fff"
      family: "Ubuntu"

  if stage.options.zombies
    stage.insert new Q.UI.Text
      x: Q.width/2
      y: marginY/2 + 150
      label: "Zombies healed: " + stage.options.zombies.healed + "/" + stage.options.zombies.available
      size: 30
      color: "#fff"
      family: "Ubuntu"

  if stage.options.bullets
    stage.insert new Q.UI.Text
      x: Q.width/2
      y: marginY/2 + 200
      label: "Bullets waisted: " + stage.options.bullets.waisted + "/" + stage.options.bullets.available
      size: 30
      color: "#fff"
      family: "Ubuntu"

  if stage.options.zombieModeFound?
    stage.insert new Q.UI.Text
      x: Q.width/2
      y: marginY/2 + 250
      label: "Zombie Mode: " + if stage.options.zombieModeFound then "done" else "not found"
      size: 30
      color: "#fff"
      family: "Ubuntu"


  # button
  button = stage.insert new Q.UI.Button
    x: Q.width/2
    y: marginY/2 + 350
    fill: "#CCCCCC"
    label: "Play Next"
    keyActionName: "confirm"
    type: Q.SPRITE_UI | Q.SPRITE_DEFAULT

  button.on "click", (e) ->
    Game.stageLevelSelectScreen()

  # save progress in game
  if Q.state.get("currentLevel") >= Game.availableLevel
    Game.availableLevel = Q.state.get("currentLevel") + 1
    localStorage.setItem(Game.storageKey, Game.availableLevel)
