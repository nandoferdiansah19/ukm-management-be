const { PrismaClient } = require("@prisma/client");
const { successResponse, errorResponse } = require("../utils/response");
const prisma = new PrismaClient();

// Create Skill
exports.createSkill = async (req, res) => {
  const { skill, user_id } = req.body;

  try {
    const skil = await prisma.user_skills.create({
      data: {
        skill,
        user_id: user_id,
      },
    });

    successResponse(res, 200, "Berhasil menambahkan skill", skil);
  } catch (error) {
    console.log(error);
    errorResponse(res, 500, "Internal server error");
  }
};

// Get all events
exports.getSkills = async (req, res) => {
  const { user_id } = req.query;

  let options;

  if (user_id) {
    options = {
      where: {
        user_id: user_id,
      },
    };
  }
  try {
    let skil = await prisma.user_skills.findMany(options);
    successResponse(res, 200, "Berhasil mendapatkan data skill", skil);
  } catch (error) {
    console.error(error);
    errorResponse(res, 500, "Internal server error");
  }
};

// Ambil event berdasarkan ID
exports.getSkillById = async (req, res) => {
  try {
    let skil = await prisma.user_skills.findUnique({
      where: { id: req.params.id },
    });

    if (!skil) return errorResponse(res, 400, "skill tidak ditemukan");

    successResponse(res, 200, "Berhasil mendapatkan data skill", skil);
  } catch (error) {
    console.error(error);
    errorResponse(res, 500, "Internal server error");
  }
};

// Update event
exports.updateSkill = async (req, res) => {
  try {
    const { id } = req.params;
    const { skill } = req.body;
    let skil = await prisma.user_skills.findUnique({
      where: { id: id },
    });

    if (!skil) return errorResponse(res, 400, "Skill tidak ditemukan");

    const update = await prisma.user_skills.update({
      where: { id },
      data: {
        skill,
      },
    });

    successResponse(res, 200, "Berhasil update data skill", update);
  } catch (error) {
    console.error(error);
    errorResponse(res, 500, "Internal server error");
  }
};

// Hapus event
exports.deleteSkill = async (req, res) => {
  try {
    const { id } = req.params;

    const skil = await prisma.user_skills.findUnique({ where: { id } });
    if (!skil) return errorResponse(res, 404, "Skill tidak ditemukan");

    await prisma.user_skills.delete({ where: { id } });

    successResponse(res, 200, "Data skill berhasil dihapus");
  } catch (error) {
    console.error(error);
    errorResponse(res, 500, "Internal server error");
  }
};

exports.updateBulkSkill = async (req, res) => {
  try {
    const { user_id, skills } = req.body;

    if (!Array.isArray(skills) || skills.length === 0) {
      return errorResponse(
        res,
        400,
        "Data skill harus berupa array dan tidak boleh kosong"
      );
    }

    const skillIds = skills.map((s) => s.id);
    const existingSkills = await prisma.user_skills.findMany({
      where: {
        id: { in: skillIds },
        user_id: user_id,
      },
    });

    if (existingSkills.length !== skills.length) {
      return errorResponse(
        res,
        400,
        "Beberapa skill tidak ditemukan atau tidak sesuai dengan user"
      );
    }

    const updatePromises = skills.map(({ id, rating, penilai }) =>
      prisma.user_skills.update({
        where: { id },
        data: { rating, penilai },
      })
    );

    await prisma.$transaction(updatePromises);

    successResponse(res, 200, "Berhasil update rating dan penilai pada skill");
  } catch (error) {
    console.error(error);
    errorResponse(res, 500, "Internal server error");
  }
};
