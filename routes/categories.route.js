module.exports = app => {
    const categorie = require("../controllers/categorie.controller");
    const evenement = require("../controllers/evenements.controller");
    
    var router = require("express").Router();
  
    router.post("/categories", categorie.create);
    router.get("/categories", categorie.findAll);
    router.get("/categories/search", categorie.findByCategorie);
    router.get("/categories/:id", categorie.findOne);
    router.put("/categories/:id", categorie.update);
    router.delete("/categories/:id", categorie.delete);
    router.delete("/categories", categorie.deleteAll);

    router.post("/evenements", evenement.create);
    router.get("/evenements", evenement.findAll);
    router.get("/evenements/:id", evenement.findOne);
    router.put("/evenements/:id", evenement.update);
    router.delete("/evenements/:id", evenement.delete);
    router.delete("/evenements", evenement.deleteAll);

    app.use('/api/', router);
  };