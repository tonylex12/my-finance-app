import { Link, useLocation } from "react-router-dom";
import { bottombarLinks } from "@/constants";

const Bottombar = () => {
  const { pathname } = useLocation();
  return (
    <section className="bg-white dark:bg-gray-800 border-t border-gray-300 dark:border-gray-700 z-50 flex justify-between items-center w-full sticky bottom-0 rounded-t-[16px] px-5 py-4 md:hidden">
      {bottombarLinks.map((link) => {
        const isActive = pathname === link.route;

        return (
          <Link
            to={link.route}
            key={link.label}
            className={`${
              isActive && "rounded-[10px] bg-primary-500/10 text-primary-500"
            } flex justify-center items-center flex-col gap-1 p-2 transition`}
          >
            <img
              src={link.imgURL}
              alt={link.label}
              width={16}
              height={16}
              className={`${isActive && "invert-white"}`}
            />
            <p className="font-bold text-[10px]">{link.label}</p>
          </Link>
        );
      })}
    </section>
  );
};

export default Bottombar;
