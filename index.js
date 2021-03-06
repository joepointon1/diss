import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import userRoutes from "./routes/user.js";
import diaryRoutes from "./routes/diaries.js";
import therapistRoutes from "./routes/therapist.js";
import checkInRoutes from "./routes/checkIns.js";

import User from "./models/user.js";

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

app.use("/", userRoutes);
app.use("/", diaryRoutes);
app.use("/", checkInRoutes);
app.use("/", therapistRoutes);

const dbURI =
	`mongodb+srv://testuser:${process.env.DBpassword}@cluster0.lumrw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
mongoose.set("debug", true);
mongoose
	.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
	.then((result) => {
		app.listen(port, function () {
			console.log("Running RestHub on port " + port);
		});
	})
	.catch((err) => console.log(err));

app.get("/", (req, res) => {
	res.json("Express success");
});
