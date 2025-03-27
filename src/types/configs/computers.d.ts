export interface ComputerType {
  id?: number;
  adress?: string;
  about?: string;
  platform?: string;
  version?: string;
  build_number?: string;
  CPU?: string;
  cores?: number;
  model?: string;
  Nic_name?: string;
  Mac_adress?: string;
  Aviable?: string;
  Ram?: number;
  Disk_D?: number;
  Disk_C?: number;
}
export interface ComputersType {
  computerName: string;
  hostname: string;
  id: string;
  os: string;
  status: string;
  ipAddress: string;
}

export interface computersbyIdType {
  os_details?: {
    os?: string;
    platform?: string;
    buildNumber?: string;
    version?: string;
  };
  processor_details?: {
    cpu?: string;
    core?: string;
    generation?: string;
  };
  network_details: NetworkDetail[];

  memory_storage_details?: {
    ram?: string;
    drives: RamType[];
  };
}
// "id": "73198df4-acff-4ec8-8a62-c8e923e630f9",
//   "os_details": {
//     "os": "Windows",
//     "platform": "Windows 11 Pro",
//     "buildNumber": "22621.1702",
//     "version": "11.0.22621"
//   },
//   "processor_details": {
//     "cpu": "Intel Core i7-12700K",
//     "core": "12",
//     "generation": "12th Gen"
//   },
//   "network_details": [
//     {
//       "nicName": "Ethernet",
//       "ipAddress": "192.168.1.2",
//       "macAddress": "00:1A:2B:3C:4D:5E",
//       "available": "Offline",
//       "type": "ethernet"
//     },
//     {
//       "nicName": "Wi-Fi",
//       "ipAddress": "192.168.1.3",
//       "macAddress": "00:1A:2B:3C:4D:5F",
//       "available": "Online",
//       "type": "wifi"
//     }
//   ],
//   "memory_storage_details": {
//     "ram": "32GB",
//     "drives": [
//       {
//         "driveName": "C",
//         "totalSize": "512GB",
//         "freeSize": "289GB"
//       },
export interface NetworkDetail {
  nicName?: string;
  ipAddress?: string;
  available?: string;
  type?: string;
  wifi_name?: string;
  either_net_name?: string;
  macAddress?: string;
  status?: string;
}

export interface RamType {
  driveName: string;
  totalSize: string;
  freeSize: string;
}

export interface ComputersAppType {
  id: string;
  name: string;
  file_size: string;
  installation_type: string;
  installed_date: string;
}
