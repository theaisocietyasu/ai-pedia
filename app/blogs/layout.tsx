import { blogsMetadata } from "./metadata"

export const metadata = blogsMetadata

export default function BlogsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
