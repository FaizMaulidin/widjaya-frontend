/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        blurwhite: "rgba(0,0,0,0.025)",
        brokenwhite: "rgba(0,0,0,0.025)",
        defblue: "#0C8990",
        defblueop: "rgba(12, 137, 144, 0.2)",
        defbluehov: "hsl(183, 84%, 25%)",
        darkblue: "hsl(183, 84%, 20%)",
        grayborder: "rgba(0, 0, 0, 0.2)",
        grayborderdim: "rgba(0, 0, 0, 0.1)",
        graytext: "rgba(0, 0, 0, 0.7)",
        black: "rgba(54,75,75,255)",
        blackop: "rgba(54,75,75,0.5)",
        darkerblack: "rgb(36,50,50)",
        graydef: "rgb(240,240,240)"
      },
      fontFamily:{
        default: "Red Hat Text"
      },
      boxShadow: {
        input: '0px 0px 4px 1px rgba(0,0,0,0.1)',
        inputhov: '0px 0px 8px 2px rgba(0,0,0,0.1)',
        popup: '0px 0px 32px 16px rgba(0,0,0,0.2)',
        inner: '0px 0px 4px 1px rgba(0,0,0,0.1) inset',
      }
    },
  },
  plugins: [],
}

