import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatMistralAI } from "@langchain/mistralai"
import { AIMessage, HumanMessage, SystemMessage, tool, createAgent } from "langchain";
import * as z from "zod";
import { searchInternet } from "./internet.services.js";
import { sendMessage } from "../controllers/chat.controller.js";


const geminiModel = new ChatGoogleGenerativeAI({
    model: "gemini-3.1-flash-lite",
    apiKey: process.env.GEMINI_API
});

const mistralModel = new ChatMistralAI({
    model: "mistral-small-latest",
    apiKey: process.env.MISTRAL_API_KEY
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
    tool: [searchInternetTool]
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

    return response.messages.at(-1).text;
}

export async function generateTitle(message) {

    const response = await mistralModel.invoke([
        new SystemMessage(`
Always answer using Markdown.

Use:
- Headings
- Bullet points
- Numbered lists
- Tables whenever suitable
- Code blocks for code

            You are a helpful assistant that generates concise and descriptive title for that chat conservation.
            
            User will provide you with the first message of a chat conservation,and you will generate a title that captures the essence of the conservation within 2-4 words. The title should be clear ,relevant and engaging ,giving users a quick understanding of the chat's topic.`

        ),

        new HumanMessage(`Generate a title for a chat conservation based on the following firt message:"${message}"`)


    ]);
    return response.text;




}