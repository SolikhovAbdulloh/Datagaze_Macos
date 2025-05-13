export interface LaunchpadData {
  id: string;
  icon?: any;
  applicationName: string;
  img: string;
  link?: string;
  License_count?: number;
  Agent_version?: string;
  adress?: string;
  File_size?: string;
  First_upload_date?: string;
  Last_upload_date?: string;
  CPU?: string;
  Network?: string;
  Storage?: string;
  agentVersion: string;
  isInstalled: boolean;
  pathToIcon: string;
  publisher: string;
  serverFileSize: string;
  serverVersion: string;
}
export interface InstallAppInfoType {
  applicationName?: string;
  cpu?: string;
  id: string;
  networkBandwidth?: string;
  pathToIcon?: string;
  publisher?: string;
  ram?: string;
  releaseDate?: string;
  storage?: string;
  webVersion?: string;
}
