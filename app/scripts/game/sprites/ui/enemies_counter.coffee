Q = Game.Q

Q.UI.EnemiesCounter = Q.UI.Text.extend "UI.EnemiesCounter",
  init: (p) ->
    @_super p,
      text: "Zombies left: "
      label: "Zombies left: " + Q.state.get("enemiesCounter")
      size: 30
      x: 0
      y: 0
      color: "#000"

    Q.state.on "change.enemiesCounter", @, "updateLabel"

  updateLabel: (enemiesCounter) ->
    @p.label = @p.text + enemiesCounter