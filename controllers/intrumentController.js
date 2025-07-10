const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const path = require("path");
const fs = require("fs");
const { successResponse, errorResponse } = require("../utils/response");
const prisma = new PrismaClient();

// Create instrument
exports.createIntrument = async (req, res) => {
  const { name, type, brand, serial_number, condition } = req.body;

  try {
    const instrument = await prisma.instruments.create({
      data: {
        name,
        type,
        brand,
        serial_number,
        condition,
      },
    });

    successResponse(res, 200, "Berhasil menambahkan instrument", instrument);
  } catch (error) {
    console.log(error);
    errorResponse(res, 500, "Internal server error");
  }
};

// Get all instrument
exports.getInstruments = async (req, res) => {
  try {
    let instruments = await prisma.instruments.findMany({
      include: {
        instrument_loans: {
          where: { status: "dipinjam" },
          select: {
            id: true,
            loan_date: true,
            return_date: true,
            status: true,
            user_id: true,
            users: {
              select: {
                id: true,
                name: true,
                nim: true,
                phone: true,
              },
            },
          },
        },
      },
    });

    const responseData = instruments.map((instrument) => {
      const loan = instrument.instrument_loans[0];
      return {
        id: instrument.id,
        name: instrument.name,
        type: instrument.type,
        brand: instrument.brand,
        serial_number: instrument.serial_number,
        condition: instrument.condition,
        status: loan ? "dipinjam" : "tersedia",
        loan_info: loan
          ? {
              id: loan.id,
              borrower: loan.users,
              loan_date: loan.loan_date,
              return_date: loan.return_date,
            }
          : null,
      };
    });

    successResponse(
      res,
      200,
      "Berhasil mendapatkan data instruments",
      responseData
    );
  } catch (error) {
    console.error(error);
    errorResponse(res, 500, "Internal server error");
  }
};

// Ambil instrumen berdasarkan ID
exports.getInstrumentById = async (req, res) => {
  try {
    const { id } = req.params;

    const instrument = await prisma.instruments.findUnique({
      where: { id },
      include: {
        instrument_loans: {
          where: { status: "dipinjam" },
          select: {
            id: true,
            loan_date: true,
            return_date: true,
            status: true,
            user_id: true,
            users: {
              // Relasi ke tabel users (peminjam)
              select: {
                id: true,
                name: true,
                nim: true,
                phone: true,
              },
            },
          },
        },
      },
    });

    if (!instrument) {
      return errorResponse(res, 404, "Instrument tidak ditemukan");
    }

    // Ambil data peminjaman jika ada
    const loan = instrument.instrument_loans[0];

    const responseData = {
      id: instrument.id,
      name: instrument.name,
      type: instrument.type,
      brand: instrument.brand,
      serial_number: instrument.serial_number,
      condition: instrument.condition,
      status: loan ? "dipinjam" : "tersedia",
      loan_info: loan
        ? {
            id: loan.id,
            borrower: loan.users, // Data peminjam
            loan_date: loan.loan_date,
            return_date: loan.return_date,
          }
        : null,
    };

    successResponse(
      res,
      200,
      "Berhasil mendapatkan detail instrument",
      responseData
    );
  } catch (error) {
    console.error(error);
    errorResponse(res, 500, "Internal server error");
  }
};

// Update instrumen
exports.updateInstrument = async (req, res) => {
  try {
    const { id } = req.params;
    let instrument = await prisma.instruments.findUnique({
      where: { id: id },
    });

    if (!instrument)
      return errorResponse(res, 400, "Instrumen tidak ditemukan");

    const update = await prisma.instruments.update({
      where: { id },
      data: req.body,
    });

    successResponse(res, 200, "Berhasil update data instrumen", update);
  } catch (error) {
    console.error(error);
    errorResponse(res, 500, "Internal server error");
  }
};

// Hapus instrumen
exports.deleteInstrument = async (req, res) => {
  try {
    const { id } = req.params;

    const instrument = await prisma.instruments.findUnique({ where: { id } });
    if (!instrument)
      return errorResponse(res, 404, "Instrumen tidak ditemukan");

    await prisma.instruments.delete({ where: { id } });

    successResponse(res, 200, "Data instrumen berhasil dihapus");
  } catch (error) {
    console.error(error);
    errorResponse(res, 500, "Internal server error");
  }
};

exports.loanInstrument = async (req, res) => {
  const { user_id, loan_date, status } = req.body;

  try {
    const loan = await prisma.instrument_loans.create({
      data: {
        instrument_id: req.params.id,
        user_id,
        loan_date,
        status,
      },
    });

    successResponse(res, 200, "Berhasil membuat peminjaman", loan);
  } catch (error) {
    console.log(error);
    errorResponse(res, 500, "Internal server error");
  }
};

exports.returnInstrument = async (req, res) => {
  const { return_date, status } = req.body;

  try {
    const loan = await prisma.instrument_loans.update({
      where: { id: req.params.id },
      data: {
        return_date,
        status,
      },
    });

    successResponse(res, 200, "Berhasil membuat pengembalian", loan);
  } catch (error) {
    console.log(error);
    errorResponse(res, 500, "Internal server error");
  }
};
