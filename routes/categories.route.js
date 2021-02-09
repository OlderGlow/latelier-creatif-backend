module.exports = app => {
    const categorie = require("../controllers/categorie.controller");
  
    var router = require("express").Router();
  
    router.post("/categories", categorie.create);
    router.get("/categories", categorie.findAll);
    router.get("/categories/search", categorie.findByCategorie);
    router.get("/categories/:id", categorie.findOne);
    router.put("/categories/:id", categorie.update);
    router.delete("/categories/:id", categorie.delete);
    router.delete("/categories", categorie.deleteAll);

    app.use('/api/', router);
  };