import { db } from "../../../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const dayType = searchParams.get("dayType") || "weekend";
  const scheduleType = searchParams.get("scheduleType") || "incoming";

  try {
    const scheduleDoc = await getDoc(doc(db, "shuttleTimings", dayType));
    if (scheduleDoc.exists()) {
      const data = scheduleDoc.data()[scheduleType];
      return new Response(JSON.stringify(data), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    } else {
      return new Response("No such document!", { status: 404 });
    }
  } catch (error) {
    console.error("Error fetching timings:", error);
    return new Response("Error fetching data", { status: 500 });
  }
}
