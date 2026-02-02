import { revalidatePath } from "next/cache"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { secret, handles } = body as {
    secret?: string
    handles?: string[]
  }

  if (!secret || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ message: "Invalid secret" }, { status: 401 })
  }

  if (!handles || !Array.isArray(handles) || handles.length === 0) {
    return NextResponse.json(
      { message: "Missing or empty handles array" },
      { status: 400 }
    )
  }

  const countryCode = process.env.NEXT_PUBLIC_DEFAULT_REGION || "mx"
  const revalidated: string[] = []

  for (const handle of handles) {
    const path = `/${countryCode}/products/${handle}`
    revalidatePath(path)
    revalidated.push(path)
  }

  // Also revalidate the home page and collections since product changes
  // may affect listings
  revalidatePath(`/${countryCode}`)
  revalidated.push(`/${countryCode}`)

  return NextResponse.json({
    revalidated,
    now: Date.now(),
  })
}
