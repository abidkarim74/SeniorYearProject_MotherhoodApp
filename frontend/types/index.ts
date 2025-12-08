export interface VaccineDoseInfo {
  dose_num: number;
  dose_name: string;
  schedule_id: string;
  min_age_days: number;
  max_age_days: number | null;
  child_current_age_days: number;
  is_age_eligible: boolean;
}

export interface PendingVaccine {
  vaccine_id: string;
  vaccine_name: string;
  description: string | null;
  protect_against: string | null;
  is_mandatory: boolean;
  doses_needed: number;
  dose_info: VaccineDoseInfo;
}

export interface ChildData {
  child_id: string;
  firstname: string;
  lastname: string;
  date_of_birth: string;
  age_days: number;
  total_pending_vaccines: number;
  pending_vaccines?: PendingVaccine[];
}

export interface PendingVaccinesResponse {
  total_children: number;
  total_pending_vaccines: number;
  children: ChildData[];
}