Q = Game.Q

Q.UI.LevelButton = Q.UI.Button.extend "UI.LevelButton",
  init: (p) ->
    @_super p,
      type: Q.SPRITE_UI | Q.SPRITE_DEFAULT
      fill: "#EEE"

    @p.label = @p.level

    if @p.enabled == false
      @p.fill = "#CCC"

    @on 'click', =>
      if @p.enabled
        Game.stageLevel(@p.level)
