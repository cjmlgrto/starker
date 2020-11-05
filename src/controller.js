import sketch from 'sketch'
import BrowserWindow from 'sketch-module-web-view'
import { Color, ColorPair } from './model'

const collectColors = (selectedLayers) => {
  let colors = []

  selectedLayers.forEach(layer => {
    if (layer.style.fills.length != 0) {
      let topMostFill = layer.style.fills[0]

      if (topMostFill.fillType === 'Color') {
        let hexcode = topMostFill.color.slice(1,-2)
        colors.push(
          new Color(hexcode, layer.name)
        )
      }
    }
  })

  return colors
}

const createPairs = (colors) => {
  let pairs = []

  colors.forEach(foreground => {
    colors.forEach(background => {
      if (foreground.hexcode != background.hexcode) {
        pairs.push(
          new ColorPair(foreground, background)
        )
      }
    })
  })

  return pairs
}

const collectResults = (pairs) => {
  return pairs.map(pair =>({
    'foreground': `${pair.foreground.hexcode}`,
    'background': `${pair.background.hexcode}`,
    'contrastRatio': `${pair.contrastRatio.toFixed(2)}`,
    'smallTextRating': `${pair.getSmallTextRating()}`,
    'largeTextRating': `${pair.getLargeTextRating()}`
  }))
}

export default function() {
  const document = sketch.getSelectedDocument()
  const selectedLayers = document.selectedLayers

  if (selectedLayers.length === 0) {
    sketch.UI.message('Select at least one layer with a solid color fill.')
    return
  }

  const colors = collectColors(selectedLayers)
  const pairs = createPairs(colors)
  const results = collectResults(pairs)

  const browser = new BrowserWindow({ 
    identifier: 'starker.get-contrast-combinations',
    title: 'Starker Results',
    alwaysOnTop: true,
    minWidth: 420,
    width: 420,
    height: 640
  })

  browser.loadURL(require('./view.html'))

  browser.webContents
    .executeJavaScript(
      `render(${JSON.stringify(results)})`
    )
    .then(res => {
      sketch.UI.message(`${colors.length} colors selected, ${pairs.length} pairs compared.`)
    })
}
