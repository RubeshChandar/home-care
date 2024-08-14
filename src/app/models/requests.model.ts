export interface Requests {
  date: string;
  startTime: string;
  endTime: string;
  notes?: string;
};

export interface UnAssigned extends Requests {
  assigned?: boolean;
}

export interface Assigned extends UnAssigned {
  carerNote?: string;
  carerName?: string;
}
