import initDB from "../../helpers/initDB";
import User from "../../models/User";
import bcrypt from "bcryptjs"; // becrypt for password hashing
import Cart from "../../models/Cart";
initDB(); // to connect database
// try{}=code kept here testing , if any error occur ,then passed to the catch{}=here to handle the error

export default async (req, res) => {
  const { name, email, password } = req.body;
  try {
    if (!name || !email || !password) {
      return res.status(422).json({ error: "please enter all the fields" });
    }
    const user = await User.findOne({ email }); // if mail is matched with client mail
    if (user) {
      return res
        .status(422)
        .json({ error: "user already exists with that email" });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = await new User({
      name,
      email,
      password: hashedPassword,
    }).save();
    await new Cart({ user: newUser._id }).save();
    // console.log(newUser);
    res.status(201).json({ message: "signup success" });
  } catch (err) {
    console.log(err);
  }
};
