import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { useSignOutAccount } from "@/lib/react-query/queriesAndMutations";
import { useEffect, useState } from "react";
import { useUserContext } from "@/context/AuthContext";
import { Sun, Moon } from 'lucide-react';

const Topbar = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate();
  const { mutate: signOut, isSuccess } = useSignOutAccount();
  const { user } = useUserContext();

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  useEffect(() => {
    if (isSuccess) navigate(0);
  }, [isSuccess, navigate]);

  return (
    <section className="sticky top-0 z-50 md:hidden w-full border-b border-gray-300 bg-white dark:bg-gray-800 dark:border-gray-700">
      <div className="flex justify-between items-center py-4 px-5">
        <Link to="/" className="flex gap-3 items-center">
          <p className="text-lg font-bold dark:text-white">Finance App</p>
        </Link>

        <div className="flex gap-4 items-center">
          <Button
            variant="ghost"
            className="shad-button_ghost"
            onClick={() => signOut()}
          >
            <img
              src="/assets/icons/logout.svg"
              alt="logout"
              width={24}
              height={24}
            />
          </Button>
          <Button variant="ghost" className="shad-button_ghost" onClick={toggleDarkMode}>
            {isDarkMode ? <Sun className="h-4 w-4"/> : <Moon className="h-4 w-4"/>}
          </Button>
          <Link
            to={`/profile/${user.id}`}
            className="flex justify-center items-center gap-3"
          >
            <img
              src={user.imageUrl || "/assets/images/profile-placeholder.png"}
              alt="profile"
              className="h-8 w-8 rounded-full"
            />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Topbar;
