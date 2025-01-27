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
                    Authorization: `${import.meta.env.VITE_TOKEN}`,
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

export async function streamChat(messages,  onData) {
    try {
        // const response = await axios.post(`${import.meta.env.VITE_PROXY_OPENAI}/api/v1/chat/completions`,
        //     {
        //         model: 'gpt-4o',
        //         messages: messages,
        //         stream: true,
        //     },
        //     {
        //         headers: {
        //             Authorization: `${import.meta.env.VITE_TOKEN}`,
        //             // 'Content-Type': 'application/json',
        //             provider: 'open-ai',
        //             mode: `${import.meta.env.VITE_AI_MODE}`
        //         },
        //         responseType: 'stream',
        //     }
        // )

        const response = await fetch(`${import.meta.env.VITE_PROXY_OPENAI}/api/v1/chat/completions`, {
            method: 'POST',
            headers: {
                Authorization: `${import.meta.env.VITE_TOKEN}`,
                provider: 'open-ai',
                mode: `${import.meta.env.VITE_AI_MODE}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'gpt-4o',
                messages: messages,
                stream: true,
            }),
        });

        const reader = response.body.getReader();
        const textDecoder = new TextDecoder();

        let done = false;
        let partialData = "";


        while (!done) {
            const { value, done: streamDone } = await reader.read();
            done = streamDone;


            const chunk = textDecoder.decode(value, { stream: true });


            partialData += chunk;


            const lines = partialData.split("\n").map(line => line.trim()).filter(line => line.startsWith("data:"));


            for (const line of lines) {
                if (line === "data: [DONE]") {
                    return;
                }


                const parsed = JSON.parse(line.replace("data: ", ""));
                const content = parsed.choices[0]?.delta?.content || "";
                // console.log("content " + content)

                onData(content);
            }


            partialData = partialData.split("\n").slice(-1).join("\n");
        }
    } catch (error) {
        console.error("Error in streamChat:", error);
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


