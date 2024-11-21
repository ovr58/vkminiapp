export const getAllFonts = () => {
    const objFontPaths = Object.keys(import.meta.glob('../assets/Fonts/*.ttf'))
    const fontsList = objFontPaths.map((path) => {
        return path.split('/')[3].split('.')[0]
    })
    return fontsList
}