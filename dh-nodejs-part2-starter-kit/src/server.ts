import express from "express";
import morgan from "morgan";
import Joi from "joi"; 


const app = express();
const port = 3000;

app.use(morgan("dev"));
app.use(express.json());

type Planet = {
    id: number;
    name: string;
  };
  
  type Planets = Planet[];
  
  let planets: Planets = [
    { id: 1, name: "terra" },
    { id: 2, name: "marte" },
  ];


// joi libreria per la validazione
const planetSchema = Joi.object({
    id: Joi.number().integer().required(),
    name: Joi.string().required(),
});


//   GET /api/planets: restituisce tutti i pianeti (JSON) 
  app.get("/api/planets", (req, res) => {
    res.status(200).json(planets);
  });

//   GET /api/planets/:id: restituisce un pianeta (JSON) tramite id 
  app.get("/api/planets/:id", (req, res) => {
    const { id } = req.params;
    const planet = planets.find((p) => p.id === Number(id));

    if (!planet) {
        return res.status(404).json({ message: "Planet not found" });
      }
    res.status(200).json(planet);
  });

// POST /api/planets: crea un pianeta, restituisce solo 
// 201 il codice e un JSON di successo con la chiave msg
  app.post("/api/planets", (req, res) => {
    const { id, name } = req.body;
    const newPlanet = { id, name };

    const validatedNewPlanet = planetSchema.validate(newPlanet)

    if(validatedNewPlanet.error){
      return res.status(400).json({ msg: validatedNewPlanet.error.details[0].message })
    }else{
      planets = [...planets, newPlanet];
      res.status(201).json({ msg: "the planet was created" });
    }

    planets = [...planets, newPlanet];
    res.status(201).json({ msg: "the planet was created" });
  });

//  PUT /api/planets/:id: aggiorna un pianeta tramite ID, 
//  restituisce solo 200 il codice e un JSON di successo con la chiave msg
  app.put("/api/planets/:id", (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    const { error } = planetSchema.validate({ name });

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    planets = planets.map((p) => (p.id === Number(id) ? { ...p, name } : p));
  
    res.status(200).json({ msg: "the planet was updated" });
  });

//  DELETE /api/planets/:id: elimina un pianeta per ID, restituisce solo
//  200 il codice e un JSON di successo con la chiave msg
  app.delete("/api/planets/:id", (req, res) => {
    const { id } = req.params;
    
    if (id === -1) {
        return res.status(404).json({ message: "Planet not found" });
    }

    planets = planets.filter(p => p.id !== Number(id))
  
   res.status(200).json({ msg: "the planet was deleted" });
  })
  

  app.listen(port, () => {
    console.log(
      `Example app listening on port http://localhost:${port}/api/planets`
    );
  });