const db = require("../models/mongoose");
const evenementDb = db.evedb;


const getPagination = (page, size) => {
    const limit = size ? +size : 6;
    const offset = page ? page * limit : 0;
  
    return { limit, offset };
  };
exports.create = (req, res) => {
    if (!req.body.title) {
        res.status(400).send({
            message: "Le contenu ne peut pas être vide"
        });
        return;
    }

    const evenement = new evenementDb({
        title: req.body.title,
        image: req.body.image,
        description: req.body.description,
        categorie: req.body.categorie,
        published: req.body.published ? req.body.published : false,
        date: req.body.date ? req.body.date : null,
        lieu: req.body.lieu
    });

    evenement
        .save(evenement)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Une erreur est survenue lors de l'ajout en base de données"
            });
        });
};

exports.findAll = (req, res) => {
    const { page, size, title } = req.query;
    var condition = title
    ? { title: { $regex: new RegExp(title), $options: "i" } }
    : {};

    const { limit, offset } = getPagination(page, size);

    evenementDb.paginate(condition, { offset, limit, sort: {'createdAt': -1} })
    .then((data) => {
      res.send({
        totalItems: data.totalDocs,
        items: data.docs,
        totalPages: data.totalPages,
        currentPage: data.page - 1,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Une erreur est survenue lors de la recherche en base de données.",
      });
    });
};


exports.findByCategorie = (req, res) => {
    const { page, size, categorie } = req.query;
    var condition = categorie
    ? { categorie: { $regex: new RegExp(categorie), $options: "i" } }
    : {};

    const { limit, offset } = getPagination(page, size);

    evenementDb.paginate(condition, { offset, limit, sort: {'createdAt': -1} })
    .then((data) => {
      res.send({
        totalItems: data.totalDocs,
        items: data.docs,
        totalPages: data.totalPages,
        currentPage: data.page - 1,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Une erreur est survenue lors de la recherche en base de données.",
      });
    });
};

exports.findOne = (req, res) => {
    const id = req.params.id;

    evenementDb.findById(id)
        .then(data => {
            if (!data)
                res.status(404).send({
                    message: "Nous n'avons pas trouvé d'objet à montrer avec l'id= " + id
                });
            else res.send(data);
        })
        .catch(err => {
            res
                .status(500)
                .send({
                    message: "Nous n'avons pas trouvé d'objet à montrer avec l'id=" + id
                });
        });
};

exports.update = (req, res) => {
    if (!req.body) {
        return res.status(400).send({
            message: "Une erreur est survenue lors de la suppression"
        });
    }

    const id = req.params.id;

    evenementDb.findByIdAndUpdate(id, req.body, {
            useFindAndModify: false
        })
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Impossible de mettre à jour la base de données avec l'id=${id}`
                });
            } else res.send({
                message: "Mise a jour de la table effectuée"
            });
        })
        .catch(err => {
            res.status(500).send({
                message: "Une erreur est survenue lors de la mise à jour de la base de données avec l'id" + id
            });
        });
};

exports.delete = (req, res) => {
    const id = req.params.id;

    evenementDb.findByIdAndRemove(id)
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Impossible de supprimer l'objet ayant l'id=${id}`
                });
            } else {
                res.send({
                    message: "Suppression effectuée !"
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Impossible de supprimer l'objet ayant l'id=" + id
            });
        });
};
