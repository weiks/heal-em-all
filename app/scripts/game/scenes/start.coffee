Q = Game.Q

Q.scene "start", (stage) ->

  # some math
  marginY = Q.height * 0.2

  # audio
  Q.AudioManager.stopAll()

  # add title
  stage.insert new Q.UI.Text
    x: Q.width/2
    y: marginY/2
    label: "Heal'em all \n There's a cure for zombies"
    size: 30
    color: "#fff"
    family: "Ubuntu"
    align: "center"

  stage.insert new Q.UI.Text
      x: Q.width/2
      y: marginY/2 + 100
      label: "jakas grafika, autorzy, sterowanie, moze jakis kontakt? twitter?"
      size: 30
      color: "#fff"
      family: "Ubuntu"

  # button
  button = stage.insert new Q.UI.Button
    x: Q.width/2
    y: marginY/2 + 350
    fill: "#CCCCCC"
    label: "Click to continue"
    keyActionName: "confirm"
    type: Q.SPRITE_UI | Q.SPRITE_DEFAULT

  button.on "click", (e) ->
    Game.stageLevelSelectScreen()
