import { FacilitySettings } from './validation';

export async function getFacilitySettings(facilityId: string): Promise<FacilitySettings> {
  const res = await fetch(`/api/facilities/${facilityId}/settings`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message);
  }

  return res.json();
}

export async function updateFacilitySettings(
  facilityId: string,
  settings: FacilitySettings
): Promise<void> {
  const res = await fetch(`/api/facilities/${facilityId}/settings`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(settings)
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message);
  }
}
