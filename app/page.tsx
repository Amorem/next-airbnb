import prisma from "./lib/db";
import { MapFilterItems } from "./components/MapFilterItems";
import { ListingCard } from "./components/ListingCard";

async function getData({
  searchParams,
}: {
  searchParams?: { filter?: string };
}) {
  const data = await prisma.home.findMany({
    where: {
      addedCategory: true,
      addedDescription: true,
      addedLocation: true,
      categoryName: searchParams?.filter ?? undefined,
    },
    select: {
      photo: true,
      id: true,
      price: true,
      description: true,
      country: true,
    },
  });
  return data;
}

export default async function Home({
  searchParams,
}: {
  searchParams?: { filter?: string };
}) {
  const data = await getData({ searchParams: searchParams });
  return (
    <div className="container mx-auto px-5 lg:px-10">
      <MapFilterItems />
      <div className="grid lg:grid-cols-4 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-8">
        {data.map((home) => (
          <ListingCard
            key={home.id}
            description={home.description as string}
            imagePath={home.photo as string}
            location={home.country as string}
            price={home.price as number}
          />
        ))}
      </div>
    </div>
  );
}
