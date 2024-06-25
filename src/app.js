const express = require("express");
const { engine } = require("express-handlebars");
const cookieParser = require("cookie-parser");
const path = require('path');
const passport = require("passport");

require("./database.js");

const initializePassport = require("./config/passport.config.js");
const configObject = require("./config/env.config.js");

const auth = require("./middleware/authmiddleware.js");
const ErrorManager = require("./middleware/errorsMiddleware.js");
const brotliCompression = require("./middleware/brotlyCompression.js");

const SocketManager = require("./sockets/socketmanager.js");

const productsRouter = require("./routes/products.router.js");
const cartsRouter = require("./routes/carts.router.js");
const viewsRouter = require("./routes/views.router.js");
const userRouter = require("./routes/user.router.js");
const testRouter = require("./routes/test.router.js");

const app = express();
const PORT = configObject.server.port;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(passport.initialize());
app.use(auth);

initializePassport();
brotliCompression();

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/users", userRouter);
app.use("/api/mockingProducts", testRouter);
app.use("/", viewsRouter);
app.use(ErrorManager);


const httpServer = app.listen(PORT, () => {
    console.log(`Server connected http://localhost:${PORT}`);
});

new SocketManager(httpServer);

