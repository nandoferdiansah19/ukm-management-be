const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const path = require("path");
const fs = require("fs");
const { successResponse, errorResponse } = require("../utils/response");
const uploadFile = require("../middleware/upload");
const prisma = new PrismaClient();

// Create User
exports.createUser = async (req, res) => {
  try {
    const upload = uploadFile("profiles").single("profile_picture");

    upload(req, res, async (err) => {
      if (err) return errorResponse(res, 400, err.message);

      const { name, nim, program_study, year, phone, address, division, role } =
        req.body;
      const profilePicture = req.file
        ? `/uploads/profiles/${req.file.filename}`
        : null;

      const hashedPassword = await bcrypt.hash(nim, 10);

      const userData = await prisma.users.findUnique({ where: { nim } });

      if (userData) {
        return errorResponse(res, 400, "Nim sudah digunakan");
      }

      const newUser = await prisma.users.create({
        data: {
          name,
          nim,
          password: hashedPassword,
          program_study,
          year,
          phone,
          address,
          division,
          role,
          profile_picture: profilePicture,
        },
      });

      successResponse(res, 200, "Berhasil menambahkan anggota", newUser);
    });
  } catch (error) {
    console.error(error);
    errorResponse(res, 500, "Internal server error");
  }
};

// Ambil semua anggota
exports.getUsers = async (req, res) => {
  try {
    let users = await prisma.users.findMany({
      select: {
        id: true,
        name: true,
        nim: true,
        program_study: true,
        year: true,
        phone: true,
        address: true,
        attendance_count: true,
        division: true,
        role: true,
        profile_picture: true,
        created_at: true,
      },
    });

    users = users.map((user) => ({
      ...user,
      profile_picture: user.profile_picture
        ? `${req.protocol}://${req.get("host")}${user.profile_picture}`
        : null,
    }));

    successResponse(res, 200, "Berhasil mendapatkan data anggota", users);
  } catch (error) {
    console.error(error);
    errorResponse(res, 500, "Internal server error");
  }
};

// Ambil anggota berdasarkan ID
// exports.getUserById = async (req, res) => {
//   try {
//     let user = await prisma.users.findUnique({
//       where: { id: req.params.id },
//       select: {
//         id: true,
//         name: true,
//         nim: true,
//         program_study: true,
//         year: true,
//         phone: true,
//         address: true,
//         attendance_count: true,
//         division: true,
//         role: true,
//         profile_picture: true,
//         created_at: true,
//       },
//     });

//     if (!user) return errorResponse(res, 400, "Anggota tidak ditemukan");

//     user.profile_picture = user.profile_picture
//       ? `${req.protocol}://${req.get("host")}/uploads/profiles${
//           user.profile_picture
//         }`
//       : null;

//     successResponse(res, 200, "Berhasil mendapatkan data anggota", user);
//   } catch (error) {
//     console.error(error);
//     errorResponse(res, 500, "Internal server error");
//   }
// };

exports.getUserById = async (req, res) => {
  try {
    let user = await prisma.users.findUnique({
      where: { id: req.params.id },
      select: {
        id: true,
        name: true,
        nim: true,
        program_study: true,
        year: true,
        phone: true,
        address: true,
        attendance_count: true,
        division: true,
        role: true,
        profile_picture: true,
        created_at: true,
        user_skills: {
          select: {
            id: true,
            skill: true,
            rating: true,
            penilai: true,
          },
        },
        attendance: {
          select: {
            events: {
              select: {
                id: true,
                title: true,
                start_date: true,
                end_date: true,
                jam_mulai: true,
                jam_selesai: true,
                location: true,
              },
            },
          },
        },
      },
    });

    if (!user) return errorResponse(res, 400, "Anggota tidak ditemukan");

    user.profile_picture = user.profile_picture
      ? `${req.protocol}://${req.get("host")}/uploads/profiles/${
          user.profile_picture
        }`
      : null;

    const events = user.attendance.map((item) => item.events);
    delete user.attendance;

    successResponse(res, 200, "Berhasil mendapatkan data anggota", {
      ...user,
      events,
    });
  } catch (error) {
    console.error(error);
    errorResponse(res, 500, "Internal server error");
  }
};

// Update anggota
exports.updateUser = async (req, res) => {
  try {
    const upload = uploadFile("profiles").single("profile_picture");

    upload(req, res, async (err) => {
      if (err) return errorResponse(res, 400, err.message);

      const { id } = req.params;
      const existingUser = await prisma.users.findUnique({ where: { id } });

      if (!existingUser)
        return errorResponse(res, 404, "Anggota tidak ditemukan");

      const updatedData = { ...req.body };

      if (req.file) {
        updatedData.profile_picture = `/uploads/profiles/${req.file.filename}`;
      }

      const updatedUser = await prisma.users.update({
        where: { id },
        data: updatedData,
      });

      successResponse(res, 200, "Berhasil update data anggota", updatedUser);
    });
  } catch (error) {
    console.error(error);
    errorResponse(res, 500, "Internal server error");
  }
};

// Hapus anggota
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.users.findUnique({ where: { id } });
    if (!user) return errorResponse(res, 404, "Anggota tidak ditemukan");

    if (user.profile_picture) {
      const filePath = path.join(__dirname, "..", user.profile_picture);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath); // Hapus file
      }
    }

    await prisma.users.delete({ where: { id } });

    successResponse(res, 200, "Data anggota berhasil dihapus");
  } catch (error) {
    console.error(error);
    errorResponse(res, 500, "Internal server error");
  }
};
