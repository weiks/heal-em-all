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
    @p.label = "I need to find the way out of here"

  keyNeeded: ->
    @p.label = "I need the key"

  doorOpen: ->
    @p.label = "Nice! Now I need to 'jump' inside the door"

  gunFound: ->
    @p.label = "I found the gun, I can shoot pressing Z"

  keyFound: ->
    @p.label = "I found the key, now I need to find the the door"

  clear: ->
    @p.label = ""

  lifeLevelLow: ->
    @p.label = "I need to be more careful"

  extraLifeFound: ->
    @p.label = "I feel better now!"

  lifeLost: ->
    @p.label = "That hurts!"

  zombieModeOn: ->
    @p.label = "I was bitten. I'm turning. Nooo!"

  zombieModeOnNext: ->
    @p.label = "I need to kill myself"

  zombieModeOff: ->
    @p.label = "Ok, back to businness"


