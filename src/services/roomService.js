import { collection, doc, getDocs, query, where } from "firebase/firestore";

import { db } from "../firebase/config";
import { map } from "firebase/firestore/pipelines";

export const getLandlordRooms = async (landlordId) => {
  try {
    const q = query(
      collection(db, "rooms"),
      where("landlordId", "==", landlordId),
    );
    const snapshot = await getDoc(q);

    return snapshot.docs.map((map) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error loading rooms:", error);
    throw error;
  }
};
