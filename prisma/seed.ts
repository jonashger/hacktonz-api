import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient({
  log: ["query", "info", "warn"],
});

async function main() {
  const futebol = await prisma.modality.create({
    data: {
      description: "Futebol",
    },
  });

  const volei = await prisma.modality.create({
    data: {
      description: "Volêi",
    },
  });

  const basquete = await prisma.modality.create({
    data: {
      description: "Basquete",
    },
  });

  const tenis = await prisma.modality.create({
    data: {
      description: "Tênis",
    },
  });

  const academia = await prisma.modality.create({
    data: {
      description: "Academia",
    },
  });

  const piscina = await prisma.modality.create({
    data: {
      description: "Piscina",
    },
  });

  const quadra = await prisma.modality.create({
    data: {
      description: "Quadra",
    },
  });

  const futsal = await prisma.modality.create({
    data: {
      description: "Futsal",
    },
  });

  const campo = await prisma.modality.create({
    data: {
      description: "Campo",
    },
  });

  const society = await prisma.modality.create({
    data: {
      description: "Society",
    },
  });

  const aabb = await prisma.place.create({
    data: {
      address: "Rua dos Bobos, 0",
      description: "AABB",
    },
  });

  const SalaoSaoJorge = await prisma.place.create({
    data: {
      address: "Rua dos Bobos, 0",
      description: "Salão São Jorge",
    },
  });

  const GinasioSalete = await prisma.place.create({
    data: {
      address: "Rua dos Bobos, 0",
      description: "Ginásio Salete",
    },
  });

  const GinasioSaoSebastiao = await prisma.place.create({
    data: {
      address: "Rua dos Bobos, 0",
      description: "Ginásio São Sebastião",
    },
  });

  const abecelesc = await prisma.place.create({
    data: {
      address: "Rua dos Bobos, 0",
      description: "Abecelesc",
    },
  });

  const BelaVista = await prisma.place.create({
    data: {
      address: "Rua dos Bobos, 0",
      description: "Bela Vista",
    },
  });

  const modalitis = [
    { place: aabb, modality: futebol },
    { place: aabb, modality: volei },
    { place: aabb, modality: society },
    { place: aabb, modality: basquete },
    { place: aabb, modality: piscina },
    { place: SalaoSaoJorge, modality: futsal },
    { place: SalaoSaoJorge, modality: volei },
    { place: abecelesc, modality: campo },
    { place: abecelesc, modality: society },
    { place: BelaVista, modality: society },
    { place: GinasioSaoSebastiao, modality: futsal },
    { place: GinasioSaoSebastiao, modality: volei },
  ];

  for (const modality of modalitis) {
    await prisma.modalityPlace.create({
      data: {
        placeId: modality.place.id,
        modalityId: modality.modality.id,
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
