"use client";

import axios from "axios";
import { useRouter } from "next/navigation";

import { supabase } from "@/supabse_client";
import Header from "../Header";
import { usePlan } from "../hooks/usePlan.js";
import useUser from "../hooks/useUser.js";

export default function PlansPage() {
  const router = useRouter();
  const [user] = useUser(); // your hook returns [currentUser]
  const { active } = usePlan();

  // simple loading guard while user is undefined
  if (user === undefined) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  const handlePlan = async () => {
    if (!user || user === "no user") {
      router.push("/signin"); // client navigation
      return;
    }
    await pay();
  };

  const pay = async () => {
    try {
      // guard again before using properties
      if (!user?.email || !user?.id) {
        console.error("No user email or id available for checkout.");
        return;
      }
      const payload = { email: user.email, userId: user.id };
      const response = await axios.post("/api/checkout_sessions", payload);
      const data = response.data;
      if (data?.url) {
        window.location.replace(data.url);
      } else {
        console.error("No checkout url returned", data);
      }
    } catch (error) {
      console.error(error);
    }
  };
  // (Moved usePlan hook above conditional return)
  // const { active } = usePlan(); // Removed duplicate declaration

  const openCustomerPortal = async () => {
    try {
      if (!user?.id) {
        router.push("/signin");
        return;
      }
      // ensure supabase client is imported above
      const { data: subData, error } = await supabase
        .from("subscriptions")
        .select()
        .eq("user_id", user.id);

      if (error) {
        console.error("Supabase error:", error);
        return;
      }
      if (!subData || subData.length === 0) {
        console.error("No subscriptions found for user");
        return;
      }
      const subId = subData[0].sub_id;
      const response = await axios.post(`/api/checkout_sessions/${subId}`);
      const data = response.data;
      const customerId = data.customer;
      const payload = { customer: customerId };
      const customerPortal = await axios.post(`/api/checkout_sessions/portal`, payload);
      const portalSessionUrl = customerPortal?.data?.url;
      if (portalSessionUrl) window.location.replace(portalSessionUrl);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-black items-center justify-start flex flex-col">
      <Header />
      <div className="w-full items-center justify-center flex min-h-screen">
        <div className="border border-white/10 rounded-lg bg-[#050505] text-white w-3/4 lg:w-1/2
                items-center justify-center flex flex-col py-12 px-6">
          <h1 className="text-white pb-6 border-b border-white/20 w-full text-2xl font-medium"> Premium plan </h1>
          <ul className="w-full text-left pt-12 space-y-6">
            <li>- generate Images using AI</li>
            <li>- Edit Images using AI</li>
            <li>- 3 LLMs Models</li>
            <li>- generate captions for images</li>
            <li>- Enhance the quality of old images</li>
            <li>- Remove Background</li>
          </ul>

          <span className="w-full items-center justify-between flex pt-12 flex-col">
            <h2 className="text-xl text-white text-left font-bold w-full border-b border-white/10 pb-2">$9.99/month</h2>
            <span className="flex justify-between w-full items-center pt-12">
              <p> your plan is {active ? "active" : "cancelled"}</p>
              {!active && <button className="button" onClick={handlePlan}>pay</button>}
              {active && <button className="button" onClick={openCustomerPortal}>handle plan</button>}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}
