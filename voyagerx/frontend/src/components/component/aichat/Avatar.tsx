import Image from "next/image"

interface AvatarProps {
  src: string
  alt: string
}

export default function Avatar({ src, alt }: AvatarProps) {
  return (
    <div className="w-8 h-8 rounded-full overflow-hidden bg-white bg-opacity-20 backdrop-blur-md">
      <Image src={ src || "/placeholder.svg"} alt={alt} width={32} height={32} />
    </div>
  )
}

