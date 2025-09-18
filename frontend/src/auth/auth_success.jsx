import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function OAuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get("access_token");

    if (accessToken) {
      localStorage.setItem("access_token", accessToken);
      console.log("access: ", accessToken)
      window.location.replace("/dashboard");  // go to protected page
    } else {
      navigate("/login");
    }
  }, [navigate]);

  return <p>Logging you in...</p>;
}
