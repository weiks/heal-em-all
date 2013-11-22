Q = Game.Q

Q.UI.BulletsCounter = Q.UI.Text.extend "UI.BulletsCounter",
  init: (p) ->
    @_super p,
      text: "Bullets: "
      label: "Bullets: " + Q.state.get("bullets")
      size: 30
      x: 0
      y: 30
      color: "#000"

    Q.state.on "change.bullets", @, "updateLabel"

  updateLabel: (bullets) ->
    @p.label = @p.text + bullets