import dynamic from "next/dynamic";

const Bozo = dynamic(() => import("@/components/Bozo"), { ssr: false });

export default function Home() {
  return <Bozo />;
}
