
const bcrypt =require('bcrypt'); 

const data = {
  users: [
    {
      name: 'Jon doe',
      email: 'admin@example.com',
      password: bcrypt.hashSync('123456', 8),
      isAdmin: true,
      profession:'',
      image: './image/pic-4.png',
    },
    {
      name: 'Yusuf Lateef',
      email: 'Yusuf@example.com',
      password: bcrypt.hashSync('123456', 8),
      isAdmin: false,
      image: './image/pic-3.png',
      profession:'Doctor',
    },
    {
      name: 'Emmanuel Lateef',
      email: 'Emmanuel@example.com',
      password: bcrypt.hashSync('123456', 8),
      isAdmin: false,
      image: './image/pic-2.png',
      profession:'Doctor',
      ReviewUs:'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ipsam incidunt quod praesentium iusto id autem possimus assumenda at ut saepe.',
      RateUs: 4
    },
    {
      name: 'Boss Man',
      email: 'Boss@example.com',
      password: bcrypt.hashSync('123456', 8),
      isAdmin: false,
      image: './image/pic-1.png',
      profession:'Farmer',
      ReviewUs:'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ipsam incidunt quod praesentium iusto id autem possimus assumenda at ut saepe.',
      RateUs: 4.5
    },
  ],
  collections: [
    {
      "Collection": "Sahih Bukhari",
      "Volume": 9,
      "Hadith_Total": 7563,
      "Categories": 97,
      "Book": "HADITH SAHIH BUKHARI",
      "Author": "nil",
      "Publisher": "nil",
      "DownloadLink": "SAHIH BUKHARI",
      "Description": "SAHIH BUKHARI"
    },
    {
      "Collection": "Sahih Muslim",
      "Volume": 0,
      "Hadith_Total": 7314,
      "Categories": 56,
      "Book": "HADITH SAHIH MUSLIM",
      "Author": "nil",
      "Publisher": "nil",
      "DownloadLink": "SAHIH MUSLIM",
      "Description": "SAHIH MUSLIM"
    },
    {
      "Collection": "Ibn Majah",
      "Volume": 0,
      "Hadith_Total": 4402,
      "Categories": 37,
      "Book": "HADITH IBN MAJAH",
      "Author": "nil",
      "Publisher": "nil",
      "DownloadLink": "IBN MAJAH",
      "Description": "IBN MAJAH"
    },
    {
      "Collection": "Abu Dawud",
      "Volume": 0,
      "Hadith_Total": 5141,
      "Categories": 43,
      "Book": "HADITH ABU DAWUD",
      "Author": "nil",
      "Publisher": "nil",
      "DownloadLink": "ABU DAWUD",
      "Description": "ABU DAWUD"
    }
  ]
};

module.exports = data;