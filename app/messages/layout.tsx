import dynamic from "next/dynamic";

const NoSSR = dynamic(() => import("./MessagesLayoutNOSSR"), { ssr: false });

export default function Layout({ children }: { children: React.ReactNode }) {
  return <NoSSR>{children}</NoSSR>;
}
