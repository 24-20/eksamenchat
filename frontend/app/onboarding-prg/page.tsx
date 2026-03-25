"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import logodark from "@/public/logodar.png";
import logolight from "@/public/logolight.png";

const REFERRAL_OPTIONS = [
  { id: "bekjente", label: "Bekjente" },
  { id: "tiktok", label: "TikTok" },
  { id: "instagram", label: "Instagram" },
  { id: "fysisk-plakat", label: "Fysisk plakat" },
] as const;

export default function OnboardingPrgPage() {
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [selectedReferral, setSelectedReferral] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const logoSrc = resolvedTheme === "dark" ? logodark : logolight;

  const handleContinue = () => {
    // TODO: persist selectedReferral to user profile/backend
    router.push("/c");
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-md flex flex-col items-center gap-8">
        {/* Collab logo: Skolechat x Org */}
        {mounted && (
          <div className="flex items-center gap-3">
            <Image
              src={logoSrc}
              alt="Skolechat"
              width={80}
              height={30}
              priority
            />
            <span className="text-muted-foreground text-xl font-light select-none">
              &times;
            </span>
            <span className="text-xl font-semibold tracking-tight">
              PRG
            </span>
          </div>
        )}

        {/* Referral question */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-xl text-center">
              Hvordan h&oslash;rte du om oss?
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {REFERRAL_OPTIONS.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setSelectedReferral(option.id)}
                className={`w-full rounded-lg border px-4 py-3 text-left text-sm font-medium transition-colors
                  ${
                    selectedReferral === option.id
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-card text-card-foreground hover:bg-accent"
                  }`}
              >
                {option.label}
              </button>
            ))}

            <Button
              className="w-full mt-4"
              disabled={!selectedReferral}
              onClick={handleContinue}
            >
              Fortsett
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
