const mongoose = require("mongoose");
const Campground = require("../models/campground");
const cities = require("./cities");
const { descriptors, places } = require("./seedHelpers");

mongoose
  .connect("mongodb://localhost:27017/yelp-camp")
  .then(() => {
    console.log("MongoDB(Seeds)接続中...");
  })
  .catch((e) => {
    console.log(e);
  });

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const randomPrice = Math.floor(Math.random() * 2000 + 5000);
    const randomSeeds = (array) => Math.floor(Math.random() * array.length);
    const randomCitiIndex = Math.floor(Math.random() * cities.length);
    const camp = new Campground({
      title: `${descriptors[randomSeeds(descriptors)]}・${places[randomSeeds(places)]}`,
      price: randomPrice,
      images: [
        {
          url: "https://res.cloudinary.com/droog3czu/image/upload/v1741011700/YELPCAMP03/wt63m2mr0emgevju7vhd.jpg",
          filename: "YELPCAMP03/wt63m2mr0emgevju7vhd",
        },
        {
          url: "https://res.cloudinary.com/droog3czu/image/upload/v1741011701/YELPCAMP03/lk0dl7w6fvtnfnbiwhcg.jpg",
          filename: "YELPCAMP03/lk0dl7w6fvtnfnbiwhcg",
        },
      ],
      location: `${cities[randomCitiIndex].prefecture}${cities[randomCitiIndex].city}`,
      description: "日本一!? ​海に近いキャンプ場。スロープを降りると目の前は砂浜！そして、海！赤沢海水浴場の真上に位置する絶景キャンプ場です。テントサウナも持ち込み可。",
      author: "67b207a5ca74641633e97001",
    });
    await camp.save();
  }
};

seedDB();
