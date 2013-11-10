Q = Game.Q

Q.UI.LivesCounter = Q.UI.Text.extend "UI.LivesCounter",
  init: (p) ->
    @_super p,
      text: "Lives: "
      label: "Lives: " + Q.state.get("lives")
      size: 30
      x: 0
      y: 0
      color: "#000"

    Q.state.on "change.lives", @, "updateLabel"

  updateLabel: (lives) ->
    @p.label = @p.text + lives