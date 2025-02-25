import { VideoProviderFactory } from '../factory';
import { ProviderConfig } from '../types';

describe('VideoProviderFactory', () => {
  const config: ProviderConfig = {
    apiKey: 'test-api-key',
    apiSecret: 'test-api-secret',
    environment: 'development',
    userId: 'test-user',
    userRole: 'visitor',
    facilityId: 'test-facility'
  };

  afterEach(async () => {
    await VideoProviderFactory.destroyAll();
  });

  test('should create Twilio provider', async () => {
    const provider = await VideoProviderFactory.create('twilio', config);
    expect(provider).toBeDefined();
  });

  test('should create Daily provider', async () => {
    const provider = await VideoProviderFactory.create('daily', config);
    expect(provider).toBeDefined();
  });

  test('should create Google Meet provider', async () => {
    const provider = await VideoProviderFactory.create('google-meet', config);
    expect(provider).toBeDefined();
  });

  test('should reuse existing provider instance', async () => {
    const provider1 = await VideoProviderFactory.create('twilio', config);
    const provider2 = await VideoProviderFactory.create('twilio', config);
    expect(provider1).toBe(provider2);
  });

  test('should throw error for unsupported provider', async () => {
    await expect(VideoProviderFactory.create('unsupported' as any, config))
      .rejects.toThrow('Unsupported provider: unsupported');
  });

  test('should destroy provider', async () => {
    await VideoProviderFactory.create('twilio', config);
    await expect(VideoProviderFactory.destroy('twilio'))
      .resolves.not.toThrow();
  });

  test('should destroy all providers', async () => {
    await VideoProviderFactory.create('twilio', config);
    await VideoProviderFactory.create('daily', config);
    await expect(VideoProviderFactory.destroyAll())
      .resolves.not.toThrow();
  });
});
