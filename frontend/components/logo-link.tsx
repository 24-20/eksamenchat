// components/LogoLink.tsx
'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import logodark from '../public/logodar.png'

import logolight from '../public/logolight.png'



const LogoLink = () => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent rendering until mounted to avoid hydration mismatch
  if (!mounted) return null;

  const logoSrc = resolvedTheme === 'dark' ? logodark : logolight;

  return (
    <Link href="/" passHref>
      <Image
        src={logoSrc}
        alt="Logo"
        width={80}
        height={30}
        priority
      />
    </Link>
  );
};

export default LogoLink;
