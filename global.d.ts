interface Window {
    gtag: (command: string, gaTrackingId: string, config: object) => void;
    dataLayer: any[];
  }