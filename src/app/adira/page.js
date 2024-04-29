"use client";
import React, { useState, useEffect, useRef } from "react";
// import { db } from "../../../config";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  where,
  getFirestore,
  getDoc,
} from "firebase/firestore";
import Lottie from "lottie-react";
import load from "../../../public/load.json";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import app from "../../../config";
import {
  getDocumentById,
  deleteCollection,
  fetchDocsfromFireStore,
  addTheDataToFireStore,
} from "@/model";
import { userImage, adiraImage } from "../../../public/staticData";

export default function GetData() {
  const [query, setQuery] = useState("");
  // const [output, setOutput] = useState("Namaskar bheno aur bhaiyo");
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState("");
  const [chat, setChat] = useState([
    {
      role: "Adira",
      message: "Hi welcome to adira our own women ki baatchit",
    },
  ]);
  // let parsedChat = {};
  const messagesEndRef = useRef(null);
  const [showContactForm, setShowContactForm] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const recognition = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const auth = getAuth(app);
  const [image, setImage] = useState(userImage);

  const router = useRouter();
  const [user, setUser] = useState(null);
  const [fsdata, setFsdata] = useState("abhi toh empty hai bhai ..... ");

  async function getPlan(user) {
    const firestore = getFirestore();
    const clusterRef = collection(firestore, user.uid);

    const clusterSnapshot = await getDocs(clusterRef);
    const existingDoc = clusterSnapshot.docs[0];
    console.log(existingDoc.data().plan);
    setPlan(existingDoc.data().plan);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setEmail(currentUser.email);
        setName(currentUser.displayName);
        getPlan(currentUser);
        setImage(currentUser.photoURL);
      } else {
        // router.push("/");
        const test = 0;
      }
    });
    console.log("ye lo user lelo user", user);

    return () => unsubscribe();
  }, [user]);
  console.log("Initial user state:", user);
  useEffect(() => {
    async function getData() {
      async function fetchstoredData() {
        // console.log(user.uid)
        console.log("ye lo user lelo user      hjfcig", user);
        // const uid=await user.uid;
        const data = await fetchDocsfromFireStore(user.uid);
        console.log("yehhdhhd", data);
        setFsdata(data);
        return data;
      }
      if (user != null) {
        const data = await fetchstoredData();
        console.log(" FS DATA ==  ", data[0].id);
        const obj = await getDocumentById(user.uid, data[0].id);
        const savedChat = obj.chat;
        console.log("yuegyug", savedChat);
        setChat(savedChat);
      }
    }
    getData();
  }, [user]);
  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/");
    } catch (error) {
      console.error("Error logging out:", error.message);
    }
  };

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

  async function fetchData() {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: query }),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const responseData = await response.json();
      const { message } = responseData;

      const command = JSON.stringify({ QUERY: query, MESSAGE: message });
      // setLoading(true);
      const response_new = await fetch("https://adira-interface.vercel.app/api", {
        
        // const response_new = await fetch(`${window.location.origin}/api`, {
          
          // const response_new = await fetch("http://localhost:3000/api", {
        mode: 'no-cors',
        method: "POST",
        body: command,
      });
      const data = await response_new.json();

      console.log("data hai yeh bhai ", data);
      const message_new = data.RESULT;
      console.log("new message hai yeh bhai ", message_new);

      setChat((prevChat) => [
        ...prevChat,
        {
          role: "Adira",
          message: message_new,
        },
      ]);
      storeChatData(query, message_new);
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    } finally {
      setLoading(false);
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) {
      return;
    }
    setChat((prevChat) => [
      ...prevChat,
      {
        role: "user",
        message: query, // User's profile picture URL
      },
    ]);
    setQuery("");
    fetchData();
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const handleContactFormSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      return;
    }

    const success = await addTheDataToFireStore(
      name,
      email,
      chat,
      plan,
      "consultUsData"
    );
    if (success) {
      console.log("success he bhai success hehehe .");
      setShowContactForm(false); // Close the contact form after submission
    } else {
      console.log("Bhai BT hai kya kre ");
    }
  };
  const storeChatData = async (query, message) => {
    const newMessage = {
      role: "Adira",
      message: message,
    };
    const newquery = {
      role: "user",
      message: query, // User's profile picture URL
    };
    const updatedchat = [...chat, newquery, newMessage];

    const result = await deleteCollection(user.uid);

    const success = await addTheDataToFireStore(
      user.displayName,
      user.email,
      updatedchat,
      plan,
      user.uid
    );
    if (success) {
      console.log("success he bhai success hehehe .at ", user.uid);
    } else {
      console.log("Bhai BT hai kya kre ");
    }
  };
  console.log(user);
  return (
    <>
      {user == null ? (
        // <div>Verifying your sign in ...</div>
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-slate-50	 p-8 rounded-lg shadow-md">
            <div className="flex-col justify-between">
              <h2 className="text-2xl font-semibold mb-4 text-black">
                You have not Signed In !!!
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
        <main className="bg-black">
          <nav className="navbar bg-zinc-900">
            <div className="navbar-left">
              <span className="company-name">Adira</span>
              <span></span>
              <span className="text-sm text-slate-700	"> 1.0</span>
            </div>
            <div className="navbar-right">
              <button
                type="button"
                onClick={() => {
                  // handleSubmit()
                  setShowContactForm(true);
                }}
                className={` px-6 py-2 rounded-lg transition-colors w-25 h-10 duration-300 ${
                  plan == "Premium"
                    ? "bg-red-500 text-white hover:bg-yellow-600"
                    : "bg-gray-400 text-gray-600 cursor-not-allowed"
                }`}
                disabled={plan == "Pro"}
              >
                {plan ? "Contact Us" : "Contact Us (Unavailable)"}
              </button>
              <div className=" rounded-lg my-2 ">
                <h1 className="text-3xl font-bold"> {user ? " " : "Guest"} </h1>
                <a
                  href="https://adira-interface.vercel.app/"
                  
                  // href="http://localhost:3000/"
                  className=" navbar-button bg-slate-600  hover:bg-slate-400 text-black font-bold py-2 px-4 rounded"
                >
                  {`Upgrade`}
                </a>
              </div>
              {/* <div className="p-8 rounded-lg shadow-md"> */}
              {/* <h1 className="text-3xl font-bold mb-4"> {user ? " " : "Guest"}!        </h1> */}
              <button
                onClick={handleLogout}
                className=" navbar-button bg-slate-600  hover:bg-slate-400 text-white font-bold  rounded"
              >
                Logout
              </button>
              {/* </div> */}
            </div>
          </nav>

          <div className={`mb-[10vw]`}>
            {chat.map((message, index) => (
              <div key={index}>
                {message.role === "Adira" && (
                  <div className="flex items-center">
                    <img
                      src={adiraImage}
                      alt="Profile Pic"
                      className="w-10 h-10 rounded-full ml-3"
                    />
                    <div
                      className={`text-white p-2 rounded-lg max-w-[70%] mb-2 ${
                        message.role === "user"
                          ? "bg-slate-600 self-end text-right ml-auto mr-[5%]"
                          : "bg-black self-start ml-[5%] mt-6 "
                      }`}
                    >
                      {message.message}
                    </div>
                  </div>
                )}
                {message.role === "user" && (
                  <div className="flex items-center justify-end">
                    <div
                      className={`text-white p-2 rounded-lg max-w-[70%] mb-2 bg-slate-600 self-end text-right ml-auto mr-[5%]`}
                    >
                      {message.message}
                    </div>
                    <img
                      src={image}
                      alt="Profile Pic"
                      className="w-10 h-10 rounded-full mr-4"
                    />
                    {/* {console.log(user.photoUrl)} */}
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
            className="fixed bottom-0 left-0 w-full  "
          >
            <div className=" flex items-center">
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
                className="ml-4 bg-blue-900 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300"
                disabled={loading} // Disable the button when loading is true
              >
                {loading ? (
                  "Loading...."
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    class="w-6 h-6"
                  >
                    <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
                  </svg>
                )}{" "}
                {/* Change button text when loading */}
              </button>
              {!isRecording && (
                <button
                  type="button"
                  onClick={startSpeechRecognition}
                  className={`ml-4 bg-slate-900 text-white px-6 py-2 rounded-lg hover:bg-slate-600 transition-colors duration-300
                 `}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    class="w-6 h-6"
                  >
                    <path d="M8.25 4.5a3.75 3.75 0 1 1 7.5 0v8.25a3.75 3.75 0 1 1-7.5 0V4.5Z" />
                    <path d="M6 10.5a.75.75 0 0 1 .75.75v1.5a5.25 5.25 0 1 0 10.5 0v-1.5a.75.75 0 0 1 1.5 0v1.5a6.751 6.751 0 0 1-6 6.709v2.291h3a.75.75 0 0 1 0 1.5h-7.5a.75.75 0 0 1 0-1.5h3v-2.291a6.751 6.751 0 0 1-6-6.709v-1.5A.75.75 0 0 1 6 10.5Z" />
                  </svg>
                </button>
              )}
              {showContactForm && (
                <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
                  <div className="bg-slate-50	 p-8 rounded-lg shadow-md">
                    <div className="flex justify-between">
                      <h2 className="text-2xl font-semibold mb-4 text-black">
                        Contact Us
                      </h2>
                      <div
                        className="cursor-pointer"
                        onClick={() => setShowContactForm(false)}
                      >
                        {`❌`}
                      </div>
                    </div>
                    <div className="flex justify-center items-center">
                      <div
                        // onSubmit={handleContactFormSubmit}
                        className=" shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-md"
                      >
                        <div className="mb-4">
                          <label
                            htmlFor="name"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Name
                          </label>
                          <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="mt-1 p-2 w-full text-gray-800 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-500"
                          />
                        </div>
                        <div className="mb-4">
                          <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Email
                          </label>
                          <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 p-2 w-full text-gray-800 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-500"
                          />
                        </div>
                        <button
                          type="submit"
                          onClick={handleContactFormSubmit}
                          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300"
                        >
                          Submit
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* -------------------- contact form -------------------- */}

              {/* Existing form code here */}

              {/* Existing buttons and logout code */}

              {/* -------------------------not RECORDING-----------------------------  */}

              {/* -------------------------RECORDING-----------------------------  */}

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

              {/* ------------------------- LOGOUT -----------------------------  */}

              {/* -------------------------CLEAR CHAT-----------------------------  */}

              <div className="p-8 rounded-lg shadow-md">
                {/* <h1 className="text-3xl font-bold mb-4"> {user ? " " : "Guest"}!        </h1> */}
                <button
                  onClick={() => {
                    setChat([
                      {
                        role: "Adira",
                        message:
                          "Hi welcome to adira our own women ki baatchit",
                      },
                    ]);
                  }}
                  className="bg-slate-900 hover:bg-slate-600 text-black font-bold py-2 px-4 rounded"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    className=" text-white w-6 h-6"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </form>
        </main>
      )}
    </>
  );
}
