import { useState } from "react";
import LoginPage from "./features/auth/page/LoginPage";
import { Toaster } from "./components/ui/sonner";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <LoginPage />
      <Toaster />
    </>
  );
}

export default App;
