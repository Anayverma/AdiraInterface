"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
export default function GetData() {
  const [inputValue, setInputValue] = useState("");
  const [query, setQuery] = useState("");
  const [output, setOutput] = useState("Namaskar bheno aur bhaiyo");
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(0);
  const [chat, setChat] = useState([
    {
      role: "Adira",
      message: "Hi welcome to adira our own women ki baatchit",
      profilePic: "https://shorturl.at/bCIX1",
    },
  ]);
  const messagesEndRef = useRef(null);
  const [principleQuery, setPrincipleQuery] = useState("");
  const recognition = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [targetLanguage, setTargetLanguage] = useState("en");

  const router = useRouter();

  useEffect(() => {
    const storedChat = localStorage.getItem("Panicchat");
    const totcount = localStorage.getItem("Count");

    // console.log("stored chat is", storedChat);
    // console.log("count stored is ", totcount);
    if (totcount) {
      try {
        const parsedCount = JSON.parse(totcount);
        setCount(parsedCount);
        // console.log(parsedCount, "----------------");
        // console.log("Count is ", count);
      } catch (error) {
        console.error("Error parsing stored chat:", error);
        // Handle parsing error gracefully, e.g., by setting default chat state
        setChat([]);
      }
    } else {
      // Handle case where no chat data is stored (initial load or empty storage)
      setChat([]);
    }

    if (storedChat) {
      try {
        const parsedChat = JSON.parse(storedChat);
        if (!parsedChat.length == 0) setChat(parsedChat);
        // console.log(parsedChat, "pojdoj");
        // console.log("chat is ", chat);
      } catch (error) {
        console.error("Error parsing stored chat:", error);
        // Handle parsing error gracefully, e.g., by setting default chat state
        setChat([]);
      }
    } else {
      // Handle case where no chat data is stored (initial load or empty storage)
      setChat([]);
    }
  }, []);

  useEffect(() => {
    // console.log("bye");
    // console.log(chat);
    // console.log(count);
    localStorage.setItem("Panicchat", JSON.stringify(chat));
    localStorage.setItem("Count", JSON.stringify(count));
  }, [chat, count]);
  useEffect(() => {
    recognition.current = new window.webkitSpeechRecognition();
    recognition.current.continuous = false;
    recognition.current.interimResults = false;
    recognition.current.lang = "en-US";
    recognition.current.onresult = handleSpeechRecognitionResult;
    recognition.current.onend = handleSpeechRecognitionEnd;
  }, []);

  const handleSpeechRecognitionResult = (event) => {
    const transcript = event.results[0][0].transcript;
    setQuery(transcript);
    setIsRecording(false);
  };

  const handleSpeechRecognitionEnd = () => {
    setIsRecording(false);
  };

  const startSpeechRecognition = () => {
    setIsRecording(true);
    recognition.current.start();
  };

  // function editQuery() {
  //   for (let i = chat.length - 1; i >= 0; i--) {
  //     if (chat[i].role === "user") {
  //       setQuery(chat[i].message);
  //       break;
  //     }
  //   }
  // }

  async function fetchData() {
    try {
      setLoading(true);
      const response = await fetch("https://adira-model-backend.onrender.com", {
        // const response = await fetch("http://localhost:5000/", {
        // mode: 'no-cors',
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: query }),

      });
      
      // console.log(response)

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const responseData = await response.json();

      const { message } = responseData;

      // console.log("message", message);

      const command = JSON.stringify({ QUERY: query, MESSAGE: message });
      // setLoading(true);
      const response_new = await fetch("https://adira-interface.vercel.app/api", {

      // const response_new = await fetch("http://localhost:3000/api", {
        mode: 'no-cors',
        method: "POST",
        body: command,
      });
      const data = await response_new.json();

      // console.log("data hai yeh bhai ", data);
      const message_new = data.RESULT;
      // console.log("new message hai yeh bhai ", message_new);

      setChat((prevChat) => [
        ...prevChat,
        {
          role: "Adira",
          message: message_new,
          profilePic: "https://shorturl.at/bCIX1", // User's profile picture URL
        },
      ]);
      setCount((e) => e + 1);
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    } finally {
      setLoading(false);
    }
  }

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) {
      return;
    }
    setChat((prevChat) => [
      ...prevChat,
      {
        role: "user",
        message: query,
        profilePic: "https://shorturl.at/noqS3", // User's profile picture URL
      },
    ]);
    setQuery("");
    fetchData();
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  return (
    <>
      {!(count <= 5) ? (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-slate-50	 p-8 rounded-lg shadow-md">
            <div className="flex-col justify-between">
              <h2 className="text-2xl font-semibold mb-4 text-black">
                Your Free Tokens are exhausted !!!
              </h2>
              <button
                className="text-black underline hover:text-lg"
                onClick={() => router.push("/")}
              >
                {`HOME ↗`}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <main>
          <div className={`mb-[10vw]`}>
            {chat.map((message, index) => (
              <div key={index}>
                {message.role === "Adira" && (
                  <div className="flex items-center">
                    <img
                      src={message.profilePic}
                      alt="Profile Pic"
                      className="w-10 h-10 rounded-full ml-3"
                    />
                    <div
                      className={`text-white p-2 rounded-lg max-w-[70%] mb-2 ${
                        message.role === "user"
                          ? "self-end text-right ml-auto mr-[5%]"
                          : "bg-yellow-500 self-start ml-[5%] mt-6 "
                      }`}
                    >
                      {message.message}
                    </div>
                  </div>
                )}
                {message.role === "user" && (
                  <div className="flex items-center justify-end">
                    <div
                      className={`text-white p-2 rounded-lg max-w-[70%] mb-2 bg-blue-900 self-end text-right ml-auto mr-[5%]`}
                    >
                      {message.message}
                    </div>
                    <img
                      src={message.profilePic}
                      alt="Profile Pic"
                      className="w-10 h-10 rounded-full mr-4"
                    />
                    <button
                      type="button"
                      onClick={() => setQuery(message.message)}
                      className="ml-4 bg-black text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300"
                    >
                      ✎
                    </button>
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <form
            onSubmit={handleSubmit}
            className="fixed bottom-0 left-0 w-full  p-4 border-t "
          >
            <div className="max-w-screen-lg mx-auto flex items-center">
              <label className="flex-grow">
                <span className="sr-only">Enter your query:</span>
                <input
                  type="text"
                  name="llmQuery"
                  onChange={(e) => setQuery(e.target.value)}
                  value={query}
                  className="w-full py-2 px-4 border text-slate-800 border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                  placeholder="Please Enter Your Query ..."
                />
              </label>
              <button
                type="submit"
                className="ml-4 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300"
                disabled={loading} // Disable the button when loading is true
              >
                {loading ? "Loading..." : "Submit"}{" "}
                {/* Change button text when loading */}
              </button>

              {!isRecording && (
                <button
                  type="button"
                  onClick={startSpeechRecognition}
                  className={`ml-4 bg-zinc-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors duration-300
                 `}
                >
                  Voice Query
                </button>
              )}

              {isRecording && (
                <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
                  <div className="text-white text-center">
                    <p>Recording...</p>
                    <button
                      type="button"
                      onClick={() => recognition.current.stop()}
                      className="mt-4 bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors duration-300"
                    >
                      Stop Recording
                    </button>
                  </div>
                </div>
              )}
              <div className="ml-4 bg-slate-600 text-white px-6 py-2 rounded-lgtransition-colors duration-300">
                {count}/5 Used
              </div>
              <button
                  type="button"
                  onClick={()=>router.push("/")}
                  className={`ml-4 bg-zinc-900 text-white px-6 py-2 rounded-lg transition-colors duration-300
                 `}
                >
                  Home
                </button>
            </div>
          </form>
        </main>
      )}
    </>
  );
}
