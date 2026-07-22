import { generateResponse } from "../services/ai.services.js"
import { generateTitle } from "../services/ai.services.js";
import chatModel from "../model/chat.model.js";
import messageModel from "../model/message.model.js";
import userModel from "../model/user.model.js";
import PDFDocument from "pdfkit";


export async function sendMessage(req, res) {

    console.log(req.file);
    console.log(req.body);

    const { message, chatId } = req.body

    if (chatId === "null" || chatId === "undefined") {
        chatId = null;
    }

    let title = null, chat = null;

    if (!chatId) {
        title = await generateTitle(message);
        chat = await chatModel.create({
            user: req.user.id,
            title,
        })

    }

    const currentChatId = chatId || chat._id

    const Usermessage = await messageModel.create({
        chat: currentChatId,
        content: message,
        role: "user"

    })
    const messages = await messageModel.find({ chat: currentChatId })
    const currentChat = await chatModel.findById(currentChatId);
    const result = await generateResponse(messages, req.file);

    console.log(messages);

    const aimessage = await messageModel.create({
        chat: currentChatId,
        content: result,
        role: "ai"
    })


    res.status(201).json({
        aimessage: result,
        title,
        chat: currentChat,
        aiMessage: aimessage,
        usermessage: Usermessage
    })

}



export async function getChats(req, res) {
    const user = req.user

    const chats = await chatModel.find({ user: user.id })

    res.status(200).json({
        message: "Chats retrieved successfully",
        chats
    })

}



export async function getMessages(req, res) {

    const { chatId } = req.params;

    const chat = await chatModel.findOne({
        _id: chatId,
        user: req.user.id
    })


    if (!chat) {
        return res.status(400).json({
            message: "User not found"
        })
    }

    const messages = await messageModel.find({
        chat: chatId

    })
    res.status(200).json({
        message: "Message retrieved successfully",
        messages
    })
}

export async function deleteChats(req, res) {

    const { chatId } = req.params;

    const chat = await chatModel.findOneAndDelete({
        _id: chatId,
        user: req.user.id
    })

    await messageModel.deleteMany({
        chat: chatId
    })

    if (!chat) {
        return res.status(400).json({
            message: "Chat not found"
        })
    }

    res.status(200).json({
        message: "Chat deleted successfullt",

    })

}


export async function downloadChatPDF(req, res) {

    const { chatId } = req.params;

    const chat = await chatModel.findOne({
        _id: chatId,
        user: req.user.id
    });

    if (!chat) {
        return res.status(404).json({
            success: false,
            message: "Chat not found"
        });
    }

    const doc = new PDFDocument({
        margin: 40
    });

    res.setHeader(
        "Content-Type",
        "application/pdf"
    );

    res.setHeader(
        "Content-Disposition",
        `attachment; filename="${chat.title}.pdf"`
    );

    doc.pipe(res);

    doc.fontSize(22)
        .text(chat.title, {
            align: "center"
        });

    doc.moveDown();

    const messages = await messageModel.find({ chat: chatId });

    messages.forEach((message) => {

        doc
            .fontSize(15)
            .fillColor("blue")
            .text(
                message.role === "user" ? "User" : "AI"
            );

        doc
            .fontSize(12)
            .fillColor("black")
            .text(message.content);

        doc.moveDown();
    });

    doc.end();
}