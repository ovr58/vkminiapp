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
