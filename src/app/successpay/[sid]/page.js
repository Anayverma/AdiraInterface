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
import app from "../../../../config";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";

// import { getAuth,signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";


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
  const [user, setUser] = useState(null);

  const [couponCode, setCouponCode] = useState("");
  const auth = getAuth(app);
  const [plan, setPlan] = useState("");
  const [tempPlan, setTempPlan] = useState("");
  const router = useRouter();
  const [pay, setPay] = useState(false);
  async function getPlan(user) {
    //   // useEffect(()=>{

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
  return (
    <>
          
          <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-slate-50	 p-8 rounded-lg shadow-md">
            <div className="flex-col justify-between">
              <h2 className="text-2xl font-semibold mb-4 text-black">
                Step 2- Sign in with same Email ID .
              </h2>
              <button
                className="text-black underline hover:text-lg"
                onClick={async () => {
                  await signInWithGoogle("Premium");
                  router.push("/")
                }}
              >
                {` Sign in with Google-premium ↗`}
              </button>
            </div>
          </div>
        </div>
       
    </>
  );
}
