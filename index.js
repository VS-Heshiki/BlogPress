const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./database/database");
const session = require("express-session");

const categoriesController = require("./categories/CategoriesController");
const articlesController = require("./articles/ArticlesController");
const usersController = require("./users/UsersController");

const Category = require("./categories/Category");
const Article = require("./articles/Article");
const User = require("./users/User");

app.set("view engine", "ejs");

app.use(
    session({
        secret: "ApenasUmTeste",
        cookie: { maxAge: 30000000 },
    })
);

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/", categoriesController);
app.use("/", articlesController);
app.use("/", usersController);

connection
    .authenticate()
    .then(() => {
        console.log("authenticated");
    })
    .catch((err) => {
        console.log(err);
    });

app.get("/", (req, res) => {
    Article.findAll({
        order: [["id", "DESC"]],
        limit: 4,
    }).then((article) => {
        Category.findAll().then((category) => {
            res.render("./index", { article: article, category: category });
        });
    });
});

app.get("/:slug", (req, res) => {
    var slug = req.params.slug;
    Article.findOne({
        where: {
            slug: slug,
        },
    })
        .then((article) => {
            if (article != undefined && article != "") {
                Category.findAll().then((category) => {
                    res.render("./article", {
                        article: article,
                        category: category,
                    });
                });
            } else {
                res.redirect("/");
            }
        })
        .catch((err) => {
            res.sendStatus(500);
        });
});

app.listen(3000, (req, res) => {
    console.log("listening on 3000");
});
