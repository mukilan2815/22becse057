"use client";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Home() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const authResponse = await axios.post(
          "http://20.244.56.144/test/auth",
          {
            companyName: "Karpagam Academy of Higher Education",
            clientID: "5de1f93d-d75a-4a99-a743-1291ae2b0595",
            clientSecret: "tSyqaRXDlBuCmczo",
            ownerName: "Mukilan T",
            ownerEmail: "22becse057@kahedu.edu.in",
            rollNo: "22becse057",
          }
        );
        setToken(authResponse.data.access_token);
      } catch (error) {
        setError("Error fetching token.");
        console.error("Error fetching token:", error);
      }
    };

    fetchToken();
    const intervalId = setInterval(fetchToken, 60000); 

    return () => clearInterval(intervalId); 
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;

      try {
        const response = await axios.get("http://20.244.56.144/test/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setData(response.data);
      } catch (error) {
        setError("Error fetching data.");
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  return (
    <div className="">
      <h1>Kahe Social Media</h1>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <pre>{JSON.stringify(data, null, 2)}</pre>
      )}
    </div>
  );
}
