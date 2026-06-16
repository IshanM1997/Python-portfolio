export interface LikeResponse  { count: number; updated_at?: string; }
export interface Project       { title: string; description: string; tags: string[]; githubUrl: string; }
export interface Certificate   { title: string; issuer: string; issuedDate: string; credentialId: string; viewUrl: string; }
export interface Skill         { name: string; iconClass?: string; color?: string; svgContent?: string; svgBg?: string; }
export type AboutTab = 'technical' | 'creative';
export type WorkTab  = 'projects'  | 'certs';
