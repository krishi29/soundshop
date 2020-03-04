const products = {
  fakeDB: [
    {
      id: "beatssolo",
      name: "Beats Solo",
      description: "Beats Solo. Stylish headphones with great sound. ",
      price: "399.99",
      type: "headphones",
      categories: {
        subType: "overtheear",
        connection: "wireless",
        brand: "Dre"
      },
      images: [
        "beats solo 1.jpg",
        "beats solo 2.jpg",
        "beats solo 3.jpg",
        "beats solo 4.jpg"
      ],
      bestseller:"true"
    },
    {
      id: "bosewireless",
      name: "Bose wireless",
      description: "Bose wireless. Comfortable headphones by Bose.",
      price: "499.99",
      type: "headphones",
      categories: {
        subType: "overtheear",
        connection: "wireless",
        brand: "Bose"
      },
      images: [
        "bose headphones 1.jpg",
        "bose headphones 2.jpg",
        "bose headphones 3.jpg"
      ],
      bestseller:"false"
    },
    {
      id: "bosemini",
      name: "Bose Mini",
      description: "Smal speakers with big sound.",
      price: "99.99",
      type: "speakers",
      categories: {
        subType: "regular",
        connection: "wireless",
        brand: "Bose"
      },
      images: ["bose speaker 3.jpg"],
      bestseller:"false"
    },
    {
      id: "bosen140",
      name: "Bose N140",
      description:
        "Bose noise cancelling headphones. Great sound, great battery life and great noise cancellation.",
      price: "449.99",
      type: "headphones",
      categories: {
        subType: "overtheear",
        connection: "wireless",
        brand: "Bose"
      },
      images: ["bose n140 1.jpg", "bose n140 2.jpg", "bose n140 3.jpg"],
      bestseller:"true"
    },
    {
      id: "boses1800",
      name: "Bose S1800",
      description:
        "Bose speakers. Great with your TV or with any audio devices.",
      price: "599.99",
      type: "speakers",
      categories: {
        subType: "regular",
        connection: "wired",
        brand: "Bose"
      },
      images: ["bose speaker 1.jpg", "bose speaker 2.jpg"],
      bestseller:"false"
    },
    {
      id: "edifiernk1",
      name: "Edifier NK1",
      description: "Speakers with surround sound. Set of 8.",
      price: "499.99",
      type: "speakers",
      categories: {
        subType: "regular",
        connection: "wired",
        brand: "Edifier"
      },
      images: ["edifier 1.jpg"],
      bestseller:"false"
    },
    {
      id: "genericairbuds",
      name: "Generic earbuds",
      description:
        "Wireless earbuds for everyday use. Great for voice calls too.",
      price: "39.99",
      type: "headphones",
      categories: {
        subType: "earbuds",
        connection: "wireless",
        brand: "Generic"
      },
      images: [
        "generic earbuds 1.jpg",
        "generic earbuds 2.jpg",
        "generic earbuds 3.jpg",
        "generic earbuds 4.jpg"
      ],
      bestseller:"false"
    },
    {
      id: "googlehome",
      name: "Google Home",
      description:
        "Smart speakers for your home. Makes google a part of your life.",
      price: "199.99",
      type: "speakers",
      categories: {
        subType: "smart",
        connection: "wireless",
        brand: "Google"
      },
      images: ["google home 1.jpg", "google home 2.jpg"],
      bestseller:"true"
    },
    {
      id: "ghomenuki",
      name: "Google Home - Nuki Package",
      description:
        "Google Home with additional Nuki Speakers. The smart speakers with great sound.",
      price: "499.99",
      type: "speakers",
      categories: {
        subType: "smart",
        connection: "wireless",
        brand: "Google"
      },
      images: ["google home with nuki 1.jpg"],
      bestseller:"false"
    },
    {
      id: "ghomemini",
      name: "Google Home Mini",
      description: "Google Home - The Mini Version.",
      price: "99.99",
      type: "speakers",
      categories: {
        subType: "smart",
        connection: "wireless",
        brand: "Google"
      },
      images: ["google home mini1.jpg", "google home mini2.jpg"],
      bestseller:"true"
    },
    {
      id: "marshalbrown",
      name: "Marshal Brown",
      description: "Marhsal headphones with noise cancellation",
      price: "399.99",
      type: "headphones",
      categories: {
        subType: "overtheear",
        connection: "wired",
        brand: "Marshal"
      },
      images: ["marshal wired headphone 1.jpg", "marshal wired headphone 2.jpg"],
      bestseller:"false"
    },
    {
      id: "marshalmini",
      name: "Marshal Mini",
      description: "Small speakers by Marshal",
      price: "49.99",
      type: "speakers",
      categories: {
        subType: "regular",
        connection: "wireless",
        brand: "Marshal"
      },
      images: ["marshal mini 1.jpg", "marshal mini 2.jpg"],
      bestseller:"false"
    },
    {
      id: "monstere1",
      name: "Monster E1",
      description: "Powerful Earbuds by Monster",
      price: "149.99",
      type: "headphones",
      categories: {
        subType: "earbuds",
        connection: "wireless",
        brand: "Monster"
      },
      images: ["monster earbuds 1.jpg"],
      bestseller:"false"
    },
    {
      id: "samsumgs121",
      name: "Samsung S121",
      description: "Powerful Earbuds by Samsung.",
      price: "299.99",
      type: "headphones",
      categories: {
        subType: "earbuds",
        connection: "wireless",
        brand: "Samsung"
      },
      images: ["samsung headphones 1.jpg"],
      bestseller:"true"
    },
    {
      id: "sheiserboom",
      name: "Sennheiser Boom",
      description:
        "Great speakers by Sennheiser. Great for use with any multimedia device.",
      price: "399.99",
      type: "speakers",
      categories: {
        subType: "regular",
        connection: "wired",
        brand: "Sennheiser"
      },
      images: ["sennheiser 1.jpg"],
      bestseller:"false"
    },
    {
      id: "sonosone",
      name: "Sonos One",
      description: "Speakers by Sonos. Great sound with amazing battery life.",
      price: "149.99",
      type: "speakers",
      categories: {
        subType: "regular",
        connection: "wireless",
        brand: "Sonos"
      },
      images: ["sonos 1.jpg", "sonos 2.jpg"],
      bestseller:"false"
    },
    {
      id: "sonosmega",
      name: "Sonos Mega",
      description: "Music box by Sonos. Great volume and crisp sound.",
      price: "249.99",
      type: "speakers",
      categories: {
        subType: "regular",
        connection: "wireless",
        brand: "Sonos"
      },
      images: ["sonos amazon 1.jpg", "sonos amazon 2.jpg"],
      bestseller:"false"
    },
    {
      id: "sonyak1",
      name: "Sony AK1",
      description: "Powerful headphones by Sony.",
      price: "499.99",
      type: "headphones",
      categories: {
        subType: "overtheear",
        connection: "wireless",
        brand: "Sony"
      },
      images: ["sony headphones 1.jpg"],
      bestseller:"false"
    },
    {
      id: "genericbolt",
      name: "Generic Bolt",
      description: "Small waterproof speakers that pack a punch. ",
      price: "99.99",
      type: "speakers",
      categories: {
        subType: "regular",
        connection: "wireless",
        brand: "Generic"
      },
      images: ["generic speakers 1.jpg"],
      bestseller:"false"
    },
    {
      id: "acyearbuds",
      name: "ACY earbuds",
      description:
        "Wireless earbuds by ACY. Strong Bass and comfortable in the ear",
      price: "49.99",
      type: "headphones",
      categories: {
        subType: "earbuds",
        connection: "wireless",
        brand: "ACY"
      },
      images: ["acy earbuds1.jpg"],
      bestseller:"false"
    },
    {
      id: "airpods",
      name: "Airpods",
      description: "Airpods by apple. Great sound and great battery life",
      price: "219.99",
      type: "headphones",
      categories: {
        subType: "earbuds",
        connection: "wireless",
        brand: "Apple"
      },
      
      images: [
        "airpods 1.jpg",
        "airpods 2.jpg",
        "airpods 3.jpg",
        "airpods 4.jpg"
      ]
    },
    {
      id: "airpodspro",
      name: "Airpods Pro",
      description: "Airpods Pro. Latest Version. Better than ever.",
      price: "299.99",
      type: "headphones",
      categories: {
        subType: "earbuds",
        connection: "wireless",
        brand: "Apple"
      },
      images: ["airpods pro 1.jpg", "airpods pro 2.jpg"],
      bestseller:"true"
    },
    {
      id: "alexa",
      name: "Amazon Alexa",
      description: "Introducing Alexa, the smart speaker by Amazon.",
      price: "299.99",
      type: "speakers",
      categories: {
        subType: "smart",
        connection: "wireless",
        brand: "Amazon"
      },
      images: ["amazon alexa 1.jpg"],
      bestseller:"true"
    },
    {
      id: "sheiserpilot",
      name: "Sennheiser Pilot",
      description:
        "Wireless headphones with 18 hours battery life. Great noise cancellation and great sound. ",
      price: "499.99",
      type: "headphones",
      categories: {
        subType: "overtheear",
        connection: "wireless",
        brand: "Sennheiser"
      },
      images: ["sennheiser headphones 1.jpg"],
      bestseller:"false"
    }
  ],
  getAllProducts() {
    return this.fakeDB;
  }
};
module.exports=products;
