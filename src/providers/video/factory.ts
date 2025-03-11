import { VideoProvider, ProviderConfig } from './types';
import { BaseVideoProvider } from './providers/base';

type SupportedProvider = 'twilio' | 'daily' | 'google-meet';

export class VideoProviderFactory {
  private static providers = new Map<string, BaseVideoProvider>();

  static async create(
    config: ProviderConfig,
    provider?: SupportedProvider
  ): Promise<VideoProvider> {
    // Use environment variable if provider not specified
    // With fallback to 'twilio' if environment variable is not set
    const providerType = provider || 
      (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_DEFAULT_VIDEO_PROVIDER as SupportedProvider) || 
      'twilio';
    
    const existingProvider = this.providers.get(providerType);
    if (existingProvider) {
      return existingProvider;
    }

    let newProvider: BaseVideoProvider;

    switch (providerType) {
      case 'twilio':
        const { TwilioProvider } = await import('./providers/twilio/index');
        newProvider = new TwilioProvider(config);
        break;
      case 'daily':
        const { DailyProvider } = await import('./providers/daily/index');
        newProvider = new DailyProvider(config);
        break;
      case 'google-meet':
        const { GoogleMeetProvider } = await import('./providers/google-meet/index');
        newProvider = new GoogleMeetProvider(config);
        break;
      default:
        throw new Error(`Unsupported provider: ${provider}`);
    }

    await newProvider.initialize(config);
    this.providers.set(providerType, newProvider);
    return newProvider;
  }

  static async destroy(provider?: SupportedProvider): Promise<void> {
    if (!provider) {
      return this.destroyAll();
    }
    const existingProvider = this.providers.get(provider);
    if (existingProvider) {
      await existingProvider.disconnect();
      this.providers.delete(provider);
    }
  }

  static async destroyAll(): Promise<void> {
    for (const [provider, instance] of this.providers.entries()) {
      await instance.disconnect();
      this.providers.delete(provider);
    }
  }
}

// Export the VideoProvider type and factory
export type { VideoProvider };
export const createVideoProvider = (provider?: SupportedProvider, config: ProviderConfig = {}) => {
  return VideoProviderFactory.create(config, provider);
};
