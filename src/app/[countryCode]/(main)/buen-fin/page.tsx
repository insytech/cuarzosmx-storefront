import { redirect } from "next/navigation"
import {
  DEFAULT_PAGE_SLUG,
  getPromotionPagePath,
} from "@lib/util/store-promotion"

type Props = {
  params: Promise<{ countryCode: string }>
}

/**
 * Old address of the Buen Fin page. Promotion pages now live at
 * /promociones/[slug]; links already shared keep working through this
 * temporary redirect (307, so browsers do not cache it).
 */
export default async function BuenFinRedirect({ params }: Props) {
  const { countryCode } = await params
  redirect(`/${countryCode}${getPromotionPagePath(DEFAULT_PAGE_SLUG)}`)
}
