export class Color {
  constructor(hexcode, name) {
    this.hexcode = hexcode
    this.name = name
  }

  getRed() {
    return parseInt(this.hexcode.slice(0, 2).toString(), 16) / 255
  }

  getGreen() {
    return parseInt(this.hexcode.slice(2, 4).toString(), 16) / 255
  }

  getBlue() {
    return parseInt(this.hexcode.slice(4, 6).toString(), 16) / 255
  }
}

export class ColorPair {
  constructor(foreground, background) {
    this.foreground = foreground
    this.background = background
    this.contrastRatio = this.calculateContrastRatio(foreground, background)
  }

  // https://www.w3.org/WAI/WCAG21/Techniques/general/G18

  calculateRelativeLuminance(red, green, blue) {
    let redFactor;
    if (red <= 0.03928) {
      redFactor = red / 12.92
    } else {
      redFactor = Math.pow(((red + 0.055) / 1.055), 2.4)
    }

    let greenFactor;
    if (green <= 0.03928) {
      greenFactor = green / 12.92
    } else {
      greenFactor = Math.pow(((green + 0.055) / 1.055), 2.4)
    }

    let blueFactor;
    if (blue <= 0.03928) {
      blueFactor = blue / 12.92
    } else {
      blueFactor = Math.pow(((blue + 0.055) / 1.055), 2.4)
    }

    return (0.2126 * redFactor) + (0.7152 * greenFactor) + (0.0722 * blueFactor)
  }

  calculateContrastRatio() {
    const foregroundLuminance = this.calculateRelativeLuminance(
      this.foreground.getRed(),
      this.foreground.getGreen(),
      this.foreground.getBlue()
    )

    const backgroundLuminance = this.calculateRelativeLuminance(
      this.background.getRed(),
      this.background.getGreen(),
      this.background.getBlue()
    )

    return (backgroundLuminance + 0.05) / (foregroundLuminance + 0.05)
  }

  getSmallTextRating() {
    if (this.contrastRatio >= 7) {
      return "AAA"
    }

    if (this.contrastRatio >= 4.5) {
      return "AA"
    }

    return "FAIL"
  }

  getLargeTextRating() {
    if (this.contrastRatio >= 4.5) {
      return "AAA"
    }

    if (this.contrastRatio >= 3) {
      return "AA"
    }

    return "FAIL"
  }

  getRating() {
    if ((this.getSmallTextRating() === "FAIL") || (this.getLargeTextRating() === "FAIL")) {
      return false
    } else {
      return true
    }
  }
}