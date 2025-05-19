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
  operation_system: string;
  status: string;
  ip_address: string;
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
    model?: string;
  };
  network_adapters: NetworkDetail[];

  memory_storage_details?: {
    ram?: string;
    drives: RamType[];
  };
}
export interface NetworkDetail {
  nic_name?: string;
  available?: string;
  type?: string;
  wifi_name?: string;
  either_net_name?: string;
  mac_address?: string;
  status?: string;
  Ethernet: string;
  ip_address: number;
}
export interface EditInfoApplication {
  host: string;
  port: number;
  username: string;
  password: string;
  productId: string;
}
export interface EditApplication {
  id: string;
  file: File | null;
  args?: string | undefined;
}

export interface RamType {
  drive_name: string;
  total_size: string;
  free_size: string;
}

export interface ComputersAppType {
  id: string;
  name: string;
  size: string;
  type: string;
  installed_date: string;
  version: string;
}
