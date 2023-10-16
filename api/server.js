// IMPORTS AT THE TOP
const express = require("express");
const Dog = require("./dog-model")

// INSTANCE OF EXPRESS APP
const server = express();
// GLOBAL MIDDLEWARE
server.use(express.json());
// ENDPOINTS
// [GET]    /             (Hello World endpoint)
server.get("/hello-world", (req, res) => {
    res.status(200).json({ message: "hello, world" })
})

// [GET]    /api/dogs     (R of CRUD, fetch all dogs)
server.get("/api/dogs", async (req, res) => {
    try {
        const dogs = await Dog.findAll();
        res.status(200).json(dogs);
    } catch (err) {
        res.status(500).json({ message: `Error fetching dogs!` })
    }
})
// [GET]    /api/dogs/:id (R of CRUD, fetch dog by :id)
server.get("/api/dogs/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const dog = await Dog.findById(id);
        if (!dog) {
            res.status(404).json({ message: `no dog with id ${id}` });
        } else {
            res.status(200).json(dog)
        }
    } catch (err) {
        res.status(500).json({ message: `Error fetching dog ${req.params.id}: ${err.message}` })
    }
})
// [POST]   /api/dogs     (C of CRUD, create new dog from JSON payload)
server.post("/api/dogs", async (req, res) => {
    try {
        const { name, weight } = req.body

        if (!name || !weight) {
            res.status(422).json({ message: `dogs need valid name and weight: ${err.message}` })
        } else {
            const dog = await Dog.create({ name, weight });
            res.status(201).json({
                message: "success creating dog",
                data: dog
            })
        }
    } catch (err) {
        res.status(500).json({ message: `Error creating dog: ${err.message}` })
    }
})
// [PUT]    /api/dogs/:id (U of CRUD, update dog with :id using JSON payload)
server.put("/api/dogs/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { name, weight } = req.body;
        const targetDog = await Dog.findById(id);
        if (!targetDog) {
            res.status(404).json({ message: `no dog with id ${id}` });
        } else {
            const dog = await Dog.update(id, { name: name ? name : targetDog.name, weight: weight ? weight : targetDog.weight});
            res.status(200).json({
                message: "dog was updated successfully",
                data: dog
            })
        }
    } catch (err) {
        res.status(500).json({ message: `Error updating dog: ${err.message}` })
    }
})

// [DELETE] /api/dogs/:id (D of CRUD, remove dog with :id)

server.delete("/api/dogs/:id", async (req, res) => {
    try {
        const {id} = req.params;
        const dog = await Dog.delete(id);
        if (!dog){
            res.status(404).json({ message: `dog with id:'${id}' does not exist` });
        } else {
            res.status(200).json({message: "Dog successfully deleted", data: dog})
        }
    }catch(err){
        res.status(500).json({ message: `Error deleting dog: ${err.message}` })
    }
})

// EXPOSING THE SERVER TO OTHER MODULES
module.exports = server
