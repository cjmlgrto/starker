import sketch from 'sketch'

export default function() {
  const doc = sketch.getSelectedDocument()
  const selectedLayers = doc.selectedLayers
  const selectedCount = selectedLayers.length

  sketch.UI.message(`${selectedCount} layers selected`)
}
