"use client";
import React, { useState, useEffect, useRef } from "react";
import { db } from "../../../config";
import { collection, addDoc, getDocs,deleteDoc,doc,query, where, getFirestore,getDoc  } from "firebase/firestore";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import app from "../../../config";
import { Coming_Soon } from "next/font/google";

async function getDocumentById(collectionPath, documentId) {
  const firestore = getFirestore();
  const documentRef = doc(firestore, collectionPath, documentId);

  try {
    const docSnapshot = await getDoc(documentRef);

    if (docSnapshot.exists()) {
      // Document exists, return the document data
      return { id: docSnapshot.id, ...docSnapshot.data() };
    } else {
      // Document does not exist
      console.log(`Document with ID '${documentId}' does not exist in collection '${collectionPath}'`);
      return null;
    }
  } catch (error) {
    console.error(`Error fetching document: ${error}`);
    return null;
  }
}

async function deleteCollection(collectionPath) {
  const firestore = getFirestore();

  // Create a query to get all documents in the collection
  const q = query(collection(firestore, collectionPath));

  try {
    const querySnapshot = await getDocs(q);

    // Delete each document in the collection
    querySnapshot.forEach(async (doc) => {
      await deleteDoc(doc.ref);
      console.log(`Document with ID ${doc.id} successfully deleted`);
    });

    // After deleting all documents, delete the collection itself
    await deleteDoc(doc(firestore, collectionPath));
    console.log(`Collection '${collectionPath}' successfully deleted`);
  } catch (error) {
    console.error(`Error removing collection: ${error}`);
  }
  return true;
}


async function fetchDocsfromFireStore(cluster) {
  const querySanpshot = await getDocs(collection(db, cluster));
  console.log("sara data--", querySanpshot);
  const data = [];
  querySanpshot.forEach((doc) => {
    data.push({
      id: doc.id,
      ...doc.data(),
    });
  });
  return data;
}

async function addDataToFireStore(name, email, chat,plan ,cluster) {
  try {
    const docRef = await addDoc(collection(db, cluster), {
      name: name,
      email: email,
      chat: chat,
      plan:plan
    });
    console.log("chat Stored Succesfully ", docRef.id);
    return true;
  } catch (error) {
    console.log("Chat did not stored ", error);
    return false;
  }
}

export default function GetData() {
  const [inputValue, setInputValue] = useState("");
  const [query, setQuery] = useState("");
  const [output, setOutput] = useState("Namaskar bheno aur bhaiyo");
  const [loading, setLoading] = useState(false);
  const [plan,setPlan]=useState("")
  const [chat, setChat] = useState([
    {
      role: "Adira",
      message: "Hi welcome to adira our own women ki baatchit",
    },
  ]);
  let parsedChat = {};
  const messagesEndRef = useRef(null);
  const [showContactForm, setShowContactForm] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const recognition = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const auth = getAuth(app);
  const userImage="https://shorturl.at/noqS3";
  const adiraImage="https://shorturl.at/bCIX1";
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [fsdata, setFsdata] = useState("abhi toh empty hai bhai ..... ");

  async function getPlan(user){
    const firestore = getFirestore();
    const clusterRef = collection(firestore, user.uid);

    const clusterSnapshot = await getDocs(clusterRef);
    const existingDoc = clusterSnapshot.docs[0]; // Assuming there's only one document per cluster
    console.log(existingDoc.data().plan)
    setPlan(existingDoc.data().plan)
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setEmail(currentUser.email);
        setName(currentUser.displayName);
        getPlan(currentUser)
      } else {
        router.push("/");
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
        const data=await fetchstoredData();
        console.log(" FS DATA ==  ", data[0].id);
        const obj= await getDocumentById(user.uid,data[0].id)
        const savedChat=obj.chat
        console.log("yuegyug",savedChat)
        setChat(savedChat)
        // await fetchDocsfromFireStore()
    // console.log(fsdata[0].id)
    // console.log(fsdata[0])

        }
      
    }
    getData();
  }, [user]);
  // console.log(" FS DATA == ", fsdata);
  // useEffect( () => {
    // const storedChat = localStorage.getItem("chat");
    // console.log("stored chat is", storedChat);





    // await fetchDocsfromFireStore()
    // // console.log(fsdata[0].id)
    // console.log(fsdata[0])






    // if (storedChat) {
    //   try {
    //     const parsedChat = JSON.parse(storedChat);
    //     setChat(parsedChat);
    //     console.log(parsedChat, "pojdoj");
    //     console.log("chat is ", chat);
    //   } catch (error) {
    //     console.error("Error parsing stored chat:", error);
    //     // Handle parsing error gracefully, e.g., by setting default chat state
    //     setChat([]);
    //   }
    // } else {
    //   // Handle case where no chat data is stored (initial load or empty storage)
    //   setChat([]);
    // }
  // }, []);

  // useEffect(() => {
  //   console.log("bye");
  //   console.log(chat);
  //   // Save chat state to local storage whenever it changes
  //   localStorage.setItem("chat", JSON.stringify(chat));
  // }, [chat]);

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
      setChat((prevChat) => [
        ...prevChat,
        {
          role: "Adira",
          message: message,
        },
      ]);
      storeChatData(query, message);
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
        message: query,// User's profile picture URL
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



    const success = await addDataToFireStore(
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



   const result = await deleteCollection(user.uid)



    

    const success = await addDataToFireStore(
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
        <div>Verifying your sign in ...</div>
      ) : (
        <main>
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
                          ? "bg-blue-500 self-end text-right ml-auto mr-[5%]"
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
                      className={`text-white p-2 rounded-lg max-w-[70%] mb-2 bg-blue-500 self-end text-right ml-auto mr-[5%]`}
                    >
                      {message.message}
                    </div>
                    <img
                      src={userImage}
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
              <button
      type="button"
      onClick={() => {
        // handleSubmit()
        setShowContactForm(true);
      }}
      className={`ml-4 px-6 py-2 rounded-lg transition-colors duration-300 ${
        plan=="Premium"
          ? 'bg-red-500 text-white hover:bg-yellow-600'
          : 'bg-gray-400 text-gray-600 cursor-not-allowed'
      }`}
      disabled={plan=="Pro"}
    >
      {plan ? 'Contact Us' : 'Contact Us (Unavailable)'}
    </button>
              {/* Existing buttons and logout code */}

              {/* -------------------------not RECORDING-----------------------------  */}

              {!isRecording && (
                <button
                  type="button"
                  onClick={startSpeechRecognition}
                  className={`ml-4 bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors duration-300
                 `}
                >
                  Voice Query
                </button>
              )}

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

              <div className="p-8 rounded-lg shadow-md">
                {/* <h1 className="text-3xl font-bold mb-4"> {user ? " " : "Guest"}!        </h1> */}
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                >
                  Logout
                </button>
              </div>
              <div className="p-8 rounded-lg shadow-md">
                {/* <h1 className="text-3xl font-bold mb-4"> {user ? " " : "Guest"}!        </h1> */}
                <button
                  onClick={()=>{
                    router.push("/")
                  }}
                  className="bg-red-100 underline hover:bg-red-900 text-black font-bold py-2 px-4 rounded"
                >
                  {`Upgrade ↗`} 
                </button>
              </div>

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
                  className="bg-white hover:bg-red-700 text-black font-bold py-2 px-4 rounded"
                >
                  Clear Chat
                </button>
              </div>
            </div>
          </form>
        </main>
      )}
    </>
  );
}
