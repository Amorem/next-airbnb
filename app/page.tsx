import prisma from "./lib/db";
import { MapFilterItems } from "./components/MapFilterItems";
import { ListingCard } from "./components/ListingCard";
import { Suspense } from "react";
import { SkeletonCard } from "./components/SkeletonCard";
import { NoItems } from "./components/NoItems";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

async function getData({
  searchParams,
  userId,
  
}: {
  searchParams?: { filter?: string 
    country?: string
    guest?: string
    room?: string
    bathroom?: string};
    userId?: string | undefined;
  
}) {
  const data = await prisma.home.findMany({
    where: {
      addedCategory: true,
      addedDescription: true,
      addedLocation: true,
      categoryName: searchParams?.filter ?? undefined,
      country: searchParams?.country ?? undefined,
      guests: searchParams?.guest ?? undefined,
      bathrooms: searchParams?.bathroom ?? undefined,
      bedrooms: searchParams?.room ?? undefined,
    },
    select: {
      photo: true,
      id: true,
      price: true,
      description: true,
      country: true,
      Favorite: {
        where: {
          userId: userId ?? undefined,
        },
      },
    },
  });
  return data;
}

export default function Home({
  searchParams,
}: {
    searchParams?: {
      filter?: string
      country?: string
      guest?: string
      room?: string
      bathroom?: string};
}) {
  return (
    <div className="container mx-auto px-5 lg:px-10">
      <MapFilterItems />
      <Suspense fallback={<SkeletonLoading />} key={searchParams?.filter}>
        <ShowItems searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function ShowItems({
  searchParams,
}: {
    searchParams?: {
    filter?: string
    country?: string
    guest?: string
    room?: string
    bathroom?: string
      
    };
}) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  const data = await getData({ searchParams: searchParams, userId: user?.id });
  return (
    <>
      {data.length === 0 ? (
        <NoItems
          title="Sorry no listings found for this category"
          description="Please check a other category or create your own listing!"
        />
      ) : (
        <div className="grid lg:grid-cols-4 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-8">
          {data.map((home) => (
            <ListingCard
              key={home.id}
              description={home.description as string}
              imagePath={home.photo as string}
              location={home.country as string}
              price={home.price as number}
              userId={user?.id as string | undefined}
              favoriteId={home.Favorite[0]?.id as string}
              isInFavoriteList={home.Favorite.length > 0}
              homeId={home.id as string}
              pathName="/"
            />
          ))}
        </div>
      )}
    </>
  );
}

function SkeletonLoading() {
  return (
    <div className="grid lg:grid-cols4 sm:grid-cols-2 md:grid-cols-3 gap-8 mt8">
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
    </div>
  );
}
