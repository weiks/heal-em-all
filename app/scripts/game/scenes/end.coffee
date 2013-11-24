Q = Game.Q

Q.scene "end", (stage) ->
  container = stage.insert new Q.UI.Container
    x: Q.width/2,
    y: Q.height/2,
    w: Q.width,
    h: Q.height
    fill: "rgba(0,0,0,0.5)"

  button = container.insert new Q.UI.Button
    x: 0
    y: 0
    fill: "#CCCCCC"
    label: "Play Again"
    keyActionName: "confirm"
    type: Q.SPRITE_UI | Q.SPRITE_DEFAULT

  label = container.insert new Q.UI.Text
    x:10
    y: -10 - button.p.h
    label: stage.options.label

  button.on "click", (e) ->
    Game.stageLevelSelectScreen()

  # Expand the container to visibily fit it's contents
  container.fit(20)
