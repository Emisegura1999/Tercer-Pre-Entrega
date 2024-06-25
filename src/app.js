const express = require("express");
const { engine } = require("express-handlebars");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const passport = require("passport");

const initializePassport = require("./config/passport.config.js");
const auth = require("./middleware/authmiddleware.js");
const configObject = require("./config/envConfig.js");
const path = require('path');
require("../database.js");

const SocketManager = require("./sockets/socketmanager.js");

const productsRouter = require("./routes/products.router.js");
const cartsRouter = require("./routes/carts.router.js");
const viewsRouter = require("./routes/views.router.js");
const userRouter = require("./routes/user.router.js");

const app = express();
const PORT = configObject.server.port;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
initializePassport();
app.use(cookieParser());
app.use(auth);

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");
 
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/users", userRouter);
app.use("/", viewsRouter);

const httpServer = app.listen(PORT, () => {
    console.log(`Server connected http://localhost:${PORT}`);
});

new SocketManager(httpServer);

