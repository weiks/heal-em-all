Q = Game.Q

Q.UI.InfoLabel = Q.UI.Text.extend "UI.InfoLabel",
  init: (p, defaultProps) ->
    @_super p,
      label: "",
      color: "#000",
      x: 100,
      y: 0
      size: 28

  intro: ->
    @p.label = "I need to cure them"

  clear: ->
    @p.label = ""

  lifeLevelLow: ->
    @p.label = "I need to be more careful"

  lifeLost: ->
    @p.label = "That hurts!"


