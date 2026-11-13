import { readFile, writeFile } from "node:fs/promises";

export default class BookingManager {
  constructor(databasePath) {
    this.databasePath = databasePath;
  }

  async readBookings() {
    try {
      const data = await readFile(this.databasePath, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      console.log("Error al leer el archivo:", error.message);
      return [];
    }
  }

  async writeBookings(bookings) {
    try {
      await writeFile(this.databasePath, JSON.stringify(bookings, null, 2));
    } catch (error) {
      console.log("Error al escribir el archivo:", error.message);
      throw error;
    }
  }
}
