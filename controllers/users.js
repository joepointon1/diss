import User from "../models/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const signUp = (req, res) => {
	console.log(req.body);
	const user = new User(req.body);

	user.save((err, user) => {
		if (err) {
			console.log(err);
			res.status(500).send({ message: err });
			return;
		}
		res.send({ message: "User successfully registered" });
	});
};

export const signIn = (req, res) => {
	User.findOne({
		username: req.body.username,
	}).exec((err, user) => {
		if (err) {
			res.status(500).send({ message: err });
			return;
		}

		if (!user) {
			return res.status(404).send({ message: "User not found." });
		}

		let passwordIsValid;
		bcrypt
			.compare(req.body.password, user.password)
			.then((result) => (passwordIsValid = result));

		if (!passwordIsValid) {
			return res
				.status(401)
				.send({ acessToken: null, message: "Invalid password." });
		}

		const token = jwt.sign(
			{
				id: user._id,
				isTherapist: user.isTherapist,
				rememberMe: req.body.rememberMe == "checked" ? true : false,
			},
			"top-secret",
			{ expiresIn: 86400 }
		);

		res.status(200).send({
			accessToken: token,
		});
	});
};

export const validateToken = (req, res) => {
	// used when user auto logged in by remember me to check token
	const token = req.body.token;

	jwt.verify(token, "top-secret", (err, decoded) => {
		if (err) {
			return res.status(401).send({ message: "User not authorized" });
		} else {
			return res.status(200).send({ message: "User authorized" });
		}
	});
};
