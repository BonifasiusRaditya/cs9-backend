const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();  // Pastikan dotenv dikonfigurasi sebelum memanggil process.env

const app = express();
const port = process.env.PORT || 3000;

const corsOptions = {
    origin: ["https://os.netlabdte.com"], 
    methods: ["GET", "POST", "PUT", "DELETE"], 
    credentials: true,  
    allowedHeaders: ["Content-Type", "Authorization"],  
};

app.use(cors(corsOptions));
app.use(express.json());

app.use("/store", require("./src/routes/store.route"));
app.use("/user", require("./src/routes/user.route"));
app.use("/item", require("./src/routes/item.route"));
app.use("/transaction", require("./src/routes/transaction.route"));

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});