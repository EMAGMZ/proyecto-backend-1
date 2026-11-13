import { readFile, writeFile } from "node:fs/promises";

const REQUIRED_BOOKING_FIELDS = [
  "clientName",
  "clientEmail",
  "date",
  "time",
  "status",
];

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

  async createBooking(bookingData) {
    for (const field of REQUIRED_BOOKING_FIELDS) {
      if (bookingData[field] === undefined || bookingData[field] === null) {
        throw new Error(`El campo ${field} esta faltante`);
      }
    }
    const bookings = await this.readBookings();
    const id =
      bookings.length > 0
        ? Math.max(...bookings.map((booking) => booking.id)) + 1
        : 1;
    const newBooking = { ...bookingData, id, services: [] };

    bookings.push(newBooking);
    await this.writeBookings(bookings);
    return { payload: newBooking, status: "Ok" };
  }
}
