"use client";
// filepath: c:\Users\Mukilan T\Downloads\Projects\22becse057\app\page.tsx
import { useEffect, useState } from "react";
import axios from "axios";

export default function Home() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://20.244.56.144/test/users", {
          headers: {
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzQyNjI2MDg4LCJpYXQiOjE3NDI2MjU3ODgsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6IjVkZTFmOTNkLWQ3NWEtNGE5OS1hNzQzLTEyOTFhZTJiMDU5NSIsInN1YiI6IjIyYmVjc2UwNTdAa2FoZWR1LmVkdS5pbiJ9LCJjb21wYW55TmFtZSI6IkthcnBhZ2FtIEFjYWRlbXkgb2YgSGlnaGVyIEVkdWNhdGlvbiIsImNsaWVudElEIjoiNWRlMWY5M2QtZDc1YS00YTk5LWE3NDMtMTI5MWFlMmIwNTk1IiwiY2xpZW50U2VjcmV0IjoidFN5cWFSWERsQnVDbWN6byIsIm93bmVyTmFtZSI6Ik11a2lsYW4gVCIsIm93bmVyRW1haWwiOiIyMmJlY3NlMDU3QGthaGVkdS5lZHUuaW4iLCJyb2xsTm8iOiIyMmJlY3NlMDU3In0.to3_rPDpmX2yDZgJfbEcdjzSI9lBJqCSJVUtk3FB6GE`,
          },
        });
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="">
      <h1>Kahe Social Media</h1>
      {data ? <pre>{JSON.stringify(data, null, 2)}</pre> : <p>Loading...</p>}
    </div>
  );
}
