export interface LaunchpadData {
  id: string;
  title: any;
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
  serverDetails: {
    lisenceCount: string;
    ipAddress: string;
    serverVersion: string;
    serverFileSize: string;
  };
  agentDetails: {
    firstUploadDate: string;
    lastUploadDate: string;
    agentVersion: string;
    agentFileSize: string;
  };
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
export interface CreateAppPayload {
  appName: string;
  file: File;
  argument: string;
  computerIds: string[];
}
