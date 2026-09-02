import { ImageResponse } from "next/og";
import {
  SOCIAL_PREVIEW_ALT,
  SOCIAL_PREVIEW_SIZE,
  SocialPreviewImage,
} from "@/components/social/SocialPreviewImage";

export const alt = SOCIAL_PREVIEW_ALT;
export const size = SOCIAL_PREVIEW_SIZE;
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(<SocialPreviewImage />, size);
}
