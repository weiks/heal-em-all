Q = Game.Q

Q.scene "levelSelect", (stage) ->

  # layout params
  marginXinP = 10 # %
  marginYinP = 20 # %
  gutterXinP = 8 # %
  gutterYinP = 8 # %
  columnsNo = 3

  # layout math
  columnInP = (100 - (marginXinP * 2) - (columnsNo - 1) * gutterXinP)/columnsNo  # 24%

  marginX = Q.width * marginXinP * 0.01
  gutterX = Q.width * gutterXinP * 0.01
  columnWidth = Q.width * columnInP * 0.01

  marginY = Q.height * marginYinP * 0.01
  gutterY = Q.height * gutterYinP * 0.01
  rowHeight = Q.height * 0.20 # 20%

  # init params
  x = marginX + columnWidth/2
  y = marginY + rowHeight/2
  w = columnWidth
  h = rowHeight

  # add level buttons
  for item in [0..5]

    if item % columnsNo == 0
      x = marginX + columnWidth/2

      if item > 0
        y += rowHeight + gutterY

    enabled = if item + 1 <= Game.availableLevel then true else false

    stage.insert new Q.UI.LevelButton
      level: item + 1
      x: x
      y: y
      w: w
      h: h
      enabled: enabled

    x += columnWidth + gutterX

  # add title
  stage.insert new Q.UI.Text
    x: Q.width/2
    y: marginY/2
    label: "Everything begins here!"
    size: 30
    color: "#fff"
    family: "Ubuntu"

  # audio
  Q.AudioManager.stopAll()
  Q.AudioManager.clear()

  # audio button
  stage.insert new Q.UI.AudioButton
    x: Q.width/2
    y: Q.height - 50
