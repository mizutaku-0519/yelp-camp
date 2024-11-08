const mongoose = require("mongoose");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
const Campground = require("../models/campground");

mongoose
  .connect("mongodb://localhost:27017/yelp-camp", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB接続完了...");
  })
  .catch((err) => {
    console.log(err);
  });

const seeds = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 40; i++) {
    const citiNum = Math.floor(Math.random() * cities.length);
    const rand1 = Math.floor(Math.random() * places.length);
    const rand2 = Math.floor(Math.random() * descriptors.length);
    const price = Math.floor(Math.random() * 1000) + 2000;
    const c = new Campground({
      title: `${descriptors[rand2]}・${places[rand1]}`,
      imageUrl:
        "https://camp.gunma-kanko.jp/wp-content/uploads/2021/03/028.jpg",
      description:
        "施設には共有設備として、トイレやシャワー室、洗濯機、炊事場や炭捨て場も用意されているので、川遊び後の汚れやBBQ（バーベキュー）後の片付けも安心です。ファミリー向けのサイトからソロキャンプ向けミニサイズのテントサイトまで、キャンプサイトが充実しているので、きっとお気に入りの過ごし方を見つけられるはずです。",
      price: price,
      location: `${cities[citiNum].prefecture}${cities[citiNum].city}`,
    });
    await c.save();
  }
};

seeds().then(() => {
  console.log("Seedデータ投入完了");
});
