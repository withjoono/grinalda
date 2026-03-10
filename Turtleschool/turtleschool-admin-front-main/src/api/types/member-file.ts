export interface IMemberFile {
  id: string;
  file_path: string;
  file_type: string;
  create_dt: Date;
  member_id: string;
  member_nickname: string | null;
  member_email: string | null;
}
