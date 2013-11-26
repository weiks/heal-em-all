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
    label: "The End"
    size: 30
    color: "#fff"
    family: "Ubuntu"

  stage.insert new Q.UI.Text
      x: Q.width/2
      y: marginY/2 + 100
      label: "You did it! If you like the game give us some feedback."
      size: 30
      color: "#fff"
      family: "Ubuntu"

  # button
  button = stage.insert new Q.UI.Button
    x: Q.width/2
    y: marginY/2 + 350
    fill: "#CCCCCC"
    label: "Play again"
    keyActionName: "confirm"
    type: Q.SPRITE_UI | Q.SPRITE_DEFAULT

  button.on "click", (e) ->
    Game.stageLevelSelectScreen()

  # reset current level state
  Q.state.set "currentLevel", 0