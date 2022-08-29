const express = require("express");
const router = express.Router();
const User = require("./User");
const bcrypt = require("bcryptjs");
const Auth = require("../middlewares/adminAuth");

router.get("/admin/users", Auth, (req, res) => {
    User.findAll().then((users) => {
        res.render("./admin/users/index", { users: users });
    });
});

router.get("/newUser", Auth, (req, res) => {
    res.render("./admin/users/newUser");
});

router.post("/user/create", Auth, (req, res) => {
    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;

    User.findOne({
        where: {
            email: email,
            username: username
        }
    }).then((user) => {
        if (user == undefined) {
            var salt = bcrypt.genSaltSync(10);
            var hash = bcrypt.hashSync(password, salt);

            if (username != "" && email != "" && password != "") {
                User.create({
                    username: username,
                    email: email,
                    password: hash,
                }).then(() => {
                    res.redirect("/");
                });
            } else {
                res.send("Um ou mais campos estao vazios!");
            }
        } else {
            res.send("Usuario e/ou Email ja existe");
        }
    });
});

router.get("/admin/user/edit/:id", Auth, (req, res) => {
    var id = req.params.id;

    User.findByPk(id).then((user) => {
        res.render("./admin/users/edit", { user: user });
    });
});

router.post("/user/update", Auth, (req, res) => {
    var id = req.body.id;
    var username = req.body.username;
    var email = req.body.email;

    if (username != "" && email != "") {
        User.update(
            { username, email},
            {
                where: {
                    id: id,
                },
            }
        ).then(() => {
            res.redirect("/admin/users");
        });
    }
});

router.post("/user/delete", Auth, (req, res) => {
    var id = req.body.id;
    if (id != undefined) {
        User.destroy({
            where: { id: id },
        }).then(() => {
            res.redirect("/admin/users");
        });
    }
});

router.get('/login', (req, res) => {
    res.render('./admin/users/login')
})

router.post('/authenticate', (req, res) => {
    var username = req.body.username;
    var password = req.body.password;
    
    User.findOne(
        {where: 
            {username: username}
        }
    ).then(user => {
        if(username != undefined) {
            var login = bcrypt.compareSync(password, user.password);
            if(login){
                req.session.user = {
                    id : user.id,
                    username : user.username
                }
                res.redirect('/admin/articles')
            } else {
                res.redirect('/login');
            }
        } else {
            res.redirect('/login');
        }
    })
})

router.get('/logout', (req, res) => {
    req.session.user = undefined;
    res.redirect('/')
})

module.exports = router;
