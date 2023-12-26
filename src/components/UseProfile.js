'use client';
import { useEffect, useState } from "react";

export function useProfile() {
    const [data, setData] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await fetch("/api/profile", {
                method: "GET",
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const json = await response.json();
            setData(json.user);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    fetchData();
}, []);



  return {loading, data}
}