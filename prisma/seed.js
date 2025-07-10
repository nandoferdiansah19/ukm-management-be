const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const users = [
    {
      name: "Aditya Saputra",
      nim: "201080100001",
      program_study: "Ilmu Komunikasi",
      year: "2020",
      phone: "081234567890",
      address: "Jl. Mawar No.1",
      division: "Media",
      role: "admin", // ✅ Jadi admin
    },
    {
      name: "Rizki Amelia",
      nim: "211080200002",
      program_study: "Hukum",
      year: "2021",
      phone: "081234567891",
      address: "Jl. Anggrek No.2",
      division: "Sekretaris",
    },
    {
      name: "Dewi Lestari",
      nim: "221080300003",
      program_study: "Manajemen",
      year: "2022",
      phone: "081234567892",
      address: "Jl. Kenanga No.3",
      division: "Bendahara",
    },
    {
      name: "Fajar Prasetyo",
      nim: "231080400004",
      program_study: "Kedokteran",
      year: "2023",
      phone: "081234567893",
      address: "Jl. Dahlia No.4",
      division: "Logistik",
    },
    {
      name: "Siti Nurhaliza",
      nim: "241080500005",
      program_study: "Sastra Inggris",
      year: "2024",
      phone: "081234567894",
      address: "Jl. Melati No.5",
      division: "Humas",
    },
    {
      name: "Agung Nugroho",
      nim: "201080600006",
      program_study: "Ilmu Komunikasi",
      year: "2020",
      phone: "081234567895",
      address: "Jl. Kamboja No.6",
      division: "Acara",
    },
    {
      name: "Rina Kartika",
      nim: "211080700007",
      program_study: "Manajemen",
      year: "2021",
      phone: "081234567896",
      address: "Jl. Flamboyan No.7",
      division: "Publikasi",
    },
    {
      name: "Taufik Hidayat",
      nim: "221080800008",
      program_study: "Informatika",
      year: "2022",
      phone: "081234567897",
      address: "Jl. Teratai No.8",
      division: "Multimedia",
    },
    {
      name: "Yuni Permata",
      nim: "231080900009",
      program_study: "Hukum",
      year: "2023",
      phone: "081234567898",
      address: "Jl. Cempaka No.9",
      division: "Sekretaris",
    },
    {
      name: "Budi Santoso",
      nim: "241081000010",
      program_study: "Sastra Inggris",
      year: "2024",
      phone: "081234567899",
      address: "Jl. Nusa Indah No.10",
      division: "Keamanan",
    },
  ];

  for (const user of users) {
    const hashedPassword = await bcrypt.hash(user.nim, 10);
    await prisma.users.create({
      data: {
        ...user,
        password: hashedPassword,
        role: user.role || "anggota", // 🟢 Default ke "anggota" kalau tidak didefinisikan
      },
    });
  }

  console.log("✅ Sukses seeding 10 user (1 admin)");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
