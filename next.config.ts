import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ['@tamagui/lucide-icons'],
  turbopack: {
    resolveAlias: {
      'react-native': 'react-native-web',
      'react-native-svg': '@tamagui/react-native-svg',
    },
  },
};

export default nextConfig;
