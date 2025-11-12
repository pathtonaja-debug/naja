// Device ID utility for non-authenticated storage
// Generates and persists a unique device identifier

const DEVICE_ID_KEY = 'naja_device_id';

export function getDeviceId(): string {
  let deviceId = localStorage.getItem(DEVICE_ID_KEY);
  
  if (!deviceId) {
    deviceId = `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem(DEVICE_ID_KEY, deviceId);
  }
  
  return deviceId;
}

export function clearDeviceId(): void {
  localStorage.removeItem(DEVICE_ID_KEY);
}
