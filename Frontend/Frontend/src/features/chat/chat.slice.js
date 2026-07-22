import { createSlice } from "@reduxjs/toolkit"


const chatSlice = createSlice({
    name: 'chat',
    initialState: {
        chats: {},
        currentChatId: null,
        messageText: '',
        isLoading: false,
        error: null
    },
    reducers: {
        createNewChat: (state, action) => {
            const { chatId, title } = action.payload
            state.chats[chatId] = {
                id: chatId,
                title,
                messages: [],
                lastUpdated: new Date().toISOString(),
            }
        },

        addNewMessage: (state, action) => {
            const { chatId, content, role } = action.payload
            console.log(chatId);
            console.log(state.chats[chatId]);
            if (!state.chats[chatId]) return;

            state.chats[chatId].messages.push({ content, role });
        },
        addMessages: (state, action) => {
            const { chatId, messages } = action.payload
            state.chats[chatId].messages.push(...messages)
        },
        setChats: (state, action) => {
            state.chats = action.payload
        },
        setCurrentChatId: (state, action) => {
            state.currentChatId = action.payload
        },
        setMessageText: (state, action) => {
            state.messageText = action.payload
        },
        setisLoading: (state, action) => {
            state.isLoading = action.payload
        },
        setError: (state, action) => {
            state.error = action.payload
        },
        removeChat: (state, action) => {
            delete state.chats[action.payload];
        }
    }
})
export const { createNewChat, addNewMessage, addMessages, setChats, setCurrentChatId, setMessageText, setisLoading, setError,removeChat } = chatSlice.actions
export default chatSlice.reducer