// src/common/utils/user-agent-parser.util.ts

export interface ParsedUserAgent {
  browser: string;
  os: string;
  device: string;
  deviceType: 'mobile' | 'tablet' | 'desktop' | 'unknown';
  raw: string;
}

export class UserAgentParser {
  /**
   * Parse user agent string
   */
  static parse(userAgent: string): ParsedUserAgent {
    if (!userAgent) {
      return {
        browser: 'Unknown',
        os: 'Unknown',
        device: 'Unknown',
        deviceType: 'unknown',
        raw: '',
      };
    }

    return {
      browser: this.getBrowser(userAgent),
      os: this.getOS(userAgent),
      device: this.getDevice(userAgent),
      deviceType: this.getDeviceType(userAgent),
      raw: userAgent,
    };
  }

  /**
   * Get browser name from user agent
   */
  private static getBrowser(ua: string): string {
    if (ua.includes('Edg/')) return 'Edge';
    if (ua.includes('Chrome/')) return 'Chrome';
    if (ua.includes('Safari/') && !ua.includes('Chrome')) return 'Safari';
    if (ua.includes('Firefox/')) return 'Firefox';
    if (ua.includes('Opera/') || ua.includes('OPR/')) return 'Opera';
    if (ua.includes('MSIE') || ua.includes('Trident/'))
      return 'Internet Explorer';
    if (ua.includes('SamsungBrowser/')) return 'Samsung Browser';
    if (ua.includes('UCBrowser/')) return 'UC Browser';
    return 'Unknown Browser';
  }

  /**
   * Get operating system from user agent
   */
  private static getOS(ua: string): string {
    if (ua.includes('Windows NT 10.0')) return 'Windows 10';
    if (ua.includes('Windows NT 6.3')) return 'Windows 8.1';
    if (ua.includes('Windows NT 6.2')) return 'Windows 8';
    if (ua.includes('Windows NT 6.1')) return 'Windows 7';
    if (ua.includes('Windows')) return 'Windows';

    if (ua.includes('Mac OS X')) {
      const match = ua.match(/Mac OS X (\d+[._]\d+[._]?\d*)/);
      if (match) {
        const version = match[1].replace(/_/g, '.');
        return `macOS ${version}`;
      }
      return 'macOS';
    }

    if (ua.includes('Android')) {
      const match = ua.match(/Android (\d+\.?\d*)/);
      return match ? `Android ${match[1]}` : 'Android';
    }

    if (ua.includes('iPhone') || ua.includes('iPad')) {
      const match = ua.match(/OS (\d+_\d+)/);
      if (match) {
        const version = match[1].replace(/_/g, '.');
        return `iOS ${version}`;
      }
      return 'iOS';
    }

    if (ua.includes('Linux')) return 'Linux';
    if (ua.includes('Ubuntu')) return 'Ubuntu';
    if (ua.includes('CrOS')) return 'Chrome OS';

    return 'Unknown OS';
  }

  /**
   * Get device name from user agent
   */
  private static getDevice(ua: string): string {
    // Mobile devices
    if (ua.includes('iPhone')) return 'iPhone';
    if (ua.includes('iPad')) return 'iPad';
    if (ua.includes('iPod')) return 'iPod';

    // Android devices
    if (ua.includes('Android')) {
      // Try to extract device model
      const patterns = [
        /Android.*;\s*([^;)]+)\s+Build/,
        /Android.*;\s*([^;)]+)\)/,
      ];

      for (const pattern of patterns) {
        const match = ua.match(pattern);
        if (match && match[1]) {
          return match[1].trim();
        }
      }
      return 'Android Device';
    }

    // Desktop
    if (ua.includes('Windows')) return 'Windows PC';
    if (ua.includes('Macintosh')) return 'Mac';
    if (ua.includes('Linux')) return 'Linux PC';

    return 'Unknown Device';
  }

  /**
   * Get device type from user agent
   */
  private static getDeviceType(
    ua: string,
  ): 'mobile' | 'tablet' | 'desktop' | 'unknown' {
    // Mobile
    if (
      ua.includes('Mobile') ||
      ua.includes('iPhone') ||
      ua.includes('iPod') ||
      (ua.includes('Android') && !ua.includes('Tablet'))
    ) {
      return 'mobile';
    }

    // Tablet
    if (
      ua.includes('iPad') ||
      ua.includes('Tablet') ||
      (ua.includes('Android') && !ua.includes('Mobile'))
    ) {
      return 'tablet';
    }

    // Desktop
    if (
      ua.includes('Windows') ||
      ua.includes('Macintosh') ||
      ua.includes('Linux')
    ) {
      return 'desktop';
    }

    return 'unknown';
  }

  /**
   * Get a human-readable device name
   */
  static getDeviceName(userAgent: string): string {
    const parsed = this.parse(userAgent);

    if (parsed.device !== 'Unknown Device' && parsed.device !== 'Unknown') {
      return parsed.device;
    }

    return `${parsed.browser} on ${parsed.os}`;
  }

  /**
   * Check if device is mobile
   */
  static isMobile(userAgent: string): boolean {
    const parsed = this.parse(userAgent);
    return parsed.deviceType === 'mobile' || parsed.deviceType === 'tablet';
  }
}
