module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors:{
        dark:{
          'primary':'#5BC4D6',
          'info':'#4285F4',
          'warn':'#ffbb33;',
          'success':'#36C678',
          'success-light':'#C3EED7',
          'danger':'#B1122A',

          'tomato-red':'#ff6347',
          'container':'#243C64',
          'border': '#495C7D',
          'border':{
            'default':'#495C7D',
            'form': '#1A2C4A',
          } ,
          'text':{
            DEFAULT:'#C5CEDA',
            'label':'#495C7D',
            'icon':'#5C638B'
          },
          'slider-color': "#52BACC",
          'background':{
            DEFAULT:'#1A2C4A',
            '1': '#22375B',
            '2': '#67769B',
            '3': '#243C64',
            '4': '#3C4C72',
            '5': '#151F36',
            'active': '#243C64',
          }
        },
        
      },
      borderWidth: {
        '1.5': '1.5px'
      }
    },
  },
  plugins: [],
}
