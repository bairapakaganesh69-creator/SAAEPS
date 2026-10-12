import { createContext, useContext, useEffect, useState } from "react";


const ThemeContext = createContext();



export function ThemeProvider({ children }) {


  const [darkMode, setDarkMode] = useState(false);



  // Load saved theme when app starts
  useEffect(() => {

    const savedTheme = localStorage.getItem("theme");


    if (savedTheme === "dark") {

      setDarkMode(true);

      document.documentElement.classList.add("dark");

    } 
    else {

      setDarkMode(false);

      document.documentElement.classList.remove("dark");

    }


  }, []);





  // Change theme
  const toggleTheme = () => {


    const newMode = !darkMode;


    setDarkMode(newMode);



    if (newMode) {


      document.documentElement.classList.add("dark");


      localStorage.setItem(
        "theme",
        "dark"
      );


    } 
    else {


      document.documentElement.classList.remove("dark");


      localStorage.setItem(
        "theme",
        "light"
      );


    }


  };





  return (

    <ThemeContext.Provider

      value={{
        darkMode,
        toggleTheme
      }}

    >

      {children}

    </ThemeContext.Provider>

  );

}





export function useTheme() {


  return useContext(ThemeContext);


}