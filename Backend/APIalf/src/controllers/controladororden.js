import ordenSchema from "../models/ordenes.js";
import detalleOrdenSchema from "../models/detalle_ordenes.js";
import { validatorHandler } from "../midleware/validator.handler.js";
import { 
  createOrdenSchema,
  getOrdenParamsSchema,
  updateOrdenSchema,
  deleteOrdenSchema
} from "../validators/ordenValidarDTO.js";


const generarNumeroDeOrden = () => {
  const now = new Date();
  return `ORD-${now.getFullYear()}${(now.getMonth()+1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}-${Math.floor(Math.random() * 1000)}`;
};

export const crearOrden = [
  validatorHandler(createOrdenSchema, "body"),
  async (req, res) => {
    try {
      const { cliente_correo, estado, fecha, detalles } = req.body;

      // Validar que haya al menos un detalle
      if (!detalles || detalles.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Debe incluir al menos un producto',
          code: 'SIN_PRODUCTOS'
        });
      }

      // Validar estructura de cada detalle
      const detallesInvalidos = detalles.filter(detalle => 
        !detalle.producto_id || 
        !detalle.producto_nombre || 
        !detalle.categoria_nombre ||
        !detalle.cantidad || 
        !detalle.precio_unitario
      );

      if (detallesInvalidos.length > 0) {
        return res.status(400).json({
          success: false,
          message: "Algunos productos no tienen todos los campos requeridos",
          detallesInvalidos,
          code: "PRODUCTOS_INVALIDOS"
        });
      }

      // Calcular total
      const total = detalles.reduce((acc, detalle) => 
        acc + (detalle.cantidad * detalle.precio_unitario), 0);

      // Crear orden
      const nuevaOrden = new ordenSchema({
        cliente_correo,
        estado: estado || "pendiente",
        fecha: fecha ? new Date(fecha) : new Date(),
        detalles,
        total,
        numero_orden: generarNumeroDeOrden()
      });

      const ordenCreada = await nuevaOrden.save();

      res.status(201).json({
        success: true,
        message: "Orden creada exitosamente",
        data: ordenCreada,
        code: "ORDEN_CREADA"
      });

    } catch (error) {
      console.error("Error al crear la orden:", error);
      res.status(500).json({ 
        success: false,
        message: "Error interno del servidor",
        error: error.message,
        code: "ERROR_SERVIDOR"
      });
    }
  }
];



export const obtenerOrdenes = async (req, res) => {
  try {
    const ordenes = await ordenSchema.find().populate("detalles");
    
    res.json({
      success: true,
      count: ordenes.length,
      data: ordenes,
      code: "ORDENES_ENCONTRADAS"
    });

  } catch (error) {
    console.error("Error al obtener las órdenes:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener órdenes",
      error: error.message,
      code: "ERROR_OBTENER_ORDENES"
    });
  }
};

export const obtenerOrdenPorId = [
  validatorHandler(getOrdenParamsSchema, "params"),
  async (req, res) => {
    try {
      const orden = await ordenSchema.findById(req.params.id).populate("detalles");
      
      if (!orden) {
        return res.status(404).json({
          success: false,
          message: "Orden no encontrada",
          code: "ORDEN_NO_ENCONTRADA"
        });
      }

      res.json({
        success: true,
        data: orden,
        code: "ORDEN_ENCONTRADA"
      });

    } catch (error) {
      console.error("Error al obtener la orden por ID:", error);
      res.status(500).json({
        success: false,
        message: "Error al obtener orden",
        error: error.message,
        code: "ERROR_OBTENER_ORDEN"
      });
    }
  }
];



export const actualizarOrden = [
  validatorHandler(getOrdenParamsSchema, "params"),
  validatorHandler(updateOrdenSchema, "body"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { cliente_correo, estado, fecha, detalles } = req.body;

      if (detalles) {
        const detalleDocs = await detalleOrdenSchema.find({ _id: { $in: detalles } });
        if (detalleDocs.length !== detalles.length) {
          const detallesInexistentes = detalles.filter(detalleId => 
            !detalleDocs.some(doc => doc._id.toString() === detalleId)
          );
          return res.status(400).json({
            success: false,
            message: `Detalles no encontrados: ${detallesInexistentes.join(", ")}`,
            code: "DETALLES_NO_ENCONTRADOS"
          });
        }
      }

      let total;
      if (detalles) {
        const detalleDocs = await detalleOrdenSchema.find({ _id: { $in: detalles } });
        total = detalleDocs.reduce((acc, detalle) => 
          acc + (detalle.cantidad * detalle.precio_unitario), 0);
      }

      const datosActualizacion = {
        cliente_correo,
        estado,
        ...(fecha && { fecha: new Date(fecha) }),
        detalles,
        ...(total !== undefined && { total })
      };

      const ordenActualizada = await ordenSchema.findByIdAndUpdate(
        id,
        datosActualizacion,
        { new: true }
      ).populate("detalles");

      if (!ordenActualizada) {
        return res.status(404).json({
          success: false,
          message: "Orden no encontrada",
          code: "ORDEN_NO_ENCONTRADA"
        });
      }

      res.json({
        success: true,
        message: "Orden actualizada correctamente",
        data: ordenActualizada,
        code: "ORDEN_ACTUALIZADA"
      });

    } catch (error) {
      console.error("Error al actualizar la orden:", error);
      res.status(500).json({
        success: false,
        message: "Error al actualizar orden",
        error: error.message,
        code: "ERROR_ACTUALIZAR_ORDEN"
      });
    }
  }
];


export const borrarOrden = [
  validatorHandler(deleteOrdenSchema, "params"),
  async (req, res) => {
    try {
      const ordenEliminada = await ordenSchema.findByIdAndDelete(req.params.id);
      
      if (!ordenEliminada) {
        return res.status(404).json({
          success: false,
          message: "Orden no encontrada",
          code: "ORDEN_NO_ENCONTRADA"
        });
      }

      res.json({
        success: true,
        message: "Orden eliminada correctamente",
        data: ordenEliminada,
        code: "ORDEN_ELIMINADA"
      });

    } catch (error) {
      console.error("Error al eliminar la orden:", error);
      res.status(500).json({
        success: false,
        message: "Error al eliminar orden",
        error: error.message,
        code: "ERROR_ELIMINAR_ORDEN"
      });
    }
  }
];