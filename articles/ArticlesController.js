const express = require("express");
const router = express.Router();
const Category = require("../categories/Category");
const Article = require("./Article");
const slugify = require("slugify");
const Auth = require("../middlewares/adminAuth");

router.get("/admin/articles", Auth, (req, res) => {
    Article.findAll({
        include: [{ model: Category }],
    }).then((articles) => {
        res.render("./admin/articles/index", { articles: articles });
    });
});

router.get("/admin/articles/newArticle", Auth, (req, res) => {
    Category.findAll().then((category) => {
        res.render("./admin/articles/new", { category: category });
    });
});

router.post("/articles/save", Auth, (req, res) => {
    var title = req.body.title;
    var body = req.body.body;
    var category = req.body.category;

    if (title == "" || body == "") {
        res.redirect("/admin/articles");
    } else {
        Article.create({
            title: title,
            body: body,
            slug: slugify(title),
            categoryId: category,
        }).then(() => {
            res.redirect("/admin/articles");
        });
    }
});

router.post("/articles/delete", Auth, (req, res) => {
    var id = req.body.id;

    if (id != "" || id != undefined) {
        Article.destroy({
            where: {
                id: id,
            },
        }).then(() => {
            res.redirect("/admin/articles");
        });
    }
});

router.get("/admin/articles/edit/:id", Auth, (req, res) => {
    var id = req.params.id;

    Article.findByPk(id)
        .then((article) => {
            if (article != undefined && article != "") {
                Category.findAll().then((category) => {
                    res.render("./admin/articles/edit", {
                        article: article,
                        category: category,
                    });
                });
            }
        })
        .catch((err) => {
            res.redirect("/admin/articles");
        });
});

router.post("/articles/update", Auth, (req, res) => {
    var id = req.body.id;
    var title = req.body.title;
    var body = req.body.body;
    var category = req.body.category;

    Article.update(
        {
            title: title,
            body: body,
            categoryId: category,
            slug: slugify(title),
        },
        {
            where: {
                id: id,
            },
        }
    ).then(() => {
        res.redirect("/admin/articles");
    });
});

router.get("/articles/page/:num", (req, res) => {
    var page = req.params.num;
    var offset = 0;

    if (isNaN(page) || page <= 1) {
        offset = 0;
    } else {
        offset = parseInt(page - 1) * 4;
    }

    Article.findAndCountAll({
        limit: 4,
        offset: offset,
        order: [["id", "DESC"]],
    }).then((articles) => {
        var next;

        if (offset + 4 >= articles.count) {
            next = false;
        } else {
            next = true;
        }

        var result = {
            pageNext: parseInt(page) + 1,
            pagePrevious: parseInt(page) - 1,
            next: next,
            articles: articles,
        };

        Category.findAll().then((category) => {
            res.render("page", { result: result, category: category });
        });
    });
});

module.exports = router;
