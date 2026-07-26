import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.starspark.live",
  appName: "StarSpark Live",
  webDir: "mobile-dist",
  backgroundColor: "#0d071c",
  android: {
    allowMixedContent: false,
  },
};

export default config;
