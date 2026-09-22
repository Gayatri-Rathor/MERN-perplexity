import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatMistralAI } from "@langchain/mistralai"
import { AIMessage, HumanMessage, SystemMessage, tool, createAgent } from "langchain";
import * as z from "zod";
import { searchInternet } from "./internet.services.js";
// import { sendMessage } from "../controllers/chat.controller.js";


const geminiModel = new ChatGoogleGenerativeAI({    
    model: "gemini-3.1-flash-lite",
    apiKey: process.env.GEMINI_API,
    maxRetries:1
});

const mistralModel = new ChatMistralAI({
    model: "mistral-small-latest",
    apiKey: process.env.MISTRAL_API_KEY,
    maxRetries:1

})

const searchInternetTool = tool(searchInternet,
    {
        name: "searchInternet",
        description: "Use this tool to get latest information from the internet.",
        schema: z.object({
            query: z.string().describe("The search query to look up on the internet.")
        })
    }

)

const agent = createAgent({
    model: geminiModel,
    tools: [searchInternetTool],
    systemPrompt: "You are a helpful assistant. For news, current events, or any recent information, always use the searchInternet tool before answering."
})

// export async function generateResponse(messages,image) {
//     const response = await agent.invoke({
//         messages: messages.map(msg => {
//             if (msg.role == "user") {
//                 return new HumanMessage(msg.content)
//             } else if (msg.role == "ai") {
//                 return new AIMessage(msg.content)
//             }
//         })
//     });

//     return response.messages[response.messages.length -1].text;

// }


export async function generateResponse(messages, image) {

      console.log("GEMINI START");

    const chatMessages = messages.map((msg, index) => {

        if (msg.role === "user") {

            // Sirf latest user message ke saath image bhejna
            if (
                image &&
                index === messages.length - 1
            ) {

                return new HumanMessage({
                    content: [
                        {
                            type: "text",
                            text: msg.content
                        },
                        {
                            type: "image_url",
                            image_url: {
                                url: `data:${image.mimetype};base64,${image.buffer.toString("base64")}`
                            }
                        }
                    ]
                });
            }

            return new HumanMessage(msg.content);
        }

        return new AIMessage(msg.content);
    });

    const response = await agent.invoke({
        messages: chatMessages
    });
    console.log("GEMINI SUCCESS");

    return response.messages.at(-1).text;
}

export async function generateTitle(message) {
    console.log("TITLE START");

    try {
        const response = await geminiModel.invoke([
            new SystemMessage(
                "You generate concise chat titles. Reply with a 2-4 word title only. No quotes, no markdown, no punctuation."
            ),
            new HumanMessage(`First message: "${message}"`)
        ]);
        return response.text.trim();
    } catch (err) {
        console.error("Title generation failed:", err.message);
        return message.slice(0, 30);
    }
    
    // console.log("MISTRAL SUCCESS");
    // return response.text;




}