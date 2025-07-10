import { clsx, type ClassValue } from "clsx";
import { NextResponse } from "next/server";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function response<T = unknown>(
  success: boolean,
  statusCode: number,
  payload: T
) {
  return NextResponse.json({
    success,
    status: statusCode,
    data: success ? payload : null,
    error: success ? null : payload,
  });
}
