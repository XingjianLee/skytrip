import { useEffect, useState } from "react";
import Index from "./Index";
import UserDashboard from "./UserDashboard";

const Home = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn");
    setIsLoggedIn(!!loggedIn);
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return null;
  }

  return isLoggedIn ? <UserDashboard /> : <Index />;
};

export default Home;
