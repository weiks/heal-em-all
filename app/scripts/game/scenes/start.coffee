Q = Game.Q

Q.scene "start", (stage) ->
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
    label: "Let's Play"
    keyActionName: "confirm"

  label = container.insert new Q.UI.Text
    x: 10
    y: -50 - button.p.h
    color: "white"
    label: "Another Zombie Game"

  # disable player with that stage
  Game.player.del("platformerControls")

  button.on "click", (e) ->
    # clear itself
    Q.clearStage(2)

    Game.player.add("platformerControls")


  # Expand the container to visibily fit it's contents
  container.fit(40)
