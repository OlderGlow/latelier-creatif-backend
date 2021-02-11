module.exports = app => {
    const evenement = require("../controllers/evenements.controller");
  
    var router = require("express").Router();
  
    router.post("/evenements", evenement.create);
    router.get("/evenements", evenement.findAll);
    router.get("/evenements/:id", evenement.findOne);
    router.put("/evenements/:id", evenement.update);
    router.delete("/evenements/:id", evenement.delete);
    router.delete("/evenements", evenement.deleteAll);

    app.use('/ev/', router);
  };