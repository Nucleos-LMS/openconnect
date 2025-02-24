import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { FacilitySettings } from '../FacilitySettings';
import { getFacilitySettings, updateFacilitySettings } from '../api';

jest.mock('../api', () => ({
  getFacilitySettings: jest.fn(),
  updateFacilitySettings: jest.fn()
}));

const mockSettings = {
  requirements: {
    idRequired: true,
    additionalDocuments: [],
    visitationHours: '9:00-17:00'
  },
  webrtc: {
    iceServers: [],
    maxBitrate: 1000,
    fallbackToRelay: true
  },
  monitoring: {
    enableAiMonitoring: false,
    recordCalls: true,
    retentionDays: 30
  }
};

describe('FacilitySettings', () => {
  beforeEach(() => {
    (getFacilitySettings as jest.Mock).mockResolvedValue(mockSettings);
    (updateFacilitySettings as jest.Mock).mockResolvedValue(undefined);
  });

  it('loads initial settings', async () => {
    render(
      <FacilitySettings
        facilityId="123"
        onSave={jest.fn()}
        onError={jest.fn()}
      />
    );

    await waitFor(() => {
      expect(getFacilitySettings).toHaveBeenCalledWith('123');
    });

    expect(screen.getByLabelText('Require ID Verification')).toBeChecked();
    expect(screen.getByLabelText('Visitation Hours')).toHaveValue('9:00-17:00');
  });

  it('validates and saves settings', async () => {
    const onSave = jest.fn();
    const onError = jest.fn();

    render(
      <FacilitySettings
        facilityId="123"
        onSave={onSave}
        onError={onError}
      />
    );

    await waitFor(() => {
      expect(getFacilitySettings).toHaveBeenCalled();
    });

    // Change some settings
    fireEvent.change(screen.getByLabelText('Visitation Hours'), {
      target: { value: '10:00-18:00' }
    });

    fireEvent.click(screen.getByText('Save Settings'));

    await waitFor(() => {
      expect(updateFacilitySettings).toHaveBeenCalledWith('123', {
        ...mockSettings,
        requirements: {
          ...mockSettings.requirements,
          visitationHours: '10:00-18:00'
        }
      });
    });

    expect(onSave).toHaveBeenCalled();
    expect(onError).not.toHaveBeenCalled();
  });

  it('handles validation errors', async () => {
    const onError = jest.fn();

    render(
      <FacilitySettings
        facilityId="123"
        onSave={jest.fn()}
        onError={onError}
      />
    );

    await waitFor(() => {
      expect(getFacilitySettings).toHaveBeenCalled();
    });

    // Set invalid visitation hours
    fireEvent.change(screen.getByLabelText('Visitation Hours'), {
      target: { value: 'invalid' }
    });

    fireEvent.click(screen.getByText('Save Settings'));

    expect(onError).toHaveBeenCalled();
    expect(updateFacilitySettings).not.toHaveBeenCalled();
  });
});
