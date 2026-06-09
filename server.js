const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use(express.static(__dirname));
app.use(cors());

const MONGO_URI = "mongodb+srv://DaniaSilva_db_user:SANNIE1928.@vetsco.tp7xbsk.mongodb.net/?appName=VetsCo";

mongoose.connect(MONGO_URI)
  .then(() => console.log("Conectado exitosamente a MongoDB"))
  .catch(err => console.error("Error al conectar a MongoDB", err));

  const fduenosSchema = new mongoose.Schema({
  id_dueno: Number,
  nombre_dueno: String,
  nombre_mascota: String,
  direccion: String,
  telefono: Number,
  telefono_emergencia: Number
});
const fduenos = mongoose.model('fduenos', fduenosSchema);

app.post('/apifduenos', async (req, res) => {
  try {
      const ultimoDueno = await fduenos.findOne().sort({ id_dueno: -1 });
      const nuevoId = ultimoDueno && ultimoDueno.id_dueno ? ultimoDueno.id_dueno + 1 : 1;

      const nuevoDueno = new fduenos({
          id_dueno: nuevoId,
          nombre_dueno: req.body.nombre_dueno ? req.body.nombre_dueno.trim() : '',
          nombre_mascota: req.body.nombre_mascota,
          direccion: req.body.direccion,
          telefono: req.body.telefono,
          telefono_emergencia: req.body.telefono_emergencia
      });
      await nuevoDueno.save();
      res.redirect('/fduenos.html');
  } catch (error) {
      res.status(500).send("Error al guardar dueño: " + error.message);
  }
});

app.get('/obtenerduenos', async (req, res) => {
  try {
      const listaDuenos = await fduenos.find();
      res.json(listaDuenos);
  } catch (error) {
      res.status(500).json({ error: "No se pudieron obtener los dueños" });
  }
});

app.get('/buscar-dueno-por-id/:id', async (req, res) => {
  try {
    const idBuscar = parseInt(req.params.id);
    if (isNaN(idBuscar)) {
      return res.status(400).json({ error: "El ID debe ser un número válido" });
    }
    
    const dueno = await fduenos.findOne({ id_dueno: idBuscar });
    
    if (!dueno) {
      return res.status(404).json({ error: "Dueño no encontrado con ese ID" });
    }
    
    res.json([dueno]); 
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.all('/borrar-dueno-por-id/:id', async (req, res) => {
  try {
    const idBorrar = parseInt(req.params.id);
    await fduenos.deleteOne({ id_dueno: idBorrar });
    res.json({ mensaje: "Dueño eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/editar-dueno-por-id/:id', async (req, res) => {
  try {
    const idEditar = parseInt(req.params.id);
    await fduenos.updateOne({ id_dueno: idEditar }, { $set: req.body });
    res.json({ mensaje: "Dueño modified correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const fmascotasSchema = new mongoose.Schema({
  id_mascota: Number,
  nombre_mascota: String,
  nombre_dueno: String,
  microchip: String,
  especie: String,
  raza: String,
  edad: String,
  peso: String,
  sexo: String
});
const fmascotas = mongoose.model('fmascotas', fmascotasSchema);

app.post('/apifmascotas', async (req, res) => {
  try {
      const ultimaMascota = await fmascotas.findOne().sort({ id_mascota: -1 });
      const nuevoId = ultimaMascota && ultimaMascota.id_mascota ? ultimaMascota.id_mascota + 1 : 1;

      const nuevaMascota = new fmascotas({
          id_mascota: nuevoId,
          nombre_mascota: req.body.nombre_mascota ? req.body.nombre_mascota.trim() : '',
          nombre_dueno: req.body.nombre_dueno,
          microchip: req.body.microchip,
          especie: req.body.especie,
          raza: req.body.raza,
          edad: req.body.edad,
          peso: req.body.peso,
          sexo: req.body.sexo
      });
      await nuevaMascota.save();
      res.redirect('/fmascotas.html');
  } catch (error) {
      res.status(500).send("Error al guardar mascota: " + error.message);
  }
});

app.get('/obtenermascotas', async (req, res) => {
  try {
      const listaMascotas = await fmascotas.find();
      res.json(listaMascotas);
  } catch (error) {
      res.status(500).json({ error: "No se pudieron obtener las mascotas" });
  }
});

app.get('/buscar-mascota-por-id/:id', async (req, res) => {
  try {
    const idBuscar = parseInt(req.params.id);
    if (isNaN(idBuscar)) {
      return res.status(400).json({ error: "El ID debe ser un número válido" });
    }
    
    const mascota = await fmascotas.findOne({ id_mascota: idBuscar });
    
    if (!mascota) {
      return res.status(404).json({ error: "Mascota no encontrada con ese ID" });
    }
    
    res.json([mascota]); 
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.all('/borrar-mascota-por-id/:id', async (req, res) => {
  try {
    const idBorrar = parseInt(req.params.id);
    await fmascotas.deleteOne({ id_mascota: idBorrar });
    res.json({ mensaje: "Mascota eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/editar-mascota-por-id/:id', async (req, res) => {
  try {
    const idEditar = parseInt(req.params.id);
    await fmascotas.updateOne({ id_mascota: idEditar }, { $set: req.body });
    res.json({ mensaje: "Mascota modificada correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const fempleadosSchema = new mongoose.Schema({
  id_empleado: Number,
  nombre_empleado: String,
  cargo: String,
  telefono: Number,
  sueldo: String,
  estatus: String,
  rfc: String,
  direccion: String,
  correo: String
});
const fempleados = mongoose.model('fempleados', fempleadosSchema);

app.post('/apifempleados', async (req, res) => {
  try {
      const ultimoEmpleado = await fempleados.findOne().sort({ id_empleado: -1 });
      const nuevoId = ultimoEmpleado && ultimoEmpleado.id_empleado ? ultimoEmpleado.id_empleado + 1 : 1;

      const nuevoEmpleado = new fempleados({
          id_empleado: nuevoId,
          nombre_empleado: req.body.nombre_empleado ? req.body.nombre_empleado.trim() : '',
          cargo: req.body.cargo,
          telefono: req.body.telefono,
          sueldo: req.body.sueldo,
          estatus: req.body.estatus,
          rfc: req.body.rfc,
          direccion: req.body.direccion,
          correo: req.body.correo
      });
      await nuevoEmpleado.save();
      res.redirect('/fempleados.html');
  } catch (error) {
      res.status(500).send("Error al guardar empleado: " + error.message);
  }
});

app.get('/obtenerempleados', async (req, res) => {
  try {
      const listaEmpleados = await fempleados.find();
      res.json(listaEmpleados);
  } catch (error) {
      res.status(500).json({ error: "No se pudieron obtener los empleados" });
  }
});

app.get('/buscar-empleado-por-id/:id', async (req, res) => {
  try {
    const idBuscar = parseInt(req.params.id);
    if (isNaN(idBuscar)) {
      return res.status(400).json({ error: "El ID debe ser un número válido" });
    }
    const empleado = await fempleados.findOne({ id_empleado: idBuscar });
    if (!empleado) {
      return res.status(404).json({ error: "Empleado no encontrado con ese ID" });
    }
    res.json([empleado]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.all('/borrar-empleado-por-id/:id', async (req, res) => {
  try {
    const idBorrar = parseInt(req.params.id);
    await fempleados.deleteOne({ id_empleado: idBorrar });
    res.json({ mensaje: "Empleado eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/editar-empleado-por-id/:id', async (req, res) => {
  try {
    const idEditar = parseInt(req.params.id);
    await fempleados.updateOne({ id_empleado: idEditar }, { $set: req.body });
    res.json({ mensaje: "Empleado modificado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const fhistorialSchema = new mongoose.Schema({
  id_historial: Number,
  nombre_mascota: String,
  enfermedades: String,
  cirugias: String,
  alergias: String,
  medicacion: String,
  vacunas: String,
  desparasitacion: Date
});
const fhistorial = mongoose.model('fhistorial', fhistorialSchema);

app.post('/apifhistorial', async (req, res) => {
  try {
      const ultimoHistorial = await fhistorial.findOne().sort({ id_historial: -1 });
      const nuevoId = ultimoHistorial && ultimoHistorial.id_historial ? ultimoHistorial.id_historial + 1 : 1;

      const nuevoHistorial = new fhistorial({
          id_historial: nuevoId,
          nombre_mascota: req.body.nombre_mascota,
          enfermedades: req.body.enfermedades,
          cirugias: req.body.cirugias,
          alergias: req.body.alergias,
          medicacion: req.body.medicacion,
          vacunas: req.body.vacunas,
          desparasitacion: req.body.desparasitacion
      });
      await nuevoHistorial.save();
      res.redirect('/fhistorial.html');
  } catch (error) {
      res.status(500).send("Error al guardar historial: " + error.message);
  }
});

app.get('/obtenerhistorial', async (req, res) => {
  try {
      const listaHistorial = await fhistorial.find();
      res.json(listaHistorial);
  } catch (error) {
      res.status(500).json({ error: "No se pudo obtener el historial" });
  }
});

app.get('/buscar-historial-por-id/:id', async (req, res) => {
  try {
    const idBuscar = parseInt(req.params.id);
    if (isNaN(idBuscar)) {
      return res.status(400).json({ error: "El ID debe ser un número válido" });
    }
    const historial = await fhistorial.findOne({ id_historial: idBuscar });
    if (!historial) {
      return res.status(404).json({ error: "Historial no encontrado con ese ID" });
    }
    res.json([historial]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.all('/borrar-historial-por-id/:id', async (req, res) => {
  try {
    const idBorrar = parseInt(req.params.id);
    await fhistorial.deleteOne({ id_historial: idBorrar });
    res.json({ mensaje: "Historial eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/editar-historial-por-id/:id', async (req, res) => {
  try {
    const idEditar = parseInt(req.params.id);
    await fhistorial.updateOne({ id_historial: idEditar }, { $set: req.body });
    res.json({ mensaje: "Historial modificado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


const finventarioSchema = new mongoose.Schema({
  id_producto: Number,
  nombre_producto: String,
  categoria: String,
  cantidad: Number,
  precio: String,
  proveedor: String,
  contacto: Number,
  ubicacion: String,
  fecha_caducidad: Date
});
const finventario = mongoose.model('finventario', finventarioSchema);

app.post('/apifinventario', async (req, res) => {
  try {
      const ultimoProducto = await finventario.findOne().sort({ id_producto: -1 });
      const nuevoId = ultimoProducto && ultimoProducto.id_producto ? ultimoProducto.id_producto + 1 : 1;

      const nuevoProducto = new finventario({
          id_producto: nuevoId,
          nombre_producto: req.body.nombre_producto ? req.body.nombre_producto.trim() : '',
          categoria: req.body.categoria,
          cantidad: req.body.cantidad,
          precio: req.body.precio,
          proveedor: req.body.proveedor,
          contacto: req.body.contacto,
          ubicacion: req.body.ubicacion,
          fecha_caducidad: req.body.fecha_caducidad
      });
      await nuevoProducto.save();
      res.redirect('/finventario.html');
  } catch (error) {
      res.status(500).send("Error al guardar en inventario: " + error.message);
  }
});

app.get('/obtenerinventario', async (req, res) => {
  try {
      const listaInventario = await finventario.find();
      res.json(listaInventario);
  } catch (error) {
      res.status(500).json({ error: "No se pudo obtener el inventario" });
  }
});

app.get('/buscar-inventario-por-id/:id', async (req, res) => {
  try {
    const idBuscar = parseInt(req.params.id);
    if (isNaN(idBuscar)) {
      return res.status(400).json({ error: "El ID debe ser un número válido" });
    }
    const producto = await finventario.findOne({ id_producto: idBuscar });
    if (!producto) {
      return res.status(404).json({ error: "Producto no encontrado con ese ID" });
    }
    res.json([producto]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.all('/borrar-inventario-por-id/:id', async (req, res) => {
  try {
    const idBorrar = parseInt(req.params.id);
    await finventario.deleteOne({ id_producto: idBorrar });
    res.json({ mensaje: "Producto eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/editar-inventario-por-id/:id', async (req, res) => {
  try {
    const idEditar = parseInt(req.params.id);
    await finventario.updateOne({ id_producto: idEditar }, { $set: req.body });
    res.json({ mensaje: "Producto modificado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/borrartodo', async (req, res) => {
  try {
    await fduenos.deleteMany({});
    await fmascotas.deleteMany({});
    await fempleados.deleteMany({});
    await fhistorial.deleteMany({});
    await finventario.deleteMany({});
    res.send("<h1>¡Todas las colecciones de la base de datos han sido limpiadas!</h1>");
  } catch (error) {
    res.status(500).send("Error al limpiar la base de datos: " + error.message);
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Servidor Backend corriendo en http://localhost:${PORT}`));
