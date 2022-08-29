const express = require("express");
const router = express.Router();
const Category = require("./Category");
const slugify = require("slugify");
const Auth = require("../middlewares/adminAuth")

router.get("/admin/categories/new", Auth, (req, res) => {
    res.render("./admin/categories/new");
});

router.post("/categories/save", Auth, (req, res) => {
    var title = req.body.title;
    if (title != undefined && title != "") {
        Category.create({
            title: title,
            slug: slugify(title),
        }).then(() => {
            res.redirect("/admin/categories");
        });
    } else {
        res.redirect("/admin/categories/new");
    }
});

router.get("/admin/categories", Auth, (req, res) => {
    Category.findAll().then((categories) => {
        res.render("./admin/categories/index", { categories: categories });
    });
});

router.post("/categories/delete", Auth, (req, res) => {
    var id = req.body.id;
    if (id != undefined && !isNaN(id)) {
        Category.destroy({
            where: { id: id },
        }).then(() => {
            res.redirect("/admin/categories");
        });
    }
});

router.get("/categories/edit/:id", Auth, (req, res) => {
    var id = req.params.id;

    Category.findByPk(id)
        .then((category) => {
            if (!isNaN(id) && category != undefined) {
                res.render("./admin/categories/edit", { category: category });
            }
        })
        .catch((err) => {
            res.redirect("/admin/categories");
        });
});

router.post("/categories/update", Auth, (req, res) => {
    var id = req.body.id;
    var title = req.body.title;
    var slug = req.body.slug;

    if (title != "") {
        Category.update(
            { title: title, slug: slugify(title) },
            {
                where: {
                    id: id,
                },
            }
        ).then(() => {
            res.redirect("/admin/categories");
        });
    }
});

module.exports = router;
