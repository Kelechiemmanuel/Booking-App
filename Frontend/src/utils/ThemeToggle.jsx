import { useEffect, useState } from "react";
import { FiSun } from "react-icons/fi";
import { RiMoonFill } from "react-icons/ri";

const ThemeToggle = () => {
    const [dark, setDark] = useState(false)

    useEffect(() => {
        document.documentElement.classList.toggle("dark", dark)
    }, [dark])
    return (
        <button onClick={() => setDark(!dark)}>
            {dark ? <FiSun /> : <RiMoonFill />}
        </button>
    )
}

export default ThemeToggle