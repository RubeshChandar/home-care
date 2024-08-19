export interface Requests {
  date: string;
  startTime: string | number;
  endTime: string | number;
  notes?: string;
  id?: string;
};

export interface UnAssigned extends Requests {
  assigned?: boolean;
}

export interface Assigned extends UnAssigned {
  carerNote?: string;
  carerName?: string;
}
