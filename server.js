import express from "express";
import session from "express-session";
import path from "path";
import { fileURLToPath } from "url";
import { counterMiddleware, loggerMiddleware } from "./middleware.js";
import bodyParser from "body-parser";
import CryptoJS from "crypto-js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const port = process.env.PORT || 8000;
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(counterMiddleware);
app.use(loggerMiddleware);

app.use(session({
  name: "session-login",
  secret: "super-secret",
  resave: true,
  saveUninitialized: true
}));

const user = {
  login: "Alan",
  password: "73a056240baf641c8dc2c9bab20e0c2b457bd6e4"
};

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "login.html"));
});

app.post("/login", (req, res) => {
  const { login, password } = req.body;
  const hashedPassword = CryptoJS.SHA1(password).toString();

  if (login === user.login && hashedPassword === user.password) {
    req.session.authenticated = true;
    res.redirect("/secure");
  } else {
    res.send("<h2>Login ou mot de passe incorrect</h2><a href='/'>Retour</a>");
  }
});

function requireAuth(req, res, next) {
  if (req.session.authenticated) {
    next();
  } else {
    res.redirect("/");
  }
}

app.get("/secure", requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, "views", "secure.html"));
});

app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

app.listen(port, () => {
  console.log(`Serveur lancé : http://localhost:${port}`);
});