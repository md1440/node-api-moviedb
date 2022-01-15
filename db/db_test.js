import mongoose from 'mongoose';

// main().catch(err=> console.log(err));

// async function main () {
//     await mongoose.connect(
//       'mongodb+srv://marc:6zEzZ5btGKmrgXtE@unity.wtbbq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
//     );

//     const kittySchema = new mongoose.Schema({
//       name: String,
//     });

//     const Kitten = mongoose.model('Kitten', kittySchema);

//     const silence = new Kitten({ name: 'Silence' });
//     console.log(silence.name);
// }

await mongoose.connect(
  'mongodb+srv://marc:6zEzZ5btGKmrgXtE@unity.wtbbq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
  () => {
    console.log('connected');
  },
  (err) => console.error(err.reason)
);

// *****************************
// Create Schema
const userSchema = new mongoose.Schema({
  name: String,
  age: Number,
});

// Create Model for Schema
const User = mongoose.model('User', userSchema);

// export {user}
// ******************************

async function addUser() {
  try {
    const user = new User({
      name: 'Marc', age: 38
    });
    await user.save();
    console.log(user);
  } catch (err) {
    console.log(err);
  }
}
addUser();
