import Image from "next/image";

export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <div className="w-full h-screen flex justify-center items-center">
      <Image src="/loading.svg" alt="loading" width={500} height={500} className="-mt-24" />
    </div>
  );
}
