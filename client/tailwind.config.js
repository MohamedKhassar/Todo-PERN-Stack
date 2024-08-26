/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        danger: "#FD99AF",
        warning: "#FAC608",
        info: "#3FD4F4",
      },
    },
    fontFamily: {
      Poppins: "Poppins,sans serif",
    },
  },
  plugins: [],
};
