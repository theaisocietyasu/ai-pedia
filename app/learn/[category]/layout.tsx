import { Footer } from "@/components/ui/footer";

export default function CategoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <div className="mt-32">
        <Footer />
      </div>
    </>
  );
}
