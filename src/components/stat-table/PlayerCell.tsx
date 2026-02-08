import Image from "next/image";

interface PlayerCellProps {
  name: string;
  headshotUrl: string | null;
}

export function PlayerCell({ name, headshotUrl }: PlayerCellProps) {
  return (
    <div className="flex items-center gap-2">
      {headshotUrl ? (
        <Image
          src={headshotUrl}
          alt={name}
          width={24}
          height={24}
          className="rounded-full object-cover"
          unoptimized
        />
      ) : (
        <div className="h-6 w-6 rounded-full bg-border" />
      )}
      <span className="truncate font-medium">{name}</span>
    </div>
  );
}
