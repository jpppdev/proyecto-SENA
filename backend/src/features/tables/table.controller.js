// backend/src/features/tables/table.controller.js
import { tableService } from "./table.service.js";

export const tableController = {
  async getAll(req, res) {
    try {
      const tables = await tableService.getAll();
      res.status(200).json(tables);
    } catch (err) {
      console.error("ERROR BACKEND TABLES getAll:", err);
      res.status(500).json({ error: err.message });
    }
  },

  async getById(req, res) {
    try {
      const table = await tableService.getById(req.params.id);
      if (!table) {
        return res.status(404).json({ message: "Mesa no encontrada" });
      }
      res.status(200).json(table);
    } catch (err) {
      console.error("ERROR BACKEND TABLES getById:", err);
      res.status(500).json({ error: err.message });
    }
  },

  async create(req, res) {
    try {
      const created = await tableService.create(req.body);
      res.status(201).json({
        message: "Mesa creada correctamente",
        table: created,
      });
    } catch (err) {
      console.error("ERROR BACKEND TABLES create:", err);
      res.status(err.statusCode || 500).json({ error: err.message });
    }
  },

  async update(req, res) {
    try {
      const updated = await tableService.update(req.params.id, req.body);
      if (!updated) {
        return res.status(404).json({ message: "Mesa no encontrada" });
      }
      res.status(200).json({
        message: "Mesa actualizada correctamente",
        table: updated,
      });
    } catch (err) {
      console.error("ERROR BACKEND TABLES update:", err);
      res.status(err.statusCode || 500).json({ error: err.message });
    }
  },

  async updateStatus(req, res) {
    try {
      const { status } = req.body || {};
      const updated = await tableService.updateStatus(req.params.id, status);
      if (!updated) {
        return res.status(404).json({ message: "Mesa no encontrada" });
      }
      res.status(200).json({
        message: "Estado de la mesa actualizado correctamente",
        table: updated,
      });
    } catch (err) {
      console.error("ERROR BACKEND TABLES updateStatus:", err);
      res.status(err.statusCode || 500).json({ error: err.message });
    }
  },

  async release(req, res) {
    try {
      const released = await tableService.release(req.params.id);
      if (!released) {
        return res.status(404).json({ message: "Mesa no encontrada" });
      }
      res.status(200).json({
        message: "Mesa liberada correctamente",
        table: released,
      });
    } catch (err) {
      console.error("ERROR BACKEND TABLES release:", err);
      res.status(500).json({ error: err.message });
    }
  },

  async disable(req, res) {
    try {
      const disabled = await tableService.disable(req.params.id);
      if (!disabled) {
        return res.status(404).json({ message: "Mesa no encontrada" });
      }
      res.status(200).json({
        message: "Mesa deshabilitada correctamente",
        table: disabled,
      });
    } catch (err) {
      console.error("ERROR BACKEND TABLES disable:", err);
      res.status(500).json({ error: err.message });
    }
  },
};
