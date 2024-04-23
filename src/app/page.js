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
import { useLocalStorage } from "@uidotdev/usehooks";
import React, { useState, useEffect } from "react";
// import { useLocalStorage } from 'next/hooks';
import { FloatingNav } from "./components/ui/floating-navbar";
import { BackgroundBeams } from "./components/ui/background-beams";
import { TextGenerateEffect } from "./components/ui/text-generate-effect";
import { AnimatedTooltip } from "./components/ui/animated-tooltip";
import { LayoutGrid } from "./components/ui/layout-grid";
import ContactUs from "./components/ui/contactus";
import Lottie from "lottie-react";
import ws from "../../public/ws.json";
import connect from "../../public/connect.json";
import vr from "../../public/vr.json";

import app from "../../config";
import { db } from "../../config";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";

// import { getAuth,signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";

// async function addDataToFireStore(name, email, plan, cluster) {
//   try {
//     const docRef = await addDoc(collection(db, cluster), {
//       name: name,
//       email: email,
//       chat: [],
//       plan: plan,
//     });
//     console.log("chat Stored Succesfully ", docRef.id);
//     return true;
//   } catch (error) {
//     console.log("Chat did not stored ", error);
//     return false;
//   }
// }

const addDataToFirestore = async (name, email, plan, uid) => {
  try {
    const firestore = getFirestore();
    const userCollection = collection(firestore, "users"); // Assuming 'users' is your collection name

    // Add a new document with user data
    const docRef = await addDoc(userCollection, {
      name: name,
      email: email,
      plan: plan,
      uid: uid,
      createdAt: new Date(), // Optional: Add a timestamp for when the document was created
    });

    console.log("Document added with ID: ", docRef.id);
    const result = await addDataToFireStore(name, email, plan, uid);
    return result; // Return success
  } catch (error) {
    console.error("Error adding document: ", error);
    return false; // Return false on error
  }
};

async function addDataToFireStore(name, email, plan, cluster) {
  try {
    const firestore = getFirestore();
    const clusterRef = collection(firestore, cluster);

    // Check if the collection with the specified cluster (user.uid) exists
    const clusterSnapshot = await getDocs(clusterRef);

    if (clusterSnapshot.empty) {
      // Collection does not exist for the specified cluster (user.uid)
      // Proceed to add the document
      const docRef = await addDoc(clusterRef, {
        name: name,
        email: email,
        chat: [
          {
            role: "Adira",
            message: "Hi welcome to adira our own women ki baatchit",
          },
        ],
        plan: plan,
      });
      console.log("Document stored successfully with ID:", docRef.id);
      return true;
    } else {
      // Collection already exists, check for plan upgrade if plan is 'premium'
      const existingDoc = clusterSnapshot.docs[0]; // Assuming there's only one document per cluster
      console.log("jjf", existingDoc.data().plan);
      if (plan == "Premium" && existingDoc.data().plan == "Pro") {
        console.log("pro but prem");
        // Upgrade to 'premium' plan if the existing plan is not 'pro'
        await updateDoc(doc(firestore, cluster, existingDoc.id), {
          plan: "Premium",
        });
        console.log("Account upgraded to premium plan");
      } else {
        // Plan is not 'premium' or account already has 'pro' plan, do not upgrade
        console.log("Plan not upgraded");
      }

      return true; // Return true to indicate document operation was successful
    }
  } catch (error) {
    console.error("Error adding/updating document:", error);
    return false;
  }
}

export default function Home() {
  // const storedUser = localStorage.getItem("user");
  // let initialUser = null;
  
  // try {
  //   if (storedUser) {
  //     initialUser = JSON.parse(storedUser);
  //   }
  // } catch (error) {
  //   console.error("Error parsing user from localStorage:", error);
  // }
  
  // const [user, setUser] = useState(initialUser);

  // const [user, setUser] = useLocalStorage(("user", null));
  const [user,setUser]=useState(null)

  // useEffect(()=>{
  // setUser()

  // },[user])
  const auth = getAuth(app);
  const [plan, setPlan] = useState("");
  const [tempPlan, setTempPlan] = useState("");
  const router = useRouter();
  async function getPlan(user) {
    //   // useEffect(()=>{

    if (user != null) {
      const firestore = getFirestore();
      const clusterRef = collection(firestore, user.uid);

      // Check if the collection with the specified cluster (user.uid) exists
      const clusterSnapshot =await getDocs(clusterRef);
      const existingDoc = clusterSnapshot.docs[0]; // Assuming there's only one document per cluster
      if (existingDoc) {
        console.log(existingDoc.data().plan);
        setPlan(existingDoc.data().plan);
      }
    }
  }
  //       if(plan!=existingDoc.data().plan){
  //         setPlan(existingDoc.data().plan)
  //       }
  //     }
  // },[plan])

  useEffect(() => {
    // if (user != JSON.parse(localStorage.getItem("user"))) {
      const auth = getAuth();
      const storedUser = localStorage.getItem("user");
      // getPlan(user);
      console.log(storedUser)
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
  }, [plan]); // Dependency array with 'plan'

  // useEffect(() => {
  //   // async function storeInitialData(){

  //   async function localUser() {
  //     const storedUser = localStorage.getItem("user");
  //     // await getPlan(user);
  //     if (storedUser) {
  //       const parsedUser = JSON.parse(storedUser);
  //       setUser(parsedUser);
  //       setPlan(parsedUser.plan);
  //     }
  //   }
  //   if(localStorage.getItem("user"))
  //     {localUser()}
  //     else{
  //   const auth = getAuth(app);
  //   const unsubscribe = auth.onAuthStateChanged(async (user) => {
  //     if (user && plan != "") {
  //       const success = await addDataToFireStore(
  //         user.displayName,
  //         user.email,
  //         plan,
  //         user.uid
  //       );
  //       if (success) {
  //         console.log("success he bhai success hehehe .at ", user.uid);
  //         // await getPlan(user);
  //       localStorage.setItem('user', JSON.stringify(user));

  //     } else {
  //         console.log("Bhai BT hai kya kre ");
  //         await getPlan(user);
  //       }
  //       console.log("hruuhfhuiuhhfhffuh", plan);
  //       setUser(user);
  //     } else {
  //       localStorage.removeItem('user');
  //       setUser(null);
  //     }
  //   });
  //   return () => unsubscribe();}
  // }, [plan,user]);
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

  // const router = useRouter();
  const navItems = [
    // { name: (user!=null)?"Sign Out":"Sign In", link: "/" },
    { name: "Try Adira↗ ", link: "/adira" },
    { name: "About Us", link: "/aboutus" },
    { name: "F&Q", link: "/f&q" },
  ];

  const sentences = [
    "1 in 3 women globally has experienced physical or sexual violence in their lifetime (WHO). ",
    "On average, there are about 433,648 victims of rape and sexual assault each year in the US  ",
    "1 in 6 women in the US has experienced stalking victimization ",
    "Globally, about 30% of women have experienced physical and/or sexual violence by their intimate partner (WHO). ",
    "Women and girls represent 71% of human trafficking victims globally (UNODC). ",
    "Approximately 25 million unsafe abortions occur each year, with serious health risks for women (WHO). ",
    "21% of women aged 18 to 29 report being sexually harassed online (Pew Research Center) ",
    "Globally, 12 million girls are married before the age of 18 each year (UNICEF). ",
    "1 in 3 women worldwide has experienced physical or sexual violence in the workplace (ILO). ",
    "Only 52% of women globally believe they have access to justice (UNDP).",
  ];
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
  const items = [
    {
      id: 1,
      name: "Dr. Shipha Suman",
      designation: "Project Head  ",
      image: "https://shorturl.at/noUWX", // Replace with the path to your image
    },
    {
      id: 2,
      name: "Himanshi Raghav",
      designation: "Machine Learning Engineer",
      image: "https://shorturl.at/dJMX3", // Replace with the path to your image
    },
    {
      id: 3,
      name: "Debadrita Dey",
      designation: "Machine Learning Engineer",
      image: "https://shorturl.at/cgvJ2", // Replace with the path to your image
    },
    {
      id: 4,
      name: "Aadyaa Sundriyal",
      designation: "Front End Developer",
      image: "https://shorturl.at/bjFN6", // Replace with the path to your image
    },
    {
      id: 5,
      name: "Pratap Bahadur Singh",
      designation: "Backend Developer",
      image: "https://shorturl.at/gNT69", // Replace with the path to your image
    },
    {
      id: 6,
      name: "Anay Verma",
      designation: "Backend Developer",
      image:
        "https://media.licdn.com/dms/image/D4D35AQGtB8cSGBYyPQ/profile-framedphoto-shrink_400_400/0/1705809413959?e=1711976400&v=beta&t=EtIchbl0sIcy7RJYAHwiDn7QXa1tjAc8T5EPoibp_iw", // Replace with the path to your image
    },
  ];
  const cards = [
    {
      id: 1,
      content: (
        <>
          <h3 className="relative  font-bold text-2xl mb-4">
            Workplace Safety Solutions
          </h3>
          <p className="text-lg">
            {`Implement AI-powered systems in workplaces to monitor and prevent
            instances of harassment or discrimination, analyzing employee
            interactions, language patterns, and feedback to identify potential
            issues and promote a safe and inclusive environment.`}
          </p>
        </>
      ),
      className: " ",
      thumbnail: "https://shorturl.at/cruDT",
    },
    {
      id: 2,
      content: (
        <>
          <h3 className=" relative  font-bold text-2xl mb-4">
            Educational Outreach Program
          </h3>
          <p className=" relative text-lg">
            {` Develop an AI-based educational program aimed at raising awareness
            about women's safety issues, providing information on rights,
            consent, and healthy relationships through interactive modules,
            quizzes, and chatbot support.`}
          </p>
        </>
      ),
      className: "",
      thumbnail: "https://shorturl.at/FIZ08",
    },
    {
      id: 3,
      content: (
        <>
          <h3 className="relative font-bold text-2xl mb-4">
            Virtual Self-Defense Trainer
          </h3>
          <p className="text-lg">
            {`Create a virtual self-defense training program powered by AI,
            offering personalized tutorials and simulations tailored to
            individual skill levels and physical abilities.`}
          </p>
        </>
      ),
      className: " ",
      thumbnail: "https://shorturl.at/goRW7",
    },
    {
      id: 4,
      content: (
        <>
          <h3 className="relative font-bold text-2xl mb-4">
            Home Security Solutions
          </h3>
          <p className="text-lg">
            {" "}
            {`Integrate AI technology into home security systems to enhance
            protection against intruders and domestic violence, with features
            such as facial recognition, activity monitoring, and emergency
            response capabilities linked to law enforcement or trusted contacts.`}
          </p>
        </>
      ),
      className: " ",
      thumbnail:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSH8FBE2__ebr72VbmeTRZyeTXyozxjhU7cx9cVnV1zCw&s", // Replace with the URL of the thumbnail image
    },
    {
      id: 5,
      content: (
        <>
          <h3 className=" relative  font-bold text-2xl mb-4">
            Legal Aid Navigator
          </h3>
          <p className="text-lg">
            {" "}
            {`Develop an AI-driven platform to assist women in navigating the
            legal system, providing guidance on filing restraining orders,
            accessing legal aid services, and understanding their rights in
            cases of harassment, assault, or intimate partner violence.
          `}
          </p>
        </>
      ),
      className: " ",
      thumbnail:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlgdJEo5Y3T98g0Qzt08mr3PKR8G7T_vvHhduEUzk3pA&s", // Replace with the URL of the thumbnail image
    },
    {
      id: 5,
      content: (
        <>
          <h3 className=" relative  font-bold text-2xl mb-4">
            Online Privacy Protection
          </h3>
          <p className="text-lg">
            {" "}
            {`Create AI tools and algorithms to detect and mitigate online threats
            such as stalking, cyberbullying, and revenge porn, providing women
            with privacy settings, content moderation tools, and legal support
            to safeguard their digital identities and personal information.`}
          </p>
        </>
      ),
      className: " ",
      thumbnail:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_i_28IWikUcD4zK92xt1qy4iShdipacRRBSDMJsFGqA&s", // Replace with the URL of the thumbnail image
    },
  ];

  return (
    <>
      <FloatingNav navItems={navItems} />
      {/* home section */}
      <div className="relative h-screen flex items-center justify-center">
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
            onClick={() => router.push("/panic")}
            className="bg-slate-500 text-white py-3 px-6 rounded-full hover:bg-gray-300 transition duration-300 ease-in-out"
            style={{
              background: "linear-gradient(to bottom, #8c8c8c, #000000)",
              zIndex: "999", // Adjust the value as needed
              position: "relative", // Ensure it respects z-index
            }}
          >
            Panic Button
          </button>
        </div>
        <BackgroundBeams className="h-screen w-screen" />
      </div>
      <div className="border-t border-white my-8"></div>
      <div className="text-center flex items-center justify-center flex-col h-[80vh]">
        <h2 className="text-[650%] font-bold text-black mb-8 font-outline-2">
          SIGN IN
        </h2>
        {!user ? (
          <div>
            <button
              onClick={() => signInWithGoogle("Pro")}
              className="bg-blue-500 hover:bg-blue-50 text-black font-bold py-2 px-2 rounded"
            >
              Sign in with Google-pro
            </button>
            <button
                onClick={() => signInWithGoogle("Premium")}
                className="bg-blue-500 hover:bg-blue-50 text-black font-bold py-2 px-2 rounded"
              >
                Sign in with Google-premium
              </button>
          </div>
        ) : (
          // Render this section if user is authenticated
          <div className="bg-white text-black h-[60vh] w-[80vw] flex items-center justify-center">
            <p>
              Thanks for signing in, {user.displayName}! with - {plan}Plan
            </p>
            <div className="rounded-lg shadow-md">
              {/* <h1 className="text-3xl font-bold mb-4"> {user ? " " : "Guest"}!        </h1> */}
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Logout
              </button>
            </div>
            {plan == "Pro" ? (
              <button
                onClick={() => signInWithGoogle("Premium")}
                className="bg-blue-500 hover:bg-blue-50 text-black font-bold py-2 px-2 rounded"
              >
                Sign in with Google-premium
              </button>
            ) : (
              ""
            )}
          </div>
        )}
      </div>
      <div className="border-t border-white my-8 "></div>
      <div className="text-center">
        <h2
          className="text-[100px] font-bold"
          style={{
            background: "linear-gradient(to bottom, #8c8c8c, #000000)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Top{" "}
          <span
            style={{
              background: "linear-gradient(to right, pink, yellow, red, blue)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            FEATURES
          </span>
        </h2>
      </div>
      {/* Feature section */}
      <div>
        <div className="container mx-auto px-6 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {/* <!-- Feature 1 --> */}
            <div className="bg-gray-800 rounded-lg text-whiteX">
              <h3 className="relative font-bold text-2xl mb-4">
                Women Safety AL Chatbot
              </h3>
              <Lottie animationData={ws} />

              <p className="text-lg">
                {`With cutting-edge Artificial Intelligence technology, our
                chatbot provides a safe and confidential space for women to seek
                assistance, access resources, and receive support in moments of
                need.`}
              </p>
            </div>

            {/* <!-- Feature 2 --> */}
            <div className="bg-gray-800 rounded-lg text-whiteX">
              <h3 className="relative font-bold text-2xl mb-4">
                {` Voice Commands...`}
              </h3>
              <Lottie animationData={vr} />

              <p className="text-lg">
                {`Introducing our cutting-edge AI-powered voice recording feature!
                Experience seamless, hands-free recording with unparalleled
                accuracy and clarity.`}
              </p>
            </div>

            {/* <!-- Feature 3 --> */}
            <div className="bg-gray-800 rounded-lg text-whiteX">
              <h3 className="relative font-bold text-2xl mb-4">
                Connect to Advocates
              </h3>
              <Lottie animationData={connect} />

              <p className="text-lg">
                {`Whether you're fighting for justice, championing causes, or
                amplifying voices that need to be heard, our technology ensures
                that every word is captured with precision and clarity.`}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-white my-8 "></div>
      <div className="text-center">
        <h2
          className="text-[100px] font-bold"
          style={{
            background: "linear-gradient(to bottom, #8c8c8c, #000000)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Our{" "}
          <span
            style={{
              background: "linear-gradient(to right, blue,red,yellow,pink )",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            PRIVILEGES
          </span>
        </h2>
      </div>
      {/* Feedback section */}
      <div className="relative flex h-screen">
        {/* Add content for the feedback section */}
        <LayoutGrid cards={cards} />
      </div>
      <div className="border-t border-white my-8 "></div>
      {/* footer section */}
      {/* footer section */}
      <ContactUs />
    </>
  );
}
