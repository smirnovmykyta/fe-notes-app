import axios from "axios";

export async function generateImage(prompt) {
    try {
        const response = await axios.post(`${import.meta.env.VITE_PROXY_OPENAI}/api/v1/images/generation`,
            {
                prompt,
                n: 1,
                size: '1024x1024',
            },
            {
                headers: {
                    Authorization: `${import.meta.env.VITE_TOKEN}`,
                    'Content-Type': 'application/json',
                    provider: 'open-ai',
                    mode: `Bearer ${import.meta.env.VITE_AI_MODE}`
                },
            }
        )
        return response.data[0].url
    } catch (error) {
        console.error(error);
    }
}

export async function chat(messages) {
    try {
        const response = await axios.post(`${import.meta.env.VITE_PROXY_OPENAI}/api/v1/chat/completions`,
            {
                model: 'gpt-4o',
                messages: messages,
            },
            {
                headers: {
                    Authorization: `Bearer ${import.meta.env.VITE_TOKEN}`,
                    'Content-Type': 'application/json',
                    provider: 'open-ai',
                    mode: `${import.meta.env.VITE_AI_MODE}`
                },
            }
        )
        return {
            sender: 'bot',
            text: response.data.message?.content || 'No response from the bot',
        };
    } catch (error) {
        console.error(error);
    }
}

export async function generateAudio(text) {
    try {
        const response = await axios.post(`${import.meta.env.VITE_PROXY_OPENAI}/api/v1/audio/speech`,
            {
                text: text,
                voice: 'en-US-JennyNeural',
            },
            {
                headers: {
                    Authorization: `Bearer ${import.meta.env.VITE_TOKEN}`,
                    'Content-Type': 'application/json',
                    provider: 'open-ai',
                    mode: `${import.meta.env.VITE_AI_MODE}`
                },
            }
        )
        return response.data.audio_url;
    } catch (error) {
        console.error(error);
    }
}



