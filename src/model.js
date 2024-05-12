
import { db } from "../config";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import app from "../config";
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
        // console.log(`Document with ID '${documentId}' does not exist in collection '${collectionPath}'`);
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
        // console.log(`Document with ID ${doc.id} successfully deleted`);
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
    // console.log("sara data--", querySanpshot);
    const data = [];
    querySanpshot.forEach((doc) => {
      data.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    return data;
  }
  
  async function addTheDataToFireStore(name, email, chat,plan ,cluster) {
    try {
      const docRef = await addDoc(collection(db, cluster), {
        name: name,
        email: email,
        chat: chat,
        plan:plan
      });
      console.log("chat Stored Succesfully ");
      return true;
    } catch (error) {
      console.log("Chat did not stored ", error);
      return false;
    }
  }
  

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
        console.log("Document stored successfully ");
        return true;
      } else {
        // Collection already exists, check for plan upgrade if plan is 'premium'
        const existingDoc = clusterSnapshot.docs[0]; // Assuming there's only one document per cluster
        // console.log("jjf", existingDoc.data().plan);
        if (plan == "Premium" && existingDoc.data().plan == "Pro") {
          // console.log("pro but prem");
          // Upgrade to 'premium' plan if the existing plan is not 'pro'
          await updateDoc(doc(firestore, cluster, existingDoc.id), {
            plan: "Premium",
          });
          // console.log("Account upgraded to premium plan");
        } else {
          // Plan is not 'premium' or account already has 'pro' plan, do not upgrade
          // console.log("Plan not upgraded");
        }
  
        return true; // Return true to indicate document operation was successful
      }
    } catch (error) {
      console.error("Error adding/updating document:", error);
      return false;
    }
  }

export {getDocumentById,addDataToFireStore,addTheDataToFireStore,fetchDocsfromFireStore,deleteCollection}
  





