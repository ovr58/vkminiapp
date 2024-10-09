import axios from 'axios'

const folderId = import.meta.env.VITE_APP_YANDEXART_FOLDER_ID

const apiKey = import.meta.env.VITE_APP_YANDEXART_API_KEY

const authString = `API-KEY ${apiKey}`

const modelUri = `art://${folderId}/yandex-art/latest`

export const generateImg = async(promtText) => {
    return await axios.post(
        'https://llm.api.cloud.yandex.net/foundationModels/v1/imageGenerationAsync', {
        modelUri: modelUri,
        generationOptions: {
          seed: '1863',
          aspectRatio: {
            widthRatio: '2',
            heightRatio: '1'
          }
        },
        messages: [
          {
            weight: '1',
            text: promtText
          }
        ]
      }, {
        headers: {
          'Authorization': {authString},
          'Content-Type': 'application/json'
        }
      })
}

export const getImgResult = async (operationId) => {
    return await axios.get(`https://llm.api.cloud.yandex.net:443/operations/${operationId}`, {
        headers: {
            'Authorization': {authString}
        }
    })
} 