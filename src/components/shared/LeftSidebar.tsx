import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";

import { INavLink } from "@/types";
import { sidebarLinks } from "@/constants";
import LoaderTwo from "@/components/shared/LoaderTwo";
import { Button } from "@/components/ui/button";
import { useSignOutAccount } from "@/lib/react-query/queriesAndMutations";
import { useUserContext, INITIAL_USER } from "@/context/AuthContext";
import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

const LeftSidebar = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { user, setUser, setIsAuthenticated, isLoading } = useUserContext();

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

  const { mutate: signOut } = useSignOutAccount();

  const handleSignOut = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    signOut();
    setIsAuthenticated(false);
    setUser(INITIAL_USER);
    navigate("/sign-in");
  };

  return (
    <nav className="hidden md:flex px-6 py-10 flex-col justify-between min-w-[270px] border-r border-gray-300 fixed h-screen">
      <div className="flex flex-col gap-11">
        <Link to="/" className="flex gap-3 items-center">
          <p className="text-lg font-bold">Finance App</p>
        </Link>

        {isLoading || !user.email ? (
          <div className="h-14">
            <LoaderTwo />
          </div>
        ) : (
          <Link to={`/profile/${user.id}`} className="flex gap-3 items-center">
            <img
              src={user.imageUrl || "/assets/icons/profile-placeholder.svg"}
              alt="profile"
              className="h-14 w-14 rounded-full"
            />
            <div className="flex flex-col">
              <p className="body-bold">{user.name}</p>
              <p className="small-regular text-light-3">@{user.username}</p>
            </div>
          </Link>
        )}

        <ul className="flex flex-col gap-6">
          {sidebarLinks.map((link: INavLink) => {
            const isActive = pathname === link.route;

            return (
              <li
                key={link.label}
                className={`hover:text-primary-500 hover:bg-gray-100 font-bold group ${
                  isActive &&
                  "text-primary-500 bg-primary-500/10 border-b border-gray-300 rounded-xl"
                }`}
              >
                <NavLink
                  to={link.route}
                  className="flex gap-4 items-center p-4"
                >
                  <img
                    src={link.imgURL}
                    alt={link.label}
                    className={`group-hover ${isActive && "invert-white"}`}
                    width={24}
                    height={24}
                  />
                  {link.label}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </div>

      <Button
        variant="ghost"
        className="shad-button_ghost"
        onClick={(e) => handleSignOut(e)}
      >
        <img
          src="/assets/icons/logout.svg"
          alt="logout"
          width={24}
          height={24}
        />
        <p className="small-medium lg:base-medium">Logout</p>
      </Button>
      <Button variant="ghost" className="shad-button_ghost" onClick={toggleDarkMode}>
        {isDarkMode ? <Sun className="h-4 w-4"/> : <Moon className="h-4 w-4"/>}
      </Button>
    </nav>
  );
};

export default LeftSidebar;
