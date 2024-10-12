import Replicate from "replicate"

const replicate = new Replicate({
    auth: import.meta.env.VITE_APP_REPLICATE_API_TOKEN
})

export const generateImg = async ({promptText}) => {
    const output = await replicate.run(
        "black-forest-labs/flux-schnell",
        {input: {prompt: promptText}}
    )
    return output
}