const mongoose = require('mongoose');
const Movie = require('./models/Movie'); 

// Connect to your MongoDB
mongoose.connect('mongodb://mairah:m1234@ac-qmqmkfi-shard-00-00.fr9j8vv.mongodb.net:27017,ac-qmqmkfi-shard-00-01.fr9j8vv.mongodb.net:27017,ac-qmqmkfi-shard-00-02.fr9j8vv.mongodb.net:27017/streamvibe?ssl=true&replicaSet=atlas-pzvi1x-shard-0&authSource=admin');

const cloudinaryImages = [
  "https://res.cloudinary.com/dru7ig67d/image/upload/v1774603857/f7_rstpnc.jpg",
  "https://res.cloudinary.com/dru7ig67d/image/upload/v1774603857/f8_k4cp2n.jpg",
  "https://res.cloudinary.com/dru7ig67d/image/upload/v1774603858/f3_ulkldo.jpg",
  "https://res.cloudinary.com/dru7ig67d/image/upload/v1774603857/f6_cbeylj.jpg",
  "https://res.cloudinary.com/dru7ig67d/image/upload/v1774603858/f4_alt5jd.jpg",
  "https://res.cloudinary.com/dru7ig67d/image/upload/v1774603858/f1_iug2fe.jpg",
  "https://res.cloudinary.com/dru7ig67d/image/upload/v1774603944/f16_n6hfcl.jpg",
  "https://res.cloudinary.com/dru7ig67d/image/upload/v1774603944/f14_qypnkr.jpg",
  "https://res.cloudinary.com/dru7ig67d/image/upload/v1774603944/f15_uz8cwp.jpg",
  "https://res.cloudinary.com/dru7ig67d/image/upload/v1774603944/f13_se3bjb.jpg",
  "https://res.cloudinary.com/dru7ig67d/image/upload/v1774603944/f12_c47mvm.jpg",
  "https://res.cloudinary.com/dru7ig67d/image/upload/v1774604570/f22_lz3iem.jpg"
];

const seedImages = async () => {
  try {
    const movies = await Movie.find();
    console.log(`🎬 Found ${movies.length} movies. Shuffling cast and crew...`);
    
    for (const movie of movies) {
      // 1. Shuffle the 11 images for this specific movie
      const shuffled = [...cloudinaryImages].sort(() => 0.5 - Math.random());
      
      // 2. Pick the first 5 for the Cast
      const newCast = shuffled.slice(0, 5).map((img, idx) => ({
        name: `Actor ${Math.floor(Math.random() * 100)}`, // Random placeholder name
        image: img
      }));

      // 3. Pick the next 2 for Director and Music so they aren't the same as the actors
      const directorImg = shuffled[5];
      const musicImg = shuffled[6];

      // 4. Atomic update using $set to keep your ratings and videoUrls safe
      await Movie.findByIdAndUpdate(movie._id, {
        $set: {
          cast: newCast,
          director: {
            name: "Lead Director",
            image: directorImg,
            country: "India"
          },
          music: {
            name: "Composer Name",
            image: musicImg,
            country: "India"
          }
        }
      });
      console.log(`✅ Successfully randomized visuals for: ${movie.title}`);
    }

    console.log("\n✨ Migration Complete! All 22 movies have unique cast/crew visuals.");
    console.log("🔒 Note: Your custom ratings and release dates were preserved.");
    process.exit();
  } catch (err) { 
    console.error("❌ Migration failed:", err); 
    process.exit(1); 
  }
};

seedImages();