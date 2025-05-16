"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            접근 권한 없음
          </CardTitle>
          <CardDescription className="text-center">
            이 페이지에 접근할 수 있는 권한이 없습니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-600">
            로그인이 필요하거나 세션이 만료되었을 수 있습니다.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button onClick={() => router.push("/login")} className="w-full">
            로그인 페이지로 이동
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
