Q = Game.Q

Q.UI.LevelButton = Q.UI.Button.extend "UI.LevelButton",
  init: (p) ->
    @_super p,
      type: Q.SPRITE_UI | Q.SPRITE_DEFAULT
      fill: "#CCCCCC"

    @p.label = @p.level

    @on 'click', =>
      Game.stageLevel(@p.level)
