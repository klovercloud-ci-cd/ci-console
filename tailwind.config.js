module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      fontWeight: {
        light: 300,
        regular: 400,
        medium: 500,
        'semi-bold': 600,
        bold: 700,
      },
      fontSize: {
        'heading': '89px',
        'sub-heading': '67px',
        'cta-title': '50px',
        'body': '37px',
        'title': '28px',
        'sub-title': '21px',
        'paragraph': '16px',
        'caption': '12px',
        'button': '18px',
        'button-sm': '14px',
      },
      colors: {
        'kc-bdr':{
          'card':"#d7d8de"
        },
        'primary':{
          '100':"#f6f8fb",
          '200':"#d0daee",
          '300':"#abbde0",
          '400':"#86a0d2",
          '500':"#6183c4",
          '600':"#4167b1",
          '700':"#34528b",
          '800':"#263c66",
          DEFAULT:"#182641",
          '1000':"#0a101c",
        },
        'info':{
          '50':"#eff5ff",
          '100':"#d6e6fe",
          '200':"#a5c8fc",
          '300':"#74aafa",
          '400':"#428df9",
          '500':"#116ff7",
          DEFAULT:"#0758CE",
          '700':"#05439d",
          '800':"#042e6b",
          '900':"#02193a",
          '1000':"#000409",

        },
        'danger':{
          '50':"#ffedf0",
          '100':"#ffd4db",
          '200':"#ffa1b0",
          '300':"#ff6e85",
          '400':"#ff3b5a",
          '500':"#ff0830",
          DEFAULT:"#d40022",
          '700':"#a1001a",
          '800':"#6e0012",
          '900':"#3b0009",
          '1000':"#080001",
        },
        'success':{
          '100':"#f5fcf7",
          '200':"#ccf2d8",
          '300':"#a3e8b9",
          '400':"#7ade9a",
          '500':"#51d47b",
          '600':"#30c25f",
          DEFAULT:"#26994b",
          '800':"#1c7037",
          '900':"#124723",
          '1000':"#081e0f",

        },
        'light':{
          '50':"#fbfcfe",
          '100':"#f7f9fd",
          '200':"#eff4fa",
          DEFAULT:"#e7eef8",
          '400':"#dfe8f6",
          '500':"#d7e3f3",
          '600':"#cfddf1",
          '700':"#c7d8ef",
          '800':"#c0d2ec",
          '900':"#b8ccea",
          '1000':"#b0c7e8",
        },
        'warn':{
          '50':"#fefbf7",
          '100':"#fdf1df",
          '200':"#fbddae",
          '300':"#f8c87e",
          '400':"#f6b44d",
          DEFAULT:"#F39F1D",
          '600':"#d2840b",
          '700':"#a16509",
          '800':"#714706",
          '900':"#412903",
          '1000':"#100a01",

        },
        'dark': {
          '100':"#f3f3f5",
          '200':"#d7d8de",
          '300':"#bbbcc7",
          '400':"#9fa1b0",
          '500':"#838699",
          '600':"#696c80",
          '700':"#525464",
          '800':"#3b3d48",
          DEFAULT:"#24252C",
          '1000':"#0d0d10",

          /*others*/
          primary: "#5BC4D6",
          info: "#4285F4",
          warn: "#ffbb33",
          success: "#36C678",
          "success-light": "#C3EED7",
          danger: "#B1122A",

          "tomato-red": "#ff6347",
          container: "#243C64",
          border: {
            default: "#495C7D",
            form: "#1A2C4A",
          },
          text: {
            DEFAULT: "#C5CEDA",
            label: "#495C7D",
            icon: "#5C638B",
          },
          "slider-color": "#52BACC",
          background: {
            DEFAULT: "#1A2C4A",
            1: "#22375B",
            2: "#67769B",
            3: "#243C64",
            4: "#3C4C72",
            5: "#151F36",
            active: "#243C64",
          },
        },
      },
      borderWidth: {
        1.5: "1.5px",
      },
    },
  },
  plugins: [
    require('tailwindcss-text-fill-stroke')(),
  ],
};
