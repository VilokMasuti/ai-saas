"use client"
import { useEffect, useState } from "react";

import { supabase } from "@/supabse_client";
import axios from "axios";
import useUser from "./useUser";



export function usePlan() {
  const [user] = useUser();
  const [active, setActivePlan] = useState(false);

  const checkActivePlanOrNot = async () => {
    if (!user || !user.id) return;

    const { data: subData, error } = await supabase
      .from("subscriptions")
      .select()
      .eq("user_id", user.id);

    if (error) {
      console.error("Error fetching subscription:", error);
      return;
    }

    if (!subData || subData.length === 0 || !subData[0]?.sub_id) {
      console.warn("No subscription found for user");
      setActivePlan(false);
      return;
    }

    const subId = subData[0].sub_id;

    try {
      const response = await axios.post(`/api/checkout_sessions/${subId}`);
      const { status } = response.data;
      setActivePlan(status === "active");
    } catch (err) {
      console.error("Error checking plan status:", err);
      setActivePlan(false);
    }
  };

  useEffect(() => {
    checkActivePlanOrNot();
  }, [user]);

  return { active };
}
