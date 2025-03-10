"use client";
import { useState, useRef, useEffect } from "react";
import { generateText } from "@/utils/leiam";
import { Send, Clipboard } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const Page = () => {
    const [messages, setMessages] = useState<{ text: string; isBot: boolean; image?: string }[]>([]);
    const [prompt, setPrompt] = useState("");
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!prompt.trim()) return;

        const clientUID = localStorage.getItem("clientUID");
        if (!clientUID) return;

        const userMessage = { text: prompt, isBot: false };
        setMessages((prev) => [...prev, userMessage]);
        setPrompt("");
        setLoading(true);

        try {
            let botMessage: any;
            const response = await generateText(prompt, clientUID);
            botMessage = { text: response || "I didn't understand that.", isBot: true };
            setMessages((prev) => [...prev, botMessage]);
        } catch {
            setMessages((prev) => [...prev, { text: "Error fetching response.", isBot: true }]);
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = (code: string) => {
        navigator.clipboard.writeText(code);
    };

    return (
        <div className="min-h-screen bg-black text-white px-4 pb-20 flex flex-col">
            <div className="text-white pt-6 text-lg font-bold mb-7">
                Chatbot
            </div>

            <div className="flex-1 overflow-y-auto pb-20">
                {messages.length === 0 && (
                    <div className="flex items-center justify-center h-[60vh] text-gray-400 text-lg font-bold">
                        What can I help you today?
                    </div>
                )}
                {messages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.isBot ? "justify-start" : "justify-end"} mb-2`}>
                        <div className={`p-3 max-w-[80%] rounded-lg ${msg.isBot ? "bg-[#0f0f0f] text-white" : "bg-[#262626] text-white"}`}>
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                components={{
                                    strong: ({ children }) => <strong className="text-white">{children}</strong>,
                                    em: ({ children }) => <em className="text-gray-400">{children}</em>,
                                    code({ node, className, children, ...props }: any) {
                                        const isInline = !className;
                                        if (isInline) {
                                            return <code className="bg-[#222] text-green-400 px-1 py-0.5 rounded">{children}</code>;
                                        }
                                        return (
                                            <div className="relative bg-[#131313] p-3 rounded-lg">
                                                <button
                                                    onClick={() => copyToClipboard(String(children))}
                                                    className="absolute top-2 right-2 text-gray-400 hover:text-white transition"
                                                >
                                                    <Clipboard size={16} />
                                                </button>
                                                <pre {...props} className="overflow-x-auto text-green-400">
                                                    <code>{children}</code>
                                                </pre>
                                            </div>
                                        );
                                    }
                                }}
                            >
                                {msg.text}
                            </ReactMarkdown>
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="flex justify-start mb-2">
                        <div className="p-3 bg-[#131313] text-white rounded-lg flex gap-2 items-center animate-pulse w-40 h-10 mb-5"></div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSubmit} className="fixed bottom-16 left-0 right-0 w-full px-4 mb-7">
                <div className="flex items-center bg-[#262626] p-3 rounded-xl w-full max-w-2xl mx-auto">
                    <input 
                        type="text"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        className="flex-1 bg-transparent text-white outline-none px-2"
                        placeholder="Ask anything"
                    />
                    <button type="submit" className="p-2 bg-white text-black rounded-full hover:bg-gray-400 transition">
                        <Send size={20} />
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Page;