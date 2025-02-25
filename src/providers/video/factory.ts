import { VideoProvider, ProviderConfig } from './types';

type SupportedProvider = 'twilio' | 'daily' | 'google-meet';

export class VideoProviderFactory {
  private static providers = new Map<string, VideoProvider>();

  static async create(
    provider: SupportedProvider,
    config: ProviderConfig
  ): Promise<VideoProvider> {
    const existingProvider = this.providers.get(provider);
    if (existingProvider) {
      return existingProvider;
    }

    let newProvider: VideoProvider;

    switch (provider) {
      case 'twilio':
        const { TwilioProvider } = await import('./providers/twilio/index');
        newProvider = new TwilioProvider();
        await newProvider.initialize(config);
        break;
      case 'daily':
        const { DailyProvider } = await import('./providers/daily/index');
        newProvider = new DailyProvider();
        await newProvider.initialize(config);
        break;
      case 'google-meet':
        const { GoogleMeetProvider } = await import('./providers/google-meet/index');
        newProvider = new GoogleMeetProvider();
        await newProvider.initialize(config);
        break;
      default:
        throw new Error(`Unsupported provider: ${provider}`);
    }

    await newProvider.initialize(config);
    this.providers.set(provider, newProvider);
    return newProvider;
  }

  static async destroy(provider: SupportedProvider): Promise<void> {
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
export const createVideoProvider = VideoProviderFactory.create.bind(VideoProviderFactory);
