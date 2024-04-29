"use client";
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
  updateDoc,
} from "firebase/firestore";
import { addDataToFireStore } from "@/model";
import { checkout } from "./components/checkout";
import React, { useState, useEffect } from "react";
import { FloatingNav } from "./components/ui/floating-navbar";
import { BackgroundBeams } from "./components/ui/background-beams";
import { TextGenerateEffect } from "./components/ui/text-generate-effect";
import { LayoutGrid } from "./components/ui/layout-grid";
import ContactUs from "./components/ui/contactus";
import Lottie from "lottie-react";
import ws from "../../public/ws.json";
import connect from "../../public/connect.json";
import vr from "../../public/vr.json";
import app from "../../config";
import signin from "../../public/signin.json";
import { sentences, navItems, items, cards } from "../../public/staticData";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";

import { useRouter } from "next/navigation";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";

export default function Home() {
  const [user, setUser] = useState(null);

  const [couponCode, setCouponCode] = useState("");
  const auth = getAuth(app);
  const [plan, setPlan] = useState("");
  const router = useRouter();
  const [pay, setPay] = useState(false);
  async function getPlan(user) {
    if (user != null) {
      const firestore = getFirestore();
      const clusterRef = collection(firestore, user.uid);

      // Check if the collection with the specified cluster (user.uid) exists
      const clusterSnapshot = await getDocs(clusterRef);
      const existingDoc = clusterSnapshot.docs[0]; // Assuming there's only one document per cluster
      if (existingDoc) {
        console.log(existingDoc.data().plan);
        setPlan(existingDoc.data().plan);
      }
    }
  }
  useEffect(() => {
    // if (user != JSON.parse(localStorage.getItem("user"))) {
    const auth = getAuth();
    const storedUser = localStorage.getItem("user");
    // getPlan(user);
    console.log(storedUser);
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      getPlan(user);
      console.log("here,s the plan--", plan);
    }
    // }
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser && plan !== "") {
        await addDataToFireStore(
          authUser.displayName,
          authUser.email,
          plan,
          authUser.uid
        );
        setUser(authUser);
        // getPlan(user);

        const firestore = getFirestore();
        const clusterRef = collection(firestore, authUser.uid);

        // Check if the collection with the specified cluster (user.uid) exists
        const clusterSnapshot = await getDocs(clusterRef);
        console.log(clusterSnapshot);
        const existingDoc = clusterSnapshot.docs[0]; // Assuming there's only one document per cluster
        if (existingDoc) {
          // console.log(existingDoc.data().plan);
          setPlan(existingDoc.data().plan);
        }

        console.log("he", plan);
        localStorage.setItem("user", JSON.stringify(authUser));
      } else {
        setUser(null);
        localStorage.removeItem("user");
      }
    });

    return () => unsubscribe(); // Unsubscribe the listener on component unmount
  }, [plan, user]);
  const signInWithGoogle = async (userPlan) => {
    // setPlan(userPlan);
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      setPlan(userPlan);

      router.push("/");
    } catch (error) {
      console.error("error Signing with google ", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/");
    } catch (error) {
      console.error("Error logging out:", error.message);
    }
  };

  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSentenceIndex((prevIndex) =>
        prevIndex === sentences.length - 1 ? 0 : prevIndex + 1
      );
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  // Example items array for the AnimatedTooltip component

  function handleit(e) {
    e.preventDefault();
    setCouponCode((prev) => prev + " ");
    if (couponCode == "AnayIsGreat") {
      console.log("applied hai bhai");
      signInWithGoogle("Premium");
    }
    setPay(false);
  }

  return (
    <div className="bg-black flex flex-col items-center justify-center"
   >
      {/* <FloatingNav navItems={navItems} /> */}
      <nav className="navbar   w-[100%]"
       style={{
        WebkitBackdropFilter: "blur(10px)", // for Safari
        backdropFilter: "blur(10px)",
       }}>
      <div className="navbar-left">
      <span className="company-name text-5xl">Adira</span>
              <span></span>
              <span className="text-sm	text-slate-600"> 1.0</span>
      </div>
      <div className="navbar-right">
        <button className="navbar-button " onClick={()=>router.push("/aboutus")}>{`About Us ↗`}</button>
        <button className="navbar-button " onClick={()=>router.push("/adira")}>{`Try Adira ↗`}</button>
        <button className="navbar-button " onClick={()=>router.push("/f&q")}>{`F&Q ↗`}</button>
      </div>
    </nav>
      {/* home section */}
      <div className="block">
        <div className="h-screen flex items-center justify-center">
          {/* <BackgroundBeams className="h-screen w-screen" /> */}
          <div className="text-center">
            <p className="text-xl font-bold text-gray-400 mb-6">
              {` INDIA's First AI for Women`}{" "}
            </p>
            <p
              className="text-sm text-gray-600 mb-6"
              style={{ wordSpacing: "30px" }}
            >
              I N T R O D U C I N G{" "}
            </p>

            <h1
              className="text-[10rem] font-bold mb-4"
              style={{
                background: "linear-gradient(to bottom, #8c8c8c, #000000)",
                WebkitBackgroundClip: "text",
                color: "transparent",
              }}
            >
              ADIRA
            </h1>
            <TextGenerateEffect
              className="text-x text-gray-300 mb-6"
              words={sentences[currentSentenceIndex]}
            />
            <button
              type="button"
              onClick={() => router.push("/adira")}
              className="bg-slate-500 text-white py-3 px-6 rounded-full hover:bg-gray-300 transition duration-300 ease-in-out "
              style={{
                background: "linear-gradient(to bottom, #8c8c8c, #000000)",
                zIndex: "999", // Adjust the value as needed
                position: "relative", // Ensure it respects z-index
              }}
            >
              {`ADIRA  ↗`}
            </button>
          </div>
          <BackgroundBeams className="" />
        </div>{" "}
      </div>
      <div className="border-t  from-blue-900 to-zinc-600 border-white  w-[80%]"></div>

      {/* <br />
      <br />
      <br />
      <br /> */}
      <div className="text-center   flex items-center justify-center flex-col h-[160vh] ">
        {/* <LampContainer/> */}
        <div className="text-center">
          <h2
            className="text-[100px] font-bold   "
            style={{
              background: "linear-gradient(to bottom, #8c8c8c, #000000)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Our Plan{" "}
          </h2>
          {/* <div class="relative text-gray-900">
  <span class="absolute left-0 w-10 h-full bg-gradient-to-b from-transparent to-white opacity-0 animate-smoke"></span>
  Your Text Here
</div> */}
        </div>
        {!user ? (
          <div>
            <div>
              <div className="container mx-auto px-6 py-12 flex flex-wrap">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                  <div className=" rounded-lg border text-slate-400 w-[90%]">
                    <h3 className="relative font-bold text-2xl mb-4 text-white p-3 py-9 ">
                      Emergency
                    </h3>
                    <br />
                    <p className="text-lg">
                      {`Experinec our services free without signup Avail free Tokenn to get the query generated by oADIRA 
                `}
                    </p>
                    <br />
                    <h2
                      className="relative font-bold text-4xl text- "
                      style={{
                        background:
                          "linear-gradient(to bottom, #8c8c8c, #000000)",
                        WebkitBackgroundClip: "text",
                        color: "transparent",
                      }}
                    >
                      {`@₹0`}
                    </h2>

                    <br />
                    <div className="flex justify-center items-center">
                      <div className="text-left">
                        <p className="text-lg">{`✖ 5 Token Only`}</p>
                        <p className="text-lg">{`✖ Consult Us`}</p>
                        <p className="text-lg">{`✔ No Sign In Required`}</p>
                      </div>
                    </div>

                    <br />
                    <br />

                    <div className="">
                      <div className="grid gap-8 items-start justify-center">
                        <div className="relative group">
                          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-900 to-zinc-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
                          <button
                            onClick={() => router.push("/panic")}
                            className="relative px-7 py-4 bg-black rounded-lg leading-none flex items-center divide-x divide-gray-600"
                          >
                            <span className="flex items-center space-x-5">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="w-6 h-6 h-6 w-6 text-zinc-600 -rotate-6"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z"
                                />
                              </svg>

                              <span className="pr-6 text-gray-100">Panic</span>
                            </span>
                            <span className="pl-6 text-blue-900 group-hover:text-gray-100 transition duration-200">
                              &rarr;
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className=" rounded-lg border text-slate-400 w-[90%]">
                    <h3 className="relative font-bold text-2xl mb-4 text-white p-3 py-9 ">
                      Pro
                    </h3>
                    <br />
                    <p className="text-lg">
                      {`Experinec our services free without signup Avail free Tokenn to get the query generated by oADIRA 
                `}
                    </p>
                    <br />
                    <h2
                      className="relative font-bold text-4xl text- "
                      style={{
                        background:
                          "linear-gradient(to bottom, #8c8c8c, #000000)",
                        WebkitBackgroundClip: "text",
                        color: "transparent",
                      }}
                    >
                      {`@₹0`}
                    </h2>

                    <br />
                    <div className="flex justify-center items-center">
                      <div className="text-left">
                        <p className="text-lg">{`✔ Unlimited Token`}</p>
                        <p className="text-lg">{`✖ Consult Us`}</p>
                        <p className="text-lg">{`✔ Sign In Required`}</p>
                      </div>
                    </div>
                    <br />

                    <br />

                    <div className="">
                      <div className="grid gap-8 items-start justify-center">
                        <div className="relative group">
                          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-900 to-zinc-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
                          <button
                            onClick={() => {
                              signInWithGoogle("Pro");
                            }}
                            className="relative px-7 py-4 bg-black rounded-lg leading-none flex items-center divide-x divide-gray-600"
                          >
                            <span className="flex items-center space-x-5">
                              {/* <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-pink-600 -rotate-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>  */}
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="w-6 h-6 h-6 w-6 text-zinc-600 -rotate-6"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z"
                                />
                              </svg>

                              <span className="pr-6 text-gray-100">Pro</span>
                            </span>
                            <span className="pl-6 text-blue-900 group-hover:text-gray-100 transition duration-200">
                              &rarr;
                            </span>
                          </button>
                        </div>
                      </div>
                      <br />
                    </div>
                  </div>{" "}
                  <div className=" rounded-lg border text-slate-400 w-[90%]">
                    <h3 className="relative font-bold text-2xl mb-4 text-white p-3 py-9 ">
                      Premium
                    </h3>
                    <br />
                    <p className="text-lg">
                      {`Experinec our services free without signup Avail free Tokenn to get the query generated by oADIRA 
                `}
                    </p>
                    <br />
                    <h2
                      className="relative font-bold text-4xl text- "
                      style={{
                        background:
                          "linear-gradient(to bottom, #8c8c8c, #000000)",
                        WebkitBackgroundClip: "text",
                        color: "transparent",
                      }}
                    >
                      {`@₹99`}
                    </h2>

                    <br />
                    <div className="flex justify-center items-center">
                      <div className="text-left">
                        <p className="text-lg">{`✔ Unlimited Token`}</p>
                        <p className="text-lg">{`✔ Consult Us`}</p>
                        <p className="text-lg">{`✔ Sign In Required`}</p>
                      </div>
                    </div>
                    <br />
                    <br />

                    <div className="">
                      <div className="grid gap-8 items-start justify-center">
                        <div className="relative group">
                          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-900 to-zinc-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
                          <button
                            onClick={() => {
                              // console.log("ek do teen");
                              setPay(true);

                              setCouponCode("");
                            }}
                            className="relative px-7 py-4 bg-black rounded-lg leading-none flex items-center divide-x divide-gray-600"
                          >
                            <span className="flex items-center space-x-5">
                              {/* <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-pink-600 -rotate-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>  */}
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="w-6 h-6 h-6 w-6 text-zinc-600 -rotate-6"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z"
                                />
                              </svg>

                              <span className="pr-6 text-gray-100">
                                Premium
                              </span>
                            </span>
                            <span className="pl-6 text-blue-900 group-hover:text-gray-100 transition duration-200">
                              &rarr;
                            </span>
                          </button>
                        </div>
                      </div>
                      <br />
                      <br />
                      <br />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {pay && (
              <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center">
                <div className="cursor-pointer" onClick={() => setPay(false)}>
                  {`❌`}
                </div>
                <div className="bg-white p-8 rounded-md shadow-lg">
                  <h2 className="text-xl font-bold mb-4">
                    Premium Subscription
                  </h2>
                  <button
                    onClick={() => {

                  

                      checkout({
                        lineItems: [
                          {
                            price: "price_1P8QUrSJZsRaoKNmBKJctE2k",
                            quantity: 1,
                          },
                        ],
                      });
                    }}
                    className="bg-blue-500 hover:bg-blue-50 text-black font-bold py-2 px-4 rounded mr-4"
                  >
                    Buy Premium
                  </button>
                  <form onSubmit={handleit} className="flex">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Enter coupon code"
                      className="border text-stone-950 border-gray-400 p-2 rounded-l-md focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="bg-blue-500 hover:bg-blue-50 text-black font-bold py-2 px-4 rounded-r-md"
                    >
                      Apply
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        ) : (
          // Render this section if user is authenticated
          <div className="bg-black text-slate-400 rounded-lg border text-with-smoke   h-[90vh] m-8 w-[80vw] flex justify-items-start">
            {pay && (
              <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center">
                <div className="bg-white p-8 rounded-md shadow-lg flex-col ">
                  <div className=" flex gap-3 w-[100%] ">
                    <h2 className="text-xl font-bold mb-4">
                      Premium Subscription
                    </h2>
                    <div
                      className="cursor-pointer mx-9"
                      onClick={() => setPay(false)}
                    >
                      {`❌`}
                    </div>
                  </div>
                  <button
                    onClick={()=>{
                      checkout({
                        lineItems: [
                          {
                            price: "price_1P8QUrSJZsRaoKNmBKJctE2k",
                            quantity: 1,
                          },
                        ],
                      });
                    }}
                    className="bg-blue-500 hover:bg-blue-50 text-black font-bold py-2 px-4 rounded mr-4"
                  >
                    Buy Premium
                  </button>
                  <div>O R</div>
                  <form onSubmit={handleit} className="flex">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Enter coupon code"
                      className="border text-stone-950 border-gray-400 p-2 rounded-l-md focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="bg-blue-500 hover:bg-blue-50 text-black font-bold py-2 px-4 rounded-r-md"
                    >
                      Apply
                    </button>
                  </form>
                </div>
              </div>
            )}
            <div className="w-[50%] flex-col p-5">
              <p>
                {`Welcome to ADIRA, your reliable safety companion. We're thrilled
                you've joined us! With ADIRA, your safety is our top priority.
                Whether you're walking alone or need assistance, we've got you
                covered. Feel empowered with real-time support, emergency
                contacts, and valuable safety tips. Our dedicated team is here
                to ensure your peace of mind every step of the way. Thank you
                for choosing ADIRA - together, we'll navigate life's journey
                with confidence and security. Stay safe with ADIRA by your side.
                Welcome aboard!`}
              </p>
              <p>
                Thanks for signing in, {user.displayName}! <br />
                <br />
                Your Curently using {plan}Plan
                <br />
              </p>
              <br />
              <br />
              <br />

              <button
                onClick={() => router.push("/adira")}
                className="text-white underline hover:text-lg"
              >
                {`Try Adira ↗`}
              </button>
              <br />
              <div className="rounded-lg shadow-md">
                {/* <h1 className="text-3xl font-bold mb-4"> {user ? " " : "Guest"}!        </h1> */}
                <button
                  onClick={handleLogout}
                  className="text-white underline hover:text-lg"
                >
                  Logout
                </button>
              </div>
            </div>
            <div className="w-[50%] ">
              <Lottie animationData={signin} />
              <div className="h-[20%]">{``}</div>
            {plan == "Pro" ? (
              <>
               <button
                  onClick={() => {
                    // console.log("ek do teen");
                    setPay(true);
                  }}
                  className="bg-black border my-[-100px]  hover:bg-zinc-400 text-white font-bold py-2 px-4 rounded-r-md"
                >
                  Sign in with Google-premium
                </button>
                <br />

                {pay && (
              <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center">
                <div className="bg-white p-8 rounded-md shadow-lg flex-col ">
                  <div className=" flex gap-3 w-[100%] ">
                    <h2 className="text-xl font-bold mb-4">
                      Premium Subscription
                    </h2>
                    <div
                      className="cursor-pointer mx-9"
                      onClick={() => setPay(false)}
                    >
                      {`❌`}
                    </div>
                  </div>
                  <button
                    onClick={()=>{
                      checkout({
                        lineItems: [
                          {
                            price: "price_1P8QUrSJZsRaoKNmBKJctE2k",
                            quantity: 1,
                          },
                        ],
                      });
                    }}
                    className="bg-blue-500 hover:bg-blue-50 text-black font-bold py-2 px-4 rounded mr-4"
                  >
                    Buy Premium
                  </button>
                  <div>O R</div>
                  <form onSubmit={handleit} className="flex">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Enter coupon code"
                      className="border text-stone-950 border-gray-400 p-2 rounded-l-md focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="bg-blue-500 hover:bg-blue-50 text-black font-bold py-2 px-4 rounded-r-md"
                    >
                      Apply
                    </button>
                  </form>
                </div>
              </div>
            )}
              </>
            ) : (
              ""
            )}
            </div>
          </div>
        )}
      </div>
      <div className="border-t  from-blue-900 to-zinc-600 border-white  w-[80%]"></div>

      <div className="text-center">
        <h2
          className="text-[100px] font-bold"
          style={{
            background: "linear-gradient(to bottom, #8c8c8c, #000000)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Top FEATURES
        </h2>
      </div>
      {/* Feature section */}

      <div>
        {/* <div> */}
        <div className="mx-auto px-6 py-12 flex-row flex-wrap w-[95%] ">
          <div className="">
            <div className=" rounded-lg border text-slate-400 w-[100%] flex text-with-smoke ">
              <div className="flex-col flex-wrap w-[50%] centeralign p-9 ">
                <h3 className="relative font-bold text-5xl mb-4 text-white ">
                  Women Safety AI Chatbot
                </h3>
                <br />
                <p className="text-lg  ">
                  {`With cutting-edge Artificial Intelligence technology, our
                chatbot provides a safe and confidential space for women to seek
                assistance, access resources, and receive support in moments of
                need.`}
                </p>
              </div>
              <div className="w-[40%] h-[40%] m-0">
                <Lottie animationData={ws} />
              </div>
            </div>
            <br />
            <br />

            <div className=" rounded-lg border text-slate-400 w-[100%] flex text-with-smoke ">
              <div className="w-[40%] h-[40%] m-0">
                <Lottie animationData={vr} />
              </div>
              <div className="flex-col flex-wrap w-[50%] centeralign p-9 ">
                <h3 className="relative font-bold text-5xl mb-4 text-white ">
                  Voice Commands...
                </h3>
                <br />
                <p className="text-lg">
                  {`With cutting-edge Artificial Intelligence technology, our
                chatbot provides a safe and confidential space for women to seek
                assistance, access resources, and receive support in moments of
                need.`}
                </p>
              </div>
            </div>
            <br />
            <br />

            <div className=" rounded-lg border text-slate-400 w-[100%] flex text-with-smoke ">
              <div className="flex-col flex-wrap w-[50%] centeralign p-9 ">
                <h3 className="relative font-bold text-5xl mb-4 text-white ">
                  Connect to Advocates
                </h3>
                <br />
                <p className="text-lg  ">
                  {`With cutting-edge Artificial Intelligence technology, our
                chatbot provides a safe and confidential space for women to seek
                assistance, access resources, and receive support in moments of
                need.`}
                </p>
              </div>
              <div className="w-[40%] h-[40%] m-0">
                <Lottie animationData={connect} />
                {/* <Lottie animationData={ws} /> */}
              </div>
            </div>
            <br />
            <br />
          </div>
        </div>
        {/* </div> */}
      </div>
      <div className="border-t  from-blue-900 to-zinc-600 border-white  w-[80%]"></div>

      <ContactUs />
    </div>
  );
}
