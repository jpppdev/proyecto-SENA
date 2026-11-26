// backend/src/features/tables/table.service.js
import { tableRepository } from "./table.repository.js";

const VALID_STATUSES = new Set(["available", "occupied", "reserved"]);

function normalizeTablePayload(payload = {}, isUpdate = false) {
  const numberRaw = payload.number ?? payload.tableNumber;
  const capacityRaw = payload.capacity;
  const nameRaw = payload.name ?? payload.tableName;
  const zoneRaw = payload.zone;
  const statusRaw = payload.status;

  let number;
  if (!isUpdate || numberRaw !== undefined) {
    number = Number(numberRaw);
    if (!Number.isInteger(number) || number <= 0) {
      const err = new Error("El número de mesa debe ser un entero positivo");
      err.statusCode = 400;
      throw err;
    }
  }

  let capacity;
  if (!isUpdate || capacityRaw !== undefined) {
    capacity = Number(capacityRaw);
    if (!Number.isInteger(capacity) || capacity <= 0) {
      const err = new Error("La capacidad de la mesa debe ser un número entero mayor a 0");
      err.statusCode = 400;
      throw err;
    }
  }

  let status;
  if (statusRaw !== undefined) {
    status = String(statusRaw).trim().toLowerCase();
    if (!VALID_STATUSES.has(status)) {
      const err = new Error("Estado de mesa inválido (available, occupied, reserved)");
      err.statusCode = 400;
      throw err;
    }
  } else if (!isUpdate) {
    status = "available";
  }

  const name =
    nameRaw !== undefined
      ? String(nameRaw).trim() || (number ? `Mesa ${number}` : undefined)
      : number
      ? `Mesa ${number}`
      : undefined;

  const zone = zoneRaw !== undefined ? String(zoneRaw).trim() : undefined;

  return { number, name, zone, capacity, status };
}

export const tableService = {
  async getAll() {
    return await tableRepository.getAll();
  },

  async getById(id) {
    return await tableRepository.getById(id);
  },

  async create(data) {
    const normalized = normalizeTablePayload(data, false);
    return await tableRepository.create(normalized);
  },

  async update(id, data) {
    const normalized = normalizeTablePayload(data, true);
    return await tableRepository.update(id, normalized);
  },

  async updateStatus(id, status) {
    const normalizedStatus = String(status || "").trim().toLowerCase();
    if (!VALID_STATUSES.has(normalizedStatus)) {
      const err = new Error("Estado de mesa inválido");
      err.statusCode = 400;
      throw err;
    }
    return await tableRepository.updateStatus(id, normalizedStatus);
  },

  async release(id) {
    return await tableRepository.release(id);
  },

  async disable(id) {
    return await tableRepository.disable(id);
  },
};
