import { collection, getDocs, query, where } from "firebase/firestore";

import { db } from "../firebase/config";

export const getLandlordRooms = async (landlordId) => {
  try {
    const q = query(
      collection(db, "rooms"),
      where("landlordId", "==", landlordId),
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map((roomDoc) => ({
      id: roomDoc.id,
      ...roomDoc.data(),
    }));
  } catch (error) {
    console.error("Error loading rooms:", error);
    throw error;
  }
};
