import { parse } from "svg-parser"
import { stringify } from "svgson"

export const getAllFonts = () => {
    const objFontPaths = Object.keys(import.meta.glob('../assets/Fonts/*.ttf'))
    const fontsList = objFontPaths.map((path) => {
        return path.split('/')[3].split('.')[0]
    })
    return fontsList
}

export const generateLineBreaks = (str) => {
  const originalStr = str.replace(/\n/g, ' ');
  const words = originalStr.split(' ');
  const results = [];
  console.log('WORDS - ', words, originalStr)
  function helper(current, index) {
    if (index === words.length) {
      results.push(current.join(' ').replace(/ \n/g, '\n'))
      return;
    }

    // Добавить текущее слово без переноса строки
    helper([...current, words[index]], index + 1);

    // Добавить текущее слово с переносом строки
    if (current.length > 0) {
      helper([...current, '\n' + words[index]], index + 1);
    }
  }

  helper([], 0);
  const curIndex = results.findIndex((item) => item === str)
  console.log('RESULTS - ', results)
  results.splice(0, curIndex+1)
  if (results.length === 0) {
    return [originalStr]
  }
  console.log('RESULTS - ', results)
  return results;
}


export const getSvgChanged = async (svg, titleState, setTitleState) => {
  const response = await fetch(svg)
  const svgText = await response.text()
  const svgObject = parse(svgText)

  const fillColors = new Set()
  const strokeColors = new Set()

  // рекурсия для извлечения уникальных цветов
  const extractColors = (node) => {
    if (node.properties) {
      if (node.properties.fill) {
        fillColors.add(node.properties.fill)
      }
      if (node.properties.stroke) {
        strokeColors.add(node.properties.stroke)
      }
    }
    if (node.children) {
      node.children.forEach(extractColors)
    }
  }

  extractColors(svgObject)

  const newColorGroup = {}
  let index=1
  fillColors.forEach((color) => {
    newColorGroup[`color${index}`] = color
    index++
  })
  index=1
  strokeColors.forEach((color) => {
    newColorGroup[`stroke${index}`] = color
    index++
  })
  console.log('NEW COLOR GROUP - ', titleState, newColorGroup)
  if (Object.keys(titleState.colorGroups).length === 0) {
    setTitleState((prevState) => {
      const newTitleState = [...prevState]
      const nodeIndex = newTitleState.findIndex((item) => item.id === titleState.id)
      newTitleState[nodeIndex] = {  
        ...titleState, 
        colorGroup: newColorGroup
      }
      return newTitleState
    })
    return svgText
  }

  const currentColorGroup = titleState.colorGroups
  let isDifferent = false

  for (const key in newColorGroup) {
    if (currentColorGroup[key] !== newColorGroup[key]) {
      isDifferent = true
      break
    }
  }

  if (!isDifferent) {
    return svgText
  }

  const updateColors = (node) => {
    if (node.properties) {
      for (const key in currentColorGroup) {
        if (key.startsWith('color') && node.properties.fill === newColorGroup[key]) {
          node.properties.fill = currentColorGroup[key]
        }
        if (key.startsWith('colorStroke') && node.properties.stroke === newColorGroup[key]) {
          node.properties.stroke = currentColorGroup[key]
        }
      }
    }
    if (node.children) {
      node.children.forEach(updateColors)
    }
  }

  updateColors(svgObject)

  const updatedSvgText = stringify(svgObject)

  return updatedSvgText
}