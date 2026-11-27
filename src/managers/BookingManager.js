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
      if (typeof bookingData[field] !== "string") {
        throw new Error(`El campo ${field} debe ser texto`);
      }
    }
    const bookings = await this.readBookings();
    const id =
      bookings.length > 0
        ? Math.max(...bookings.map((booking) => booking.id)) + 1
        : 1;
    const cleanData = {};
    for (const field of REQUIRED_BOOKING_FIELDS) {
      cleanData[field] = bookingData[field];
    }
    const newBooking = { ...cleanData, id, services: [] };

    bookings.push(newBooking);
    await this.writeBookings(bookings);
    return { payload: newBooking, status: "Ok" };
  }
  async getBookingById(idBooking) {
    const bookings = await this.readBookings();
    return bookings.find((booking) => booking.id === Number(idBooking)) ?? null;
  }

  async addServiceToBooking(idBooking, idService) {
    const bookings = await this.readBookings();
    const booking = bookings.find(
      (booking) => booking.id === Number(idBooking),
    );
    if (!booking) {
      return { payload: null, status: "NotOk", message: "Booking not found" };
    }

    const item = booking.services.find(
      (item) => item.service === Number(idService),
    );

    if (item) {
      item.quantity = item.quantity + 1;
    } else {
      booking.services.push({ service: Number(idService), quantity: 1 });
    }
    await this.writeBookings(bookings);
    return { payload: booking, status: "Ok" };
  }
}