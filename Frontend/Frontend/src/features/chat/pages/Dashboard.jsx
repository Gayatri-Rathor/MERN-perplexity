import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useChat } from '../hook/useChat.js'
import { setMessageText } from '../chat.slice.js'
import { useState, useEffect, useRef } from "react";
import { FiSun, FiMoon, FiMenu, FiX, FiTrash2, FiCopy, FiDownload } from "react-icons/fi";
import { LuHistory } from "react-icons/lu";
import { FaCrown } from "react-icons/fa";
import { useAuth } from "../../auth/hook/UseAuth.js";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";


export const Dashboard = () => {
    const [darkMode, setDarkMode] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const fileInputRef = useRef(null);
    const messagesEndRef = useRef(null);
    const [networkStatus, setNetworkStatus] = useState({
        online: navigator.onLine,
        show: false,
    });

    const dispatch = useDispatch()
    const chatHook = useChat()
    const authHook = useAuth();
    const { user } = useSelector((state) => state.auth || {})
    const { chats = {}, currentChatId, messageText = '', isLoading = false } =
        useSelector((state) => state.chats || {})

    useEffect(() => {

        function handleOnline() {

            setNetworkStatus({
                online: true,
                show: true,
            });

            setTimeout(() => {
                setNetworkStatus((prev) => ({
                    ...prev,
                    show: false,
                }));
            }, 3000);

        }

        function handleOffline() {

            setNetworkStatus({
                online: false,
                show: true,
            });

        }


        return () => {
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
        };

    }, []);
    useEffect(() => {
        if (chatHook?.initializeSocketConnection)
            chatHook.initializeSocketConnection()
        chatHook.handleGetChats()
        console.log(chats);
        console.log(currentChatId);

    }, []);


    const chatsArray = Object.values(chats || {})
    const activeChat = currentChatId
        ? chats[currentChatId] : null;
    const messages = activeChat?.messages || []
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({
            behavior: "instant",
        });
    }, [messages]);

    const handleSendMessages = (e) => {
        // console.log(req.file);
        // console.log(req.body);
        e.preventDefault()
        console.log("working");


        if (!messageText.trim()) return
        if (chatHook?.handleSendMessages) {
            console.log(messageText);
            console.log(selectedImage);
            chatHook.handleSendMessages({

                chatId: currentChatId,
                message: messageText.trim(),
                image: selectedImage
            })
        }

        dispatch(setMessageText(''))
        setSelectedImage(null);
    }


    const handleCopyMessage = async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            alert("Message copied!");
        } catch (err) {
            console.log(err);
        }
    };

    const downloadPDF = async () => {
        console.log("Download button clicked");

        if (!currentChatId) {
            alert("Please open a chat first");
            return;
        }

        const response = await fetch(
            `http://localhost:3000/api/chats/download/${currentChatId}`,
            {
                credentials: "include"
            }
        );

        const blob = await response.blob();

        const url = window.URL.createObjectURL(blob);

        const a = document.createElement("a");

        a.href = url;
        a.download = "chat.pdf";
        a.click();

        window.URL.revokeObjectURL(url);


    };


    const handleFileSelect = (e) => {
        const file = e.target.files[0];

        console.log(file);

        if (file) {
            setSelectedImage(file);
        }
    };
    const OpenChat = (chatId) => {
        if (chatHook?.handleOpenChat) chatHook.handleOpenChat(chatId, chats)
    }




    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.ctrlKey && e.key.toLowerCase() === "i") {
                e.preventDefault();

                chatHook.handleNewChat();
                setSidebarOpen(false);
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [chatHook]);




    return (
        <main
            className={`h-screen flex overflow-hidden transition-all duration-300
${darkMode
                    ? "bg-[#0f0f0f] text-white"
                    : "bg-[#f7f7f8] text-black"
                }`}
        >

            {/* ================= MOBILE SIDEBAR ================= */}

            <div
                className={`fixed inset-0 z-40 md:hidden transition-all duration-300
${sidebarOpen
                        ? "translate-x-0"
                        : "-translate-x-full"
                    }`}
            >

                <div
                    className={`w-64 lg:w-[60%] 
max-w-xs h-full
${darkMode ? "bg-[#171717]" : "bg-white "}
border-r
${darkMode ? "border-[#2b2b2b]" : "border-gray-300"}
`}
                >

                    <div className="p-5 flex items-center justify-between gap-3">

                        <h2 className="font-bold text-base">
                            Perplexity
                        </h2>

                        <button
                            onClick={() => setSidebarOpen(false)}
                        >
                            <FiX size={23} />
                        </button>

                    </div>

                    <div className="px-5">

                        <button

                            onClick={() => {
                                chatHook.handleNewChat()
                                setSidebarOpen(false)
                            }}

                            className="w-full flex items-center justify-between py-3 px-4 rounded-xl bg-blue-400 text-white hover:bg-blue-700 transition cursor-pointer"
                        >



                        </button>


                    </div>


                    <div
                        className="mt-5 px-3 overflow-y-auto scrollbar-hide h-[80vh]"
                    >

                        {

                            chatsArray.map((c) => (

                                <div

                                    key={c.id}

                                    className={`group flex items-center justify-between px-3 sm:px-4 md:px-8 py-3 rounded-xl cursor-pointer transition

${currentChatId === c.id
                                            ?

                                            darkMode
                                                ?

                                                "bg-[#2b2b2b]"

                                                :

                                                "bg-gray-200"

                                            :

                                            darkMode
                                                ?

                                                "hover:bg-[#232323]"

                                                :

                                                "hover:bg-gray-100"

                                        }

`}

                                >

                                    <button

                                        onClick={() => {

                                            OpenChat(c.id)
                                            setSidebarOpen(false)

                                        }}

                                        className="flex-1 truncate text-left cursor-pointer"

                                    >

                                        {c.title}

                                    </button>

                                    <button

                                        onClick={() => {
                                            if (window.confirm("Delete Chat?")) {
                                                chatHook.handleDeleteChat(c.id)
                                            }
                                        }}

                                        className="opacity-0 group-hover:opacity-100 cursor-pointer"

                                    >

                                        <FiTrash2 />

                                    </button>

                                </div>

                            ))

                        }

                    </div>

                </div>

            </div>

            {networkStatus.show && (

                <div
                    className={`fixed top-0 left-0 right-0 z-50 py-2 text-center font-medium transition-all

        ${networkStatus.online
                            ? "bg-green-600 text-white"
                            : "bg-red-600 text-white"
                        }`}
                >

                    {networkStatus.online
                        ? " Back Online"
                        : " No Internet Connection"}

                </div>

            )}



            {/* ================= DESKTOP SIDEBAR ================= */}

            <aside

                className={`
hidden
md:flex
w-72 md:w-62
flex-col
border-r
text-base   

${darkMode
                        ?
                        "bg-[#171717] border-[#2b2b2b]"
                        :
                        "bg-white border-gray-300"
                    }

`}

            >


                <div className="p-5">

                    <button

                        onClick={chatHook.handleNewChat}

                        className="w-full flex justify-between items-center py-2 rounded-xs bg-blue-400 hover:bg-blue-950 font-bold bg-gray-600 text-white transition cursor-pointer text-xs "

                    >

                        <span className='ml-2'>+ New Chat</span>

                        <span className="bg-gray-700 mr-2 text-white text-xs px-2 py-0.5 rounded">
                            Ctrl + I
                        </span>

                    </button>

                </div>

                <div className="flex items-center gap-2 px-4 mt-4 mb-2">
                    <LuHistory className="text-sm text-gray-400" size={18} />
                    <h2 className="text-sm text-gray-400 font-semibold">
                        History
                    </h2>
                </div>

                <div

                    className="
flex-1
overflow-y-auto
scrollbar-hide
px-3
space-y-2
"

                >

                    {

                        chatsArray.length === 0

                            ?

                            <div className="text-center text-gray-400 mt-10">

                                No Chats Yet

                            </div>

                            :

                            chatsArray.map((c) => (

                                <div

                                    key={c.id}

                                    className={`group flex items-center justify-between px-3 py-2 rounded-xs transition cursor-pointer

${currentChatId === c.id

                                            ?

                                            darkMode

                                                ?

                                                "bg-[#2b2b2b]"

                                                :

                                                "bg-gray-200"

                                            :

                                            darkMode

                                                ?

                                                "hover:bg-[#232323]"

                                                :

                                                "hover:bg-gray-100"

                                        }

`}

                                >

                                    <button

                                        onClick={() => OpenChat(c.id)}

                                        className="flex-1 truncate text-left cursor-pointer"

                                    >

                                        {c.title}

                                    </button>

                                    <button

                                        onClick={() => {
                                            if (window.confirm("Delete Chat?")) {
                                                chatHook.handleDeleteChat(c.id)
                                            }
                                        }}

                                        className="opacity-0 group-hover:opacity-300 cursor-pointer"

                                    >

                                        <FiTrash2 />

                                    </button>

                                </div>

                            ))

                    }

                </div>

                <button className="flex place-items-center text-neutral-400  gap-2 px-2 py-1 cursor-pointer text-center">
                    <FaCrown size={18} />
                    Upgrade
                </button>

                <div className="px-4 py-3 mt-auto">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-400 flex items-center justify-center text-white font-bold">
                            {user?.username?.charAt(0).toUpperCase()}
                        </div>

                        <div className="min-w-0">
                            <p className="font-medium truncate">
                                {user?.username}
                            </p>

                            <p className="text-xs text-gray-400 truncate">
                                {user?.email}
                            </p>
                        </div>
                    </div>
                </div>

            </aside>

            {/* ================= MAIN ================= */}

            <section className="flex-1 flex flex-col">

                {/* HEADER */}

                <div

                    className={`
h-16
px-6
flex
items-center
justify-between
border-b

${darkMode

                            ?

                            "border-[#2b2b2b]"

                            :

                            "border-gray-300"

                        }

`}

                >

                    <div className="flex items-center gap-3 flex-1 min-w-0">

                        <button

                            onClick={() => setSidebarOpen(true)}

                            className="md:hidden flex-shrink-0 cursor-pointer"

                        >

                            <FiMenu size={24} />

                        </button>

                        <h2 className="hidden sm:block font-semibold text-base md:text-lg truncate">

                            {activeChat?.title || "New Chat"}

                        </h2>

                    </div>

                    <div className="flex items-center gap-5">

                        <button

                            onClick={() => setDarkMode(!darkMode)}

                            className={`
p-2
rounded-full

${darkMode

                                    ?

                                    "bg-[#222] cursor-pointer"

                                    :

                                    "bg-gray-200 cursor-pointer"

                                }

`}

                        >

                            {

                                darkMode

                                    ?

                                    <FiSun size={20} />

                                    :

                                    <FiMoon size={20} />

                            }

                        </button>

                        <div className="flex items-center gap-3">



                            <button
                                onClick={downloadPDF}
                                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-[#2b2b2b] transition cursor-pointer"
                                title="Download PDF"
                            >
                                <FiDownload size={20} />
                            </button>



                            <button

                                onClick={() => {

                                    if (window.confirm("Logout?")) {

                                        authHook.handleLogout();

                                    }

                                }}

                                className="px-1 py-0.5 pb-1 rounded-xs text-balance bg-blue-900 hover:bg-red-700 text-white cursor-pointer"

                            >

                                Logout

                            </button>



                        </div>

                    </div>

                </div>

                {/* ================= CHAT AREA ================= */}

                <div
                    className={`
    flex-1
    overflow-y-auto
    scrollbar-hide
    px-4
    md:px-8
    py-8
    `}
                >

                    {messages.length === 0 ? (

                        <div className="h-full flex flex-col items-center justify-center">

                            <h1 className="text-base
sm:text-3xl
md:text-4xl
font-bold
text-center
px-4
font-semibold
leading-tight">
                                Perplexity
                            </h1>

                            <p
                                className={`text-center  ${darkMode
                                    ? "text-gray-500"
                                    : "text-gray-600"
                                    }`}
                            >
                                Ask anything...
                            </p>

                        </div>

                    ) : (

                        <div className="max-w-5xl mx-auto space-y-8">

                            {messages.map((m, index) => (
                                <div
                                    key={index}
                                    className={`flex ${m.role === "user"
                                        ? "justify-end"
                                        : "justify-start"
                                        }`}
                                >
                                    <div className="group relative max-w-3xl">

                                        <div className="flex flex-col gap-2">

                                            <div
                                                className={`font-semibold text-sm ${m.role === "user"
                                                    ? "text-blue-400"
                                                    : "text-green-400"
                                                    }`}
                                            >

                                            </div>

                                            <span className="font-semibold font-mono text-xs ">
                                                {m.role === "user" ? "Human" : "AI"}
                                            </span>

                                            <div
                                                className={`px-3 py-2 rounded-xs whitespace-pre-wrap leading-7 ${m.role === "user"
                                                    ? "bg-mauve-800 text-white"
                                                    : darkMode
                                                        ? "bg-[#1b1b1b] border border-[#2c2c2c]"
                                                        : "bg-white border border-gray-300 text-black"
                                                    }`}
                                            >
                                                {
                                                    m.role === "ai" ? (
                                                        <ReactMarkdown
                                                            remarkPlugins={[remarkGfm]}
                                                            rehypePlugins={[rehypeHighlight]}
                                                            components={{
                                                                table: ({ children }) => (
                                                                    <table className="table-auto border border-gray-500 w-full my-3">
                                                                        {children}
                                                                    </table>
                                                                ),

                                                                th: ({ children }) => (
                                                                    <th className="border border-gray-500 px-3 py-2 bg-gray-700">
                                                                        {children}
                                                                    </th>
                                                                ),

                                                                td: ({ children }) => (
                                                                    <td className="border border-gray-500 px-3 py-2">
                                                                        {children}
                                                                    </td>
                                                                ),

                                                                ul: ({ children }) => (
                                                                    <ul className="list-disc pl-6 my-3">
                                                                        {children}
                                                                    </ul>
                                                                ),

                                                                ol: ({ children }) => (
                                                                    <ol className="list-decimal pl-6 my-3">
                                                                        {children}
                                                                    </ol>
                                                                ),

                                                                li: ({ children }) => (
                                                                    <li className="mb-2">
                                                                        {children}
                                                                    </li>
                                                                ),

                                                                h1: ({ children }) => (
                                                                    <h1 className="text-3xl font-bold mb-2 mt-3">
                                                                        {children}
                                                                    </h1>
                                                                ),

                                                                h2: ({ children }) => (
                                                                    <h2 className="text-2xl font-semibold mb-2 mt-3 ">
                                                                        {children}
                                                                    </h2>
                                                                ),

                                                                h3: ({ children }) => (
                                                                    <h3 className="text-xl font-semibold mb-1 mt-2">
                                                                        {children}
                                                                    </h3>
                                                                ),
                                                                p: ({ children }) => (
                                                                    <p className="mb-0 leading-5">
                                                                        {children}
                                                                    </p>
                                                                ),
                                                                pre: ({ children }) => (
                                                                    <pre className="bg-[#0d1117] rounded-lg p-4 overflow-x-auto my-4 ">
                                                                        {children}
                                                                    </pre>
                                                                ),

                                                                code: ({ className, children }) => (
                                                                    <code className={className}>
                                                                        {children}
                                                                    </code>
                                                                ),
                                                            }}
                                                        >
                                                            {m.content}
                                                        </ReactMarkdown>
                                                    ) : (
                                                        m.content
                                                    )
                                                }
                                            </div>

                                        </div>

                                        <button
                                            onClick={() => handleCopyMessage(m.content)}
                                            className={`absolute -bottom-3 ${m.role === "user"
                                                ? "right-0"
                                                : "left-0"
                                                } opacity-0 group-hover:opacity-100 transition p-2 rounded-full ${darkMode
                                                    ? "bg-[#2b2b2b] hover:bg-[#3b3b3b]"
                                                    : "bg-gray-200 hover:bg-gray-300"
                                                }`}
                                        >
                                            <FiCopy size={15} />
                                        </button>

                                    </div>
                                </div>
                            ))}
                            { }
                            {isLoading && (

                                <div className="flex justify-start">

                                    <div className={`
px-5
py-4
rounded-2xl
animate-pulse

${darkMode
                                            ?
                                            "bg-[#1d1d1d]"
                                            :
                                            "bg-gray-300"
                                        }
`}>
                                        <div className="h-3 bg-gray-400 rounded w-full mb-3"></div>
                                        <div className="h-3 bg-gray-400 rounded w-4/5 mb-3"></div>
                                        <div className="h-3 bg-gray-400 rounded w-2/3"></div>

                                        Thinking...

                                    </div>

                                </div>

                            )}

                            <div ref={messagesEndRef}></div>

                        </div>

                    )}

                </div>

                {/* ================= INPUT ================= */}

                <form
                    onSubmit={handleSendMessages}
                    className={`
    sticky
    bottom-0
    border-t
    px-4
    md:px-8
    py-5

    ${darkMode
                            ? "bg-[#0f0f0f] border-[#2b2b2b]"
                            : "bg-[#f7f7f8] border-gray-300"
                        }
    `}
                >

                    <div
                        className={`
        max-w-5xl
        mx-auto

        flex
        items-end
        gap-3

        rounded-3xl

        px-5

        py-3

        border

        transition

        ${darkMode
                                ? "bg-[#1b1b1b] border-[#2b2b2b]"
                                : "bg-white border-gray-300"
                            }
        `}
                    >

                        <input
                            type="file"
                            hidden
                            ref={fileInputRef}
                            accept="image/*"
                            onChange={handleFileSelect}
                        />
                        <button
                            type="button"
                            onClick={() => fileInputRef.current.click()}
                            className="text-2xl px-2"
                        >
                            +
                        </button>

                        {selectedImage && (
                            <div className="flex items-center gap-2 px-2 py-1 bg-gray-700 rounded">
                                <span className="text-sm">📷 {selectedImage.name}</span>

                                <button
                                    type="button"
                                    onClick={() => setSelectedImage(null)}
                                    className="text-red-400"
                                >
                                    ✕
                                </button>
                            </div>
                        )}

                        <textarea
                            rows={1}
                            value={messageText}
                            onChange={(e) => dispatch(setMessageText(e.target.value))}
                            onInput={(e) => {
                                e.target.style.height = "auto";
                                e.target.style.height = e.target.scrollHeight + "px";
                            }}
                            placeholder="Ask anything..."
                            className={`
            flex-1

            resize-none

    

            bg-transparent

            outline-none

            text-base

            ${darkMode
                                    ? "text-white placeholder-gray-500"
                                    : "text-black placeholder-gray-500"
                                }

            `}
                        />

                        <button
                            disabled={isLoading || !messageText.trim()}

                            type="submit"



                            className={`
            h-11
            w-11

            rounded-full

            flex

            items-center

            justify-center

            transition
            cursor-pointer

            ${messageText.trim()

                                    ?

                                    "bg-blue-400 hover:bg-blue-700 text-white"

                                    :

                                    "bg-gray-500 text-gray-300 cursor-not-allowed"
                                }

            `}
                        >
                            {isLoading ? "..." : "➜"}



                        </button>

                    </div>

                </form>
            </section>
        </main>
    )


}


export default Dashboard
