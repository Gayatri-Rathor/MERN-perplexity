import { initializeSocketConnection } from "../services/chat.socket";
import { sendMessages } from "../../auth/services/chat.api";
import { getChats } from "../../auth/services/chat.api";
import { getMessages } from "../../auth/services/chat.api";
import { deleteChats } from "../../auth/services/chat.api";

import { createNewChat, addNewMessage, addMessages, setChats, setCurrentChatId, setError, setisLoading, setMessageText, removeChat } from "../chat.slice";
import { useDispatch ,useSelector} from "react-redux";

export const useChat = () => {

    const dispatch = useDispatch()
    const {currentChatId} =useSelector((state)=>state.chats);

       async function handleSendMessages({ message, chatId, image }) {
        dispatch(setisLoading(true));
        try {
            const data = await sendMessages({ message, chatId, image })
            const { chat, aiMessage, usermessage } = data;

            if (!chatId && chat) {
                dispatch(createNewChat({
                    chatId: chat._id,
                    title: chat.title
                }))
            }

            dispatch(addNewMessage({
                chatId: chat?._id || chatId,
                content: usermessage.content,
                role: "user"
            }))

            dispatch(addNewMessage({
                chatId: chat?._id || chatId,
                content: aiMessage.content,
                role: "ai"
            }))

            dispatch(setCurrentChatId(chat?._id || chatId));
        } catch (err) {
            dispatch(setError(err.response?.data?.message || "Failed to send Message"));
        } finally {
            dispatch(setisLoading(false));
        }
    }

    async function handleGetChats() {
        dispatch(setisLoading(true))
        const data = await getChats()
        const { chats } = data
        if (chats.length > 0) {
            dispatch(setCurrentChatId(chats[0]._id));
        }
        dispatch(setChats(chats.reduce((acc, chat) => {
            acc[chat._id] = {
                id: chat._id,
                title: chat.title,
                messages: [],
                lasUpdated: chat.updatedAt,
            }
            return acc
        }, {})))
        dispatch(setisLoading(false))
    }


    async function handleOpenChat(chatId, chats) {
        console.log("chatId:", chatId);
        console.log("chats:", chats);
        if (chats[chatId]?.messages.length === 0) {
            const data = await getMessages({ chatId })
            const { messages } = data

            const formattedMessages = messages.map(msg => ({
                content: msg.content,
                role: msg.role
            }))
            dispatch(addMessages({
                chatId,
                messages: formattedMessages,
            }))
        }

        dispatch(setCurrentChatId(chatId))
    }

    async function handleNewChat() {
        dispatch(setCurrentChatId(null));
        dispatch(setMessageText(""));
    }

    async function handleDeleteChat(chatId) {
        try{
        await deleteChats({ chatId });

        dispatch(removeChat(chatId));

        if (currentChatId === chatId) {
            dispatch(setCurrentChatId(null));
        }
    }catch(err){
        dispatch(setError("Failed to delete chat"))

    }
}

    return {
        initializeSocketConnection,
        handleSendMessages,
        handleGetChats,
        handleOpenChat,
        handleNewChat,
        handleDeleteChat

    }
}

