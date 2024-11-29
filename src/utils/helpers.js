import { parse, stringify } from "svgson"

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
  const svgObject = await parse(svgText)

  const fillColors = {}
  const strokeColors = {}

  const getObjeFromNodeStyle = (node) => {

    const styleString = node.attributes.style
    const styleObject = styleString.split(';').reduce((acc, style) => {
      const [key, value] = style.split(':');
      if (key && value) {
        acc[key.trim()] = value.trim();
      }
      return acc;
    }, {});

    return styleObject
  }

  // рекурсия для извлечения уникальных цветов
  const extractColors = (node) => {
    if (node.attributes) {
      if (node.attributes.style) {
        const styleObject = getObjeFromNodeStyle(node)
        for (let [key, value] of Object.entries(styleObject)) {
          if (value === 'none') {
            styleObject[key] = 'nocolor'
          }
        }
        styleObject.fill && fillColors[styleObject.fill] ? fillColors[styleObject.fill] = [...fillColors[styleObject.fill],node.attributes.id] : fillColors[styleObject.fill] = [node.attributes.id]
        styleObject.stroke && strokeColors[styleObject.stroke] ? strokeColors[styleObject.stroke] = [...strokeColors[styleObject.stroke],node.attributes.id] : strokeColors[styleObject.stroke] = [node.attributes.id]
      }
    }
    if (node.children) {
      node.children.forEach(extractColors)
    }
  }

  extractColors(svgObject)


  const newColorGroup = {}
  for (let [key, value] of Object.entries(fillColors)) {
    newColorGroup[`fill${value.join('/')}`] = key
  }

  for (let [key, value] of Object.entries(strokeColors)) {
    newColorGroup[`stroke${value.join('/')}`] = key
  }

  if (Object.keys(titleState[0].colorGroups).length === 0) {
    setTitleState((prevState) => {
      const newTitleState = [...prevState]
      const nodeIndex = newTitleState.findIndex((item) => item.id === titleState[0].id)
      newTitleState[nodeIndex] = {  
        ...titleState[0], 
        colorGroups: newColorGroup
      }
      return newTitleState
    })
    return svgText
  }

  const currentColorGroup = titleState[0].colorGroups
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
    if (node.attributes) {
      if (node.attributes.style) {
        const styleObject = getObjeFromNodeStyle(node)
        for (const key in currentColorGroup) {
          if (key.startsWith('fill') && key.includes(node.attributes.id)) {
            styleObject.fill = currentColorGroup[key]
          }
          if (key.startsWith('stroke') && key.includes(node.attributes.id)) {
            styleObject.stroke = currentColorGroup[key]
          }
        }
        const styleString = Object.entries(styleObject).map(([key, value]) => `${key}:${value}`).join(';')
        node.attributes.style = styleString
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

