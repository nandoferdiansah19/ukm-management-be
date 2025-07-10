const { PrismaClient } = require("@prisma/client");
const { successResponse, errorResponse } = require("../utils/response");
const prisma = new PrismaClient();

// Create Event
exports.createEvent = async (req, res) => {
  const {
    title,
    description,
    location,
    start_date,
    end_date,
    jam_mulai,
    jam_selesai,
  } = req.body;

  try {
    const event = await prisma.events.create({
      data: {
        title,
        description,
        location,
        start_date: new Date(start_date),
        end_date: new Date(end_date),
        jam_mulai,
        jam_selesai,
        created_by: req.user.id,
      },
    });

    successResponse(res, 200, "Berhasil menambahkan event", event);
  } catch (error) {
    console.log(error);
    errorResponse(res, 500, "Internal server error");
  }
};

// Get all events
exports.getEvents = async (req, res) => {
  try {
    let events = await prisma.events.findMany();
    successResponse(res, 200, "Berhasil mendapatkan data event", events);
  } catch (error) {
    console.error(error);
    errorResponse(res, 500, "Internal server error");
  }
};

// Ambil event berdasarkan ID
exports.getEventById = async (req, res) => {
  try {
    let event = await prisma.events.findUnique({
      where: { id: req.params.id },
    });

    if (!event) return errorResponse(res, 400, "Event tidak ditemukan");

    successResponse(res, 200, "Berhasil mendapatkan data event", event);
  } catch (error) {
    console.error(error);
    errorResponse(res, 500, "Internal server error");
  }
};

// Update event
exports.updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      location,
      start_date,
      end_date,
      jam_mulai,
      jam_selesai,
    } = req.body;
    let event = await prisma.events.findUnique({
      where: { id: id },
    });

    if (!event) return errorResponse(res, 400, "Event tidak ditemukan");

    const update = await prisma.events.update({
      where: { id },
      data: {
        title,
        description,
        location,
        start_date: new Date(start_date),
        end_date: new Date(end_date),
        jam_mulai,
        jam_selesai,
        created_by: req.user.id,
      },
    });

    successResponse(res, 200, "Berhasil update data event", update);
  } catch (error) {
    console.error(error);
    errorResponse(res, 500, "Internal server error");
  }
};

// Hapus event
exports.deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await prisma.events.findUnique({ where: { id } });
    if (!event) return errorResponse(res, 404, "Event tidak ditemukan");

    await prisma.events.delete({ where: { id } });

    successResponse(res, 200, "Data event berhasil dihapus");
  } catch (error) {
    console.error(error);
    errorResponse(res, 500, "Internal server error");
  }
};

exports.attendance = async (req, res) => {
  const { status } = req.body;

  try {
    // 1. Cek apakah user sudah pernah absen di event ini
    const existing = await prisma.attendance.findFirst({
      where: {
        event_id: req.params.id,
        user_id: req.user.id,
      },
    });

    if (existing) {
      return errorResponse(res, 400, "Kamu sudah absen di event ini");
    }

    // 2. Transaksi absensi baru
    const attendance = await prisma.$transaction(async (prisma) => {
      const newAttendance = await prisma.attendance.create({
        data: {
          event_id: req.params.id,
          user_id: req.user.id,
          status,
        },
      });

      // Update attendance_count di tabel users
      const attendanceCount = await prisma.attendance.count({
        where: { user_id: req.user.id },
      });

      await prisma.users.update({
        where: { id: req.user.id },
        data: { attendance_count: attendanceCount },
      });

      return newAttendance;
    });

    successResponse(res, 200, "Berhasil absen", attendance);
  } catch (error) {
    console.error(error);
    errorResponse(res, 500, "Internal server error");
  }
};
